import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
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

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // --- EMPLOYEES (HR DATASET) ---
  @Get('employees')
  async getEmployees(): Promise<Employee[]> {
    return this.appService.getEmployees();
  }

  @Post('employees')
  async createEmployee(@Body() data: any): Promise<Employee> {
    return this.appService.createEmployee(data);
  }

  @Patch('employees/:id')
  async updateEmployee(@Param('id') id: string, @Body() data: any): Promise<Employee> {
    return this.appService.updateEmployee(Number(id), data);
  }

  // --- ANNOUNCEMENTS ---
  @Get('announcements')
  async getAnnouncements(): Promise<Announcement[]> {
    return this.appService.getAnnouncements();
  }

  @Post('announcements')
  async createAnnouncement(@Body() data: Partial<Announcement>): Promise<Announcement> {
    return this.appService.createAnnouncement(data);
  }

  // --- LEAVES ---
  @Get('leaves')
  async getLeaves(): Promise<Leave[]> {
    return this.appService.getLeaves();
  }

  @Post('leaves')
  async createLeave(@Body() data: Partial<Leave>): Promise<Leave> {
    return this.appService.createLeave(data);
  }

  // --- WORKFLOWS / APPROVALS ---
  @Get('workflows')
  async getWorkflows(): Promise<Workflow[]> {
    return this.appService.getWorkflows();
  }

  @Patch('workflows/:id')
  async updateWorkflow(
    @Param('id') id: string,
    @Body() body: { status: 'Approved' | 'Rejected'; comments?: string }
  ): Promise<Workflow> {
    return this.appService.updateWorkflowStatus(Number(id), body.status, body.comments);
  }

  // --- ERP / INVENTORY / ORDERS ---
  @Get('erp/inventory')
  async getInventory(): Promise<ErpItem[]> {
    return this.appService.getInventory();
  }

  @Get('erp/orders')
  async getOrders(@Query('type') type?: 'PO' | 'SO'): Promise<ErpOrder[]> {
    return this.appService.getOrders(type);
  }

  @Post('erp/purchase-orders')
  async createPurchaseOrder(
    @Body() body: { vendor: string; items: string; totalAmount: number }
  ): Promise<ErpOrder> {
    return this.appService.createPurchaseOrder(body);
  }

  @Post('erp/sync')
  async syncERP() {
    return this.appService.syncERPNext();
  }


  // --- KNOWLEDGE BASE ---
  @Get('knowledge-base')
  async getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
    return this.appService.getKnowledgeArticles();
  }

  @Post('knowledge-base')
  async createKnowledgeArticle(@Body() data: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    return this.appService.createKnowledgeArticle(data);
  }

  // --- DOCUMENTS ---
  @Get('documents')
  async getDocuments(): Promise<CompanyDocument[]> {
    return this.appService.getDocuments();
  }

  @Post('documents')
  async uploadDocument(@Body() data: Partial<CompanyDocument>): Promise<CompanyDocument> {
    return this.appService.uploadDocument(data);
  }
}
