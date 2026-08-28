import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {
  Announcement,
  Leave,
  Workflow,
  ErpItem,
  ErpOrder,
  KnowledgeArticle,
  CompanyDocument,
  Employee
} from './entities';

// Manual env loader
try {
  const envPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of envLines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val.trim();
      }
    }
  }
} catch (e) {}

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(Announcement) private announcementRepo: Repository<Announcement>,
    @InjectRepository(Leave) private leaveRepo: Repository<Leave>,
    @InjectRepository(Workflow) private workflowRepo: Repository<Workflow>,
    @InjectRepository(ErpItem) private erpItemRepo: Repository<ErpItem>,
    @InjectRepository(ErpOrder) private erpOrderRepo: Repository<ErpOrder>,
    @InjectRepository(KnowledgeArticle) private knowledgeRepo: Repository<KnowledgeArticle>,
    @InjectRepository(CompanyDocument) private documentRepo: Repository<CompanyDocument>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  async onModuleInit() {
    this.logger.log('Checking database seed state...');
    await this.seedAnnouncements();
    await this.seedErpItems();
    await this.seedErpOrders();
    await this.seedLeavesAndWorkflows();
    await this.seedKnowledgeBase();
    await this.seedDocuments();
    await this.seedEmployees();
    
    // Background sync check
    try {
      this.logger.log('Starting background ERPNext synchronization check...');
      await this.syncERPNext();
    } catch (e) {
      this.logger.warn(`Startup ERPNext sync failed: ${e.message}`);
    }

    this.logger.log('Database check completed.');
  }


  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<Announcement[]> {
    return this.announcementRepo.find({ order: { id: 'DESC' } });
  }

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const item = this.announcementRepo.create({
      ...data,
      date: new Date().toLocaleDateString(),
    });
    return this.announcementRepo.save(item);
  }

  // --- LEAVES & WORKFLOWS ---
  async getLeaves(): Promise<Leave[]> {
    return this.leaveRepo.find({ order: { id: 'DESC' } });
  }

  async createLeave(data: Partial<Leave>): Promise<Leave> {
    const isSpecial = data.type === 'Overtime' || data.type === 'Remote Work';
    const initialStatus = isSpecial ? 'Pending Upper Manager' : 'Pending Manager';
    const leave = this.leaveRepo.create({
      ...data,
      status: initialStatus,
    });
    const savedLeave = await this.leaveRepo.save(leave);

    // Automatically trigger a workflow approval entry for the Manager
    const workflow = this.workflowRepo.create({
      type: isSpecial ? 'Leave Request (Upper Manager)' : 'Leave Request (Manager)',
      title: `${savedLeave.type} request for ${savedLeave.employeeName} (${isSpecial ? 'Upper Manager Approval Required' : 'Manager Approval Required'})`,
      requestedBy: savedLeave.employeeName,
      requestedDate: new Date().toLocaleDateString(),
      status: 'Pending',
      description: savedLeave.reason || `Request from ${savedLeave.startDate} to ${savedLeave.endDate}`,
      referenceId: savedLeave.id,
    });
    await this.workflowRepo.save(workflow);

    return savedLeave;
  }

  async getWorkflows(): Promise<Workflow[]> {
    return this.workflowRepo.find({ order: { id: 'DESC' } });
  }

  async updateWorkflowStatus(id: number, status: 'Approved' | 'Rejected', comments?: string): Promise<Workflow> {
    const workflow = await this.workflowRepo.findOne({ where: { id } });
    if (!workflow) throw new Error('Workflow not found');

    workflow.status = status;
    const updatedWorkflow = await this.workflowRepo.save(workflow);

    // Update the corresponding Leave request or ERP Order
    if (workflow.type === 'Leave Request (Manager)' || workflow.type === 'Leave Request (Upper Manager)') {
      const leave = await this.leaveRepo.findOne({ where: { id: workflow.referenceId } });
      if (leave) {
        if (status === 'Approved') {
          leave.status = 'Pending HR';
          if (comments) leave.comments = comments;
          await this.leaveRepo.save(leave);

          // Spawn next workflow step for HR
          const hrWorkflow = this.workflowRepo.create({
            type: 'Leave Request (HR)',
            title: `HR Grant: Leave request for ${leave.employeeName} (${leave.type})`,
            requestedBy: leave.employeeName,
            requestedDate: new Date().toLocaleDateString(),
            status: 'Pending',
            description: `${workflow.type.includes('Upper') ? 'Upper Manager' : 'Manager'} Approved. Reason: ${comments || 'None provided'}. HR Grant needed.`,
            referenceId: leave.id,
          });
          await this.workflowRepo.save(hrWorkflow);
        } else {
          leave.status = 'Rejected';
          if (comments) leave.comments = comments;
          await this.leaveRepo.save(leave);
        }
      }
    } else if (workflow.type === 'Leave Request (HR)') {
      const leave = await this.leaveRepo.findOne({ where: { id: workflow.referenceId } });
      if (leave) {
        leave.status = status; // 'Approved' or 'Rejected'
        if (comments) leave.comments = comments;
        await this.leaveRepo.save(leave);
      }
    } else if (workflow.type === 'Leave Request') { // Keep compatibility for old entries
      const leave = await this.leaveRepo.findOne({ where: { id: workflow.referenceId } });
      if (leave) {
        leave.status = status;
        if (comments) leave.comments = comments;
        await this.leaveRepo.save(leave);
      }
    } else if (workflow.type === 'Purchase Order Approval') {
      const po = await this.erpOrderRepo.findOne({ where: { id: workflow.referenceId } });
      if (po) {
        po.status = status;
        await this.erpOrderRepo.save(po);
      }
    }

    return updatedWorkflow;
  }

  // --- ERP ---
  async getInventory(): Promise<ErpItem[]> {
    return this.erpItemRepo.find();
  }

  async getOrders(type?: 'PO' | 'SO'): Promise<ErpOrder[]> {
    if (type) {
      return this.erpOrderRepo.find({ where: { type } });
    }
    return this.erpOrderRepo.find();
  }

  async syncERPNext(): Promise<{ success: boolean; reason?: string; status?: number }> {
    if (process.env.MOCK_ERP_SUCCESS === 'true') {
      this.logger.log('ERPNext sync override: Mock Success mode activated.');
      try {
        await this.erpItemRepo.clear();
        await this.seedErpItems();
      } catch (err) {
        this.logger.error(`Failed to re-seed items during mock sync: ${err.message}`);
      }
      return { success: true };
    }

    const erpUrl = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERP_API_KEY;
    const apiSecret = process.env.ERP_API_SECRET;

    if (!erpUrl || !apiKey || !apiSecret) {
      this.logger.warn('ERPNext sync aborted: Environment credentials are not defined.');
      return { success: false, reason: 'Credentials not configured in .env' };
    }

    try {
      const headers = {
        'Authorization': `token ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json'
      };

      this.logger.log(`Attempting connection to ERPNext: ${erpUrl}...`);
      
      const itemRes = await fetch(`${erpUrl}/api/resource/Item?fields=["item_code","item_name","item_group","valuation_rate","stock_uom"]&limit=100`, { headers });
      
      if (itemRes.status === 200) {
        const payload = await itemRes.json();
        const items = payload.data || [];
        if (items.length > 0) {
          // Clear and sync with fresh live data
          await this.erpItemRepo.clear();
          const mapped = items.map((i: any, idx: number) => ({
            code: i.item_code,
            name: i.item_name || i.item_code,
            category: i.item_group || 'General',
            quantity: 50 + (idx * 5) % 200,
            unit: i.stock_uom || 'pcs',
            price: i.valuation_rate || 10.0,
            status: 'Active',
            isLowStock: false
          }));
          await this.erpItemRepo.save(this.erpItemRepo.create(mapped));
          this.logger.log(`Sync complete: loaded ${items.length} live items from ERPNext.`);
          return { success: true };
        } else {
          return { success: false, reason: 'ERPNext returned empty Item list.' };
        }
      } else {
        const errorText = await itemRes.text();
        this.logger.error(`ERPNext sync failed with status ${itemRes.status}: ${errorText}`);
        return { success: false, status: itemRes.status, reason: `Frappe API returned ${itemRes.status}` };
      }
    } catch (err) {
      this.logger.error(`ERPNext network connection failed: ${err.message}`);
      return { success: false, reason: `Connection error: ${err.message}` };
    }
  }


  async createPurchaseOrder(data: { vendor: string; items: string; totalAmount: number }): Promise<ErpOrder> {
    const count = await this.erpOrderRepo.count({ where: { type: 'PO' } });
    const poNumber = `PO-${String(count + 1).padStart(3, '0')}`;
    
    const po = this.erpOrderRepo.create({
      orderNumber: poNumber,
      type: 'PO',
      customerOrVendor: data.vendor,
      date: new Date().toLocaleDateString(),
      totalAmount: data.totalAmount,
      status: 'Pending',
      itemDetails: data.items,
    });
    const savedPO = await this.erpOrderRepo.save(po);

    // Create a workflow approval entry
    const workflow = this.workflowRepo.create({
      type: 'Purchase Order Approval',
      title: `Approve ${poNumber} - ${data.vendor}`,
      requestedBy: 'John Doe',
      requestedDate: new Date().toLocaleDateString(),
      status: 'Pending',
      description: `Amount: $${data.totalAmount}. Items: ${data.items}`,
      referenceId: savedPO.id,
    });
    await this.workflowRepo.save(workflow);

    return savedPO;
  }

  // --- KNOWLEDGE BASE ---
  async getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
    return this.knowledgeRepo.find();
  }

  async createKnowledgeArticle(data: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    const article = this.knowledgeRepo.create(data);
    return this.knowledgeRepo.save(article);
  }

  // --- DOCUMENTS ---
  async getDocuments(): Promise<CompanyDocument[]> {
    return this.documentRepo.find({ order: { id: 'DESC' } });
  }

  async uploadDocument(data: Partial<CompanyDocument>): Promise<CompanyDocument> {
    const doc = this.documentRepo.create({
      ...data,
      uploadDate: new Date().toLocaleDateString(),
    });
    return this.documentRepo.save(doc);
  }

  // --- SEED SECTIONS ---
  private async seedAnnouncements() {
    const count = await this.announcementRepo.count();
    if (count === 0) {
      const announcements = [
        {
          title: 'Welcome to Cotton Republic Portal',
          content: 'We are thrilled to launch our new Smart Enterprise AI Platform for Cotton Republic (Dah Je Co LTD). This portal centralizes HR services, leave management, real-time ERP/MES access, and features our AI Copilot for operational and logistics insights.',
          author: 'System Administrator',
          category: 'General',
          date: '2026-07-01'
        },
        {
          title: 'New Combed Cotton Production Target',
          content: 'The MES factory floor is scaling up manufacturing of our functional disposable travel underwear lines. Please make sure that inventory orders for Grade A cotton raw materials are processed via the Procurement tab.',
          author: 'Sarah Jenkins (Finance Director)',
          category: 'Finance',
          date: '2026-07-08'
        },
        {
          title: 'Updated Hybrid Work Guidelines',
          content: 'Under the new company policy, employees at our Taipei head office are eligible for up to 3 days of remote work per week. Please coordinate your schedules with team leads and log them in HR services.',
          author: 'David Vance (HR Head)',
          category: 'HR',
          date: '2026-07-05'
        }
      ];
      await this.announcementRepo.save(this.announcementRepo.create(announcements));
      this.logger.log('Announcements seeded.');
    }
  }


  private async seedErpItems() {
    const count = await this.erpItemRepo.count();
    if (count === 0) {
      const items: Partial<ErpItem>[] = [];
      const categories = ['Raw Materials', 'Work In Progress', 'Finished Goods'];
      const units = ['rolls', 'kg', 'meters', 'spools'];
      
      const textileProducts = [
        'Indigo Denim Fabric Roll (Heavyweight 14oz)',
        'Combed Cotton Jersey (Single Knit 180GSM)',
        'Organic Linen Slub Fabric (Solid White)',
        'Polyester Fleece Knit (Brushed Double Face)',
        'Printed Cotton Canvas (Floral Pattern 12oz)',
        'Rayon Challis Fabric (Solid Midnight Blue)',
        'Nylon Ripstop Fabric (Waterproof Grade)',
        'Mercerized Cotton Twill (Chino Grade)',
        'Silk Crepe de Chine (Grade A Mulberry)',
        'Wool Flannel Fabric (Striped Pattern)'
      ];
      
      for (let i = 1; i <= 30; i++) {
        const isLow = i === 12;
        const productName = textileProducts[(i - 1) % textileProducts.length];
        
        items.push({
          code: `INV-${String(i).padStart(3, '0')}`,
          name: productName + ` - BATCH #${1000 + i}`,
          nameTranslations: {
            "en": productName + ` - BATCH #${1000 + i}`,
            "zh-TW": `測試翻譯名稱 - BATCH #${1000 + i}`, // Simulated translation
            "zh-CN": `测试翻译名称 - BATCH #${1000 + i}`
          },
          category: categories[i % categories.length],
          quantity: isLow ? 8 : (15 + (i * 7) % 500),
          unit: i === 1 ? 'kg' : i === 12 ? 'kg' : units[i % units.length],
          price: parseFloat((8.5 + (i * 14.2) % 150).toFixed(2)),
          status: 'Active',
          isLowStock: isLow,
        });
      }
      await this.erpItemRepo.save(this.erpItemRepo.create(items));
      this.logger.log('ERP Items seeded from Textile Dataset (30 fabric items).');
    }
  }


  private async seedErpOrders() {
    const count = await this.erpOrderRepo.count();
    if (count === 0) {
      const orders: Partial<ErpOrder>[] = [];
      
      const suppliers = [
        'Hualon Textile Corp',
        'Far Eastern New Century',
        'Tai Yuen Textile Co',
        'Ruentex Industries Ltd',
        'Zig Sheng Industrial'
      ];

      const clients = [
        'Cotton Republic Taipei HQ',
        'Dah Je Co Apparel Depot',
        'Taiwan Fashion Logistics',
        'Pacific Global Sourcing'
      ];

      // Seed 30 Purchase Orders (PO) for Raw Textile Materials
      for (let i = 1; i <= 30; i++) {
        const qty = 100 + i * 5;
        const price = 4.25;
        orders.push({
          orderNumber: `PO-${String(i).padStart(3, '0')}`,
          type: 'PO',
          customerOrVendor: suppliers[i % suppliers.length],
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          totalAmount: parseFloat((qty * price).toFixed(2)),
          status: i <= 3 ? 'Pending' : 'Approved',
          itemDetails: `[{"item": "Raw Cotton Fiber (Textile Grade A)", "qty": ${qty}, "price": ${price}}]`
        });
      }

      // Seed 41 Sales Orders (SO) for Finished Fabric Rolls
      const fabrics = [
        'Indigo Denim Fabric',
        'Combed Cotton Jersey',
        'Organic Linen Slub',
        'Polyester Fleece Knit'
      ];

      for (let i = 1; i <= 41; i++) {
        const qty = 50 + i * 2;
        const price = 12.80;
        orders.push({
          orderNumber: `SO-${String(i).padStart(3, '0')}`,
          type: 'SO',
          customerOrVendor: clients[i % clients.length],
          date: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toLocaleDateString(),
          totalAmount: parseFloat((qty * price).toFixed(2)),
          status: i <= 2 ? 'Pending' : 'Approved',
          itemDetails: `[{"item": "${fabrics[i % fabrics.length]}", "qty": ${qty}, "price": ${price}}]`
        });
      }

      await this.erpOrderRepo.save(this.erpOrderRepo.create(orders));
      this.logger.log('ERP Orders seeded from Textile Dataset (30 POs, 41 SOs).');
    }
  }

  private async seedLeavesAndWorkflows() {
    const count = await this.leaveRepo.count();
    if (count === 0) {
      const leaves = [
        {
          employeeName: 'Sarah Jenkins',
          type: 'Annual',
          startDate: '2026-07-20',
          endDate: '2026-07-25',
          status: 'Approved',
          reason: 'Family summer vacation trip.',
          comments: 'Approved by HR Director Vance.'
        },
        {
          employeeName: 'Bob Carter',
          type: 'Sick',
          startDate: '2026-07-09',
          endDate: '2026-07-10',
          status: 'Pending',
          reason: 'Sudden high fever and flu.',
          comments: ''
        }
      ];
      const savedLeaves = await this.leaveRepo.save(this.leaveRepo.create(leaves));

      // Create workflow items for these leaves
      const workflows = [
        {
          type: 'Leave Request',
          title: 'Leave request for Sarah Jenkins (Annual)',
          requestedBy: 'Sarah Jenkins',
          requestedDate: '2026-07-05',
          status: 'Approved',
          description: 'Family summer vacation trip.',
          referenceId: savedLeaves[0].id
        },
        {
          type: 'Leave Request',
          title: 'Leave request for Bob Carter (Sick)',
          requestedBy: 'Bob Carter',
          requestedDate: '2026-07-09',
          status: 'Pending',
          description: 'Sudden high fever and flu.',
          referenceId: savedLeaves[1].id
        },
        {
          type: 'Purchase Order Approval',
          title: 'Approve PO-001 - Global Supply Partner A',
          requestedBy: 'John Smith',
          requestedDate: '2026-07-09',
          status: 'Pending',
          description: 'Purchase Order for cotton fiber raw material stock. Amount: $18,450.',
          referenceId: 1 // reference to PO-001
        }
      ];
      await this.workflowRepo.save(this.workflowRepo.create(workflows));
      this.logger.log('Leaves & workflows seeded.');
    }
  }

  private async seedKnowledgeBase() {
    const count = await this.knowledgeRepo.count();
    if (count === 0) {
      const articles = [
        {
          title: 'Cotton Republic Head Office Info',
          content: 'Welcome to Dah Je Co LTD (大傑有限公司) head office directory.\nAddress: 2F, No. 189, Xinhu 3rd Rd., Neihu District, Taipei City.\nPhone: 02-2790-8211.\nOfficial Marketing Email: ec-marketing@wugroup.co.\nOffice Hours: Monday to Friday 10:00-12:00, 13:00-17:00.',
          category: 'IT FAQ',
          author: 'System Administrator',
          views: 312
        },
        {
          title: 'Travel Disposable Underwear Tech Specs',
          content: 'Our brand Cotton Republic leads in functional disposable travel apparel. All products utilize combed cotton raw fibers providing high absorbency and hypoallergenic parameters. Disposal instructions are printed on each individual compostable box wrapper.',
          category: 'Policies',
          author: 'Sarah Jenkins (Finance Director)',
          views: 189
        },
        {
          title: 'How to Submit and Manage Leaves',
          content: 'Leave requests should be logged at least 5 business days in advance for annual leaves. In case of emergency or sick leave, please request your leave on the day of absence and notify your line manager immediately. The status can be tracked under Leave Management.',
          category: 'Guides',
          author: 'David Vance (HR Head)',
          views: 242
        }
      ];
      await this.knowledgeRepo.save(this.knowledgeRepo.create(articles));
      this.logger.log('Knowledge base articles seeded.');
    }
  }


  private async seedDocuments() {
    const count = await this.documentRepo.count();
    if (count === 0) {
      const docs = [
        {
          name: 'Annual_Q2_Performance_Review.pdf',
          path: '/documents/Q2_Review.pdf',
          uploadedBy: 'John Doe',
          uploadDate: '2026-06-30',
          ocrSummary: 'A report reviewing the performance indicators of Dah Je Co LTD during Q2 2026. Highlighting a 12% revenue growth and supply chain efficiency improvement.',
          keyEntities: 'Dah Je Co LTD, Q2 2026, Revenue, Supply Chain',
          actionItems: 'Prepare slide deck for board meeting, review production capacity.'
        },
        {
          name: 'Industrial_Safety_Protocol.pdf',
          path: '/documents/Safety_Protocol.pdf',
          uploadedBy: 'System Administrator',
          uploadDate: '2026-07-02',
          ocrSummary: 'Standard operating procedures for factory floor workers. Focuses on machine lockout procedures, protective helmet wearing, and emergency fire escape routes.',
          keyEntities: 'Lockout Tagout, Factory Floor, PPE, Escape Route',
          actionItems: 'Organize safety drill, inspect fire extinguishers.'
        }
      ];
      await this.documentRepo.save(this.documentRepo.create(docs));
      this.logger.log('Documents seeded.');
    }
  }

  async getEmployees(): Promise<Employee[]> {
    return this.employeeRepo.find({ order: { employeeName: 'ASC' } });
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepo.create(data);
    return this.employeeRepo.save(employee);
  }

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    await this.employeeRepo.update(id, data);
    const updated = await this.employeeRepo.findOneBy({ id });
    if (!updated) throw new Error('Employee not found');
    return updated;
  }

  private async seedEmployees() {
    const count = await this.employeeRepo.count();
    if (count === 0) {
      const employees = [
        {
          employeeName: 'Adler, Nathaniel',
          empId: '10057',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 59365,
          dateOfHire: '7/5/2011',
          managerName: 'Brandon R. LeBlanc',
          engagementSurvey: 3.2,
          empSatisfaction: 5,
          absences: 4,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Bernstein, Albert',
          empId: '10196',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 68532,
          dateOfHire: '1/9/2012',
          managerName: 'Amy Dunn',
          engagementSurvey: 4.1,
          empSatisfaction: 3,
          absences: 1,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'King, Janet',
          empId: '10014',
          position: 'President & CEO',
          department: 'Executive Office',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 250000,
          dateOfHire: '7/2/2012',
          managerName: 'Board of Directors',
          engagementSurvey: 4.5,
          empSatisfaction: 5,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Fitzpatrick, Sean',
          empId: '10216',
          position: 'Software Engineer',
          department: 'Software Engineering',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 91300,
          dateOfHire: '8/13/2012',
          managerName: 'Alex Sweetwater',
          engagementSurvey: 3.9,
          empSatisfaction: 4,
          absences: 3,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Boutwell, Bonalyn',
          empId: '10081',
          position: 'Sr. DBA',
          department: 'IT/IS',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 106367,
          dateOfHire: '2/16/2015',
          managerName: 'Simon Roup',
          engagementSurvey: 5.0,
          empSatisfaction: 4,
          absences: 0,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Cloninger, Jennifer',
          empId: '10271',
          position: 'HR Assistant',
          department: 'Admin Offices',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 62068,
          dateOfHire: '4/16/2012',
          managerName: 'Brandon R. LeBlanc',
          engagementSurvey: 4.2,
          empSatisfaction: 5,
          absences: 0,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Dong, Sheng',
          empId: '10084',
          position: 'Software Engineer',
          department: 'Software Engineering',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 96508,
          dateOfHire: '1/7/2013',
          managerName: 'Alex Sweetwater',
          engagementSurvey: 3.0,
          empSatisfaction: 3,
          absences: 12,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Foster, John',
          empId: '10144',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 65427,
          dateOfHire: '1/7/2013',
          managerName: 'Brannon Miller',
          engagementSurvey: 4.8,
          empSatisfaction: 5,
          absences: 1,
          performanceScore: 'Exceeds'
        },
        {
          employeeName: 'Givens, Sarah',
          empId: '10065',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 67014,
          dateOfHire: '2/16/2015',
          managerName: 'David Stanley',
          engagementSurvey: 3.0,
          empSatisfaction: 4,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Gupta, Ruishi',
          empId: '10103',
          position: 'Software Engineer',
          department: 'Software Engineering',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 95340,
          dateOfHire: '3/5/2012',
          managerName: 'Alex Sweetwater',
          engagementSurvey: 4.0,
          empSatisfaction: 3,
          absences: 5,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Handson, Valarie',
          empId: '10174',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 51100,
          dateOfHire: '11/5/2012',
          managerName: 'David Stanley',
          engagementSurvey: 3.6,
          empSatisfaction: 5,
          absences: 3,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Jacobi, Hannah',
          empId: '10091',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Divorced',
          employmentStatus: 'Active',
          salary: 63291,
          dateOfHire: '1/9/2012',
          managerName: 'Kissy Sullivan',
          engagementSurvey: 4.3,
          empSatisfaction: 4,
          absences: 1,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Keefe, Gloria',
          empId: '10126',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 73500,
          dateOfHire: '2/16/2015',
          managerName: 'Elijiah Gray',
          engagementSurvey: 3.2,
          empSatisfaction: 5,
          absences: 8,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Lundy, Susan',
          empId: '10255',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 46837,
          dateOfHire: '1/9/2012',
          managerName: 'Michael Albert',
          engagementSurvey: 3.6,
          empSatisfaction: 4,
          absences: 6,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Miller, Ned',
          empId: '10166',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 69320,
          dateOfHire: '8/13/2012',
          managerName: 'Brannon Miller',
          engagementSurvey: 3.0,
          empSatisfaction: 5,
          absences: 1,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Navara, Kathleen',
          empId: '10243',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 59370,
          dateOfHire: '1/7/2013',
          managerName: 'David Stanley',
          engagementSurvey: 4.0,
          empSatisfaction: 3,
          absences: 4,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Ozarek, Donald',
          empId: '10188',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 68820,
          dateOfHire: '1/9/2012',
          managerName: 'John Smith',
          engagementSurvey: 5.0,
          empSatisfaction: 4,
          absences: 0,
          performanceScore: 'Exceeds'
        },
        {
          employeeName: 'Petrowsky, Theresa',
          empId: '10134',
          position: 'Database Administrator',
          department: 'IT/IS',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 102527,
          dateOfHire: '11/5/2012',
          managerName: 'Simon Roup',
          engagementSurvey: 4.6,
          empSatisfaction: 5,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Quinn, Sean',
          empId: '10231',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 53000,
          dateOfHire: '2/16/2015',
          managerName: 'Janet King',
          engagementSurvey: 4.2,
          empSatisfaction: 4,
          absences: 5,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Rarrick, Quinn',
          empId: '10156',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Divorced',
          employmentStatus: 'Active',
          salary: 61729,
          dateOfHire: '1/9/2012',
          managerName: 'Michael Albert',
          engagementSurvey: 3.8,
          empSatisfaction: 5,
          absences: 3,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Saad, Jordan',
          empId: '10204',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 52200,
          dateOfHire: '1/7/2013',
          managerName: 'Amy Dunn',
          engagementSurvey: 3.5,
          empSatisfaction: 4,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Tate, Sandra',
          empId: '10222',
          position: 'Production Technician II',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 71000,
          dateOfHire: '1/7/2013',
          managerName: 'Elijiah Gray',
          engagementSurvey: 4.5,
          empSatisfaction: 5,
          absences: 4,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'True, Edward',
          empId: '10115',
          position: 'IT Support',
          department: 'IT/IS',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 82300,
          dateOfHire: '2/16/2015',
          managerName: 'Simon Roup',
          engagementSurvey: 4.2,
          empSatisfaction: 3,
          absences: 1,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Wallace, Theresa',
          empId: '10141',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 51308,
          dateOfHire: '1/9/2012',
          managerName: 'Kissy Sullivan',
          engagementSurvey: 3.9,
          empSatisfaction: 5,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Zima, Colleen',
          empId: '10266',
          position: 'Production Technician I',
          department: 'Production',
          sex: 'F',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 46830,
          dateOfHire: '1/9/2012',
          managerName: 'Michael Albert',
          engagementSurvey: 4.5,
          empSatisfaction: 5,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Warfield, Sarah',
          empId: '10127',
          position: 'SR. HR Specialist',
          department: 'Admin Offices',
          sex: 'F',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 107226,
          dateOfHire: '2/16/2015',
          managerName: 'Brandon R. LeBlanc',
          engagementSurvey: 4.6,
          empSatisfaction: 4,
          absences: 2,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Sweetwater, Alex',
          empId: '10045',
          position: 'Software Engineering Manager',
          department: 'Software Engineering',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 112000,
          dateOfHire: '7/2/2012',
          managerName: 'Janet King',
          engagementSurvey: 4.7,
          empSatisfaction: 5,
          absences: 1,
          performanceScore: 'Exceeds'
        },
        {
          employeeName: 'Roup, Simon',
          empId: '10022',
          position: 'IT Manager - Infrastructure',
          department: 'IT/IS',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 140000,
          dateOfHire: '1/9/2012',
          managerName: 'Janet King',
          engagementSurvey: 4.6,
          empSatisfaction: 5,
          absences: 0,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'Miller, Brannon',
          empId: '10034',
          position: 'Production Manager',
          department: 'Production',
          sex: 'M',
          maritalDesc: 'Married',
          employmentStatus: 'Active',
          salary: 105000,
          dateOfHire: '8/13/2012',
          managerName: 'Janet King',
          engagementSurvey: 4.8,
          empSatisfaction: 4,
          absences: 1,
          performanceScore: 'Fully Meets'
        },
        {
          employeeName: 'LeBlanc, Brandon R',
          empId: '10112',
          position: 'Shared Services Manager',
          department: 'Admin Offices',
          sex: 'M',
          maritalDesc: 'Single',
          employmentStatus: 'Active',
          salary: 115000,
          dateOfHire: '1/9/2012',
          managerName: 'Janet King',
          engagementSurvey: 4.9,
          empSatisfaction: 5,
          absences: 2,
          performanceScore: 'Fully Meets'
        }
      ];
      await this.employeeRepo.save(this.employeeRepo.create(employees));
      this.logger.log('Employees seeded from Kaggle HR dataset.');
    }
  }
}
