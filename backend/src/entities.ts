import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  date: string;

  @Column()
  author: string;

  @Column()
  category: string; // e.g. "General", "HR", "IT", "Finance"
}

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeName: string;

  @Column()
  type: string; // e.g. "Annual", "Sick", "Maternity", "Unpaid"

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ default: 'Pending' })
  status: string; // e.g. "Pending", "Approved", "Rejected"

  @Column('text', { nullable: true })
  reason: string;

  @Column({ nullable: true })
  proof: string;

  @Column('text', { nullable: true })
  comments: string;
}

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g. "Leave Request", "Purchase Order Approval", "Sales Order Approval"

  @Column()
  title: string;

  @Column()
  requestedBy: string;

  @Column()
  requestedDate: string;

  @Column({ default: 'Pending' })
  status: string; // e.g. "Pending", "Approved", "Rejected"

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  referenceId: number; // Links to Leave ID or Order ID
}

@Entity()
export class ErpItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string; // e.g. "INV-001"

  @Column()
  name: string;

  @Column('simple-json', { nullable: true })
  nameTranslations: any; // e.g. { "en": "Name", "zh-TW": "名稱", "zh-CN": "名称" }

  @Column()
  category: string; // e.g. "Raw Materials", "Finished Goods", "Work In Progress"

  @Column('int')
  quantity: number;

  @Column()
  unit: string; // e.g. "kg", "pcs", "liters"

  @Column('float')
  price: number;

  @Column({ default: 'Active' })
  status: string; // e.g. "Active", "Discontinued"

  @Column('boolean', { default: false })
  isLowStock: boolean;
}

@Entity()
export class ErpOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNumber: string; // e.g. "PO-001" or "SO-001"

  @Column()
  type: string; // "PO" (Purchase Order) or "SO" (Sales Order)

  @Column()
  customerOrVendor: string;

  @Column()
  date: string;

  @Column('float')
  totalAmount: number;

  @Column({ default: 'Pending' })
  status: string; // e.g. "Pending", "Approved", "Rejected", "Completed"

  @Column('text')
  itemDetails: string; // JSON string or text summary of items
}

@Entity()
export class KnowledgeArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  category: string; // e.g. "Policies", "Guides", "IT FAQ"

  @Column()
  author: string;

  @Column('int', { default: 0 })
  views: number;
}

@Entity()
export class CompanyDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  path: string;

  @Column()
  uploadedBy: string;

  @Column()
  uploadDate: string;

  @Column('text', { nullable: true })
  ocrSummary: string;

  @Column('text', { nullable: true })
  keyEntities: string; // Comma-separated or JSON list of extracted entities

  @Column('text', { nullable: true })
  actionItems: string; // Comma-separated or JSON list of action items
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeName: string;

  @Column()
  empId: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  sex: string;

  @Column()
  maritalDesc: string;

  @Column()
  employmentStatus: string;

  @Column('float')
  salary: number;

  @Column()
  dateOfHire: string;

  @Column()
  managerName: string;

  @Column('float')
  engagementSurvey: number;

  @Column('int')
  empSatisfaction: number;

  @Column('int')
  absences: number;

  @Column()
  performanceScore: string;
}

