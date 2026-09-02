import QRManagementView from './components/QRManagementView';
import { useMsal } from '@azure/msal-react';
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Calendar,
  FolderOpen,
  Bot,
  CheckSquare,
  Database,
  BarChart3,
  User,
  Package,
  FileText,
  TrendingUp,
  Workflow as WorkflowIcon,
  Cpu,
  BookOpen,
  RefreshCw,
  Search,
  Sun,
  Moon,
  Bell,
  Send,
  Upload,
  AlertTriangle,
  Check,
  X,
  Plus,
  ArrowRight,
  Info,
  Globe,
  Menu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Minus,
  GripVertical,
  QrCode,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TRANSLATIONS: { [key: string]: { [key: string]: string } } = {
  en: {
    dashboard: "Employee Dashboard",
    announcements: "Announcements",
    hrServices: "HR Services",
    leave: "Leave Management",
    documents: "Document Center",
    aiCopilot: "AI Copilot",
    approvals: "Workflow Approvals",
    erpAccess: "ERP Access",
    reports: "Reports & Analytics",
    profile: "User Profile",
    inventory: "Inventory",
    purchaseOrders: "Purchase Orders",
    salesOrders: "Sales Orders",
    workflows: "Workflows",
    documentAi: "Document AI",
    knowledgeBase: "Knowledge Base",
    erpIntegration: "ERP Integration",
    realData: "Real Data",
    internalPortal: "Internal Portal",
    language: "Language",
    english: "English",
    traditionalChinese: "Traditional Chinese (繁體中文)",
    simplifiedChinese: "Simplified Chinese (简体中文)",
    internalAnnouncements: "Internal Announcements",
    createAnnouncement: "Create Announcement",
    title: "Title",
    category: "Category",
    content: "Content",
    authorName: "Author Name",
    postAnnouncement: "Post Announcement",
    placeholderTitle: "E.g., System Maintenance",
    placeholderContent: "Announcement details...",
    filterAll: "All",
    filterGeneral: "General",
    filterHr: "HR",
    filterFinance: "Finance",
    filterIt: "IT",
    postedBy: "Posted by"
  },
  'zh-TW': {
    dashboard: "員工儀表板",
    announcements: "公司公告",
    hrServices: "人事服務",
    leave: "請假管理",
    documents: "文檔中心",
    aiCopilot: "AI 智能助手",
    approvals: "工作流審批",
    erpAccess: "ERP 系統接入口",
    reports: "報表與分析",
    profile: "個人中心",
    inventory: "庫存管理",
    purchaseOrders: "採購訂單",
    salesOrders: "銷售訂單",
    workflows: "工作流程配置",
    documentAi: "文檔 AI 分析",
    knowledgeBase: "知識庫",
    erpIntegration: "ERP 數據集成",
    realData: "實時數據檢查",
    internalPortal: "企業內部平台",
    language: "語言切換",
    english: "English",
    traditionalChinese: "繁體中文",
    simplifiedChinese: "简体中文",
    internalAnnouncements: "內部公告",
    createAnnouncement: "發佈新公告",
    title: "公告標題",
    category: "分類目錄",
    content: "詳細內容",
    authorName: "作者姓名",
    postAnnouncement: "送出發佈",
    placeholderTitle: "例如：伺服器維護通知",
    placeholderContent: "請在此輸入公告詳細內容...",
    filterAll: "全部公告",
    filterGeneral: "常規",
    filterHr: "人事部",
    filterFinance: "財務部",
    filterIt: "資訊部",
    postedBy: "發佈者："
  },
  'zh-CN': {
    dashboard: "员工仪表板",
    announcements: "公司公告",
    hrServices: "人事服务",
    leave: "请假管理",
    documents: "文档中心",
    aiCopilot: "AI 智能助手",
    approvals: "工作流审批",
    erpAccess: "ERP 系统接入口",
    reports: "报表与分析",
    profile: "个人中心",
    inventory: "库存管理",
    purchaseOrders: "采购订单",
    salesOrders: "销售订单",
    workflows: "工作流程配置",
    documentAi: "文档 AI 分析",
    knowledgeBase: "知识库",
    erpIntegration: "ERP 数据集成",
    realData: "实时数据检查",
    internalPortal: "企业内部平台",
    language: "语言切换",
    english: "English",
    traditionalChinese: "繁體中文",
    simplifiedChinese: "简体中文",
    internalAnnouncements: "内部公告",
    createAnnouncement: "发布新公告",
    title: "公告标题",
    category: "分类目录",
    content: "详细内容",
    authorName: "作者姓名",
    postAnnouncement: "确认发布",
    placeholderTitle: "例如：服务器维护通知",
    placeholderContent: "请在此输入公告详细内容...",
    filterAll: "全部公告",
    filterGeneral: "常规",
    filterHr: "人事部",
    filterFinance: "财务部",
    filterIt: "资讯部",
    postedBy: "发布者："
  }
};

const DICTIONARY: { [key: string]: { [key: string]: string } } = {
  // General & Layout
  "Smart Enterprise AI Platform": { "zh-TW": "智能企業 AI 平台", "zh-CN": "智能企业 AI 平台" },
  "Internal Portal": { "zh-TW": "內部企業門戶", "zh-CN": "内部企业门户" },
  "Search...": { "zh-TW": "搜尋...", "zh-CN": "搜索..." },
  "Search employee or position...": { "zh-TW": "搜尋員工姓名或職位...", "zh-CN": "搜索员工姓名或职位..." },
  "Welcome to Cotton Republic Portal": { "zh-TW": "歡迎來到棉花共和國門戶", "zh-CN": "欢迎来到棉花共和国门户" },
  "Dah Je Co LTD (大傑有限公司) • Smart Enterprise AI Platform": { "zh-TW": "大傑有限公司 • 智能企業 AI 平台", "zh-CN": "大杰有限公司 • 智能企业 AI 平台" },

  // Dashboard Indicators
  "Total POs": { "zh-TW": "採購單總數", "zh-CN": "采购单总数" },
  "Total SOs": { "zh-TW": "銷售單總數", "zh-CN": "销售单总数" },
  "Inventory Items": { "zh-TW": "庫存品項總計", "zh-CN": "库存品项总计" },
  "Low Stock Alerts": { "zh-TW": "低庫存警警報", "zh-CN": "低库存警警报" },
  "Low Stock Items": { "zh-TW": "低庫存品項", "zh-CN": "低库存品项" },
  
  // HR Services
  "HR Services & Contacts": { "zh-TW": "人事服務與聯絡窗口", "zh-CN": "人事服务与联络窗口" },
  "Employee Directory (Kaggle HR Dataset)": { "zh-TW": "員工名冊 (Kaggle HR 數據集)", "zh-CN": "员工名册 (Kaggle HR 数据集)" },
  "All Departments": { "zh-TW": "所有部門", "zh-CN": "所有部门" },
  "HR Director": { "zh-TW": "人事總監", "zh-CN": "人事总监" },
  "Recruitment Manager": { "zh-TW": "招聘經理", "zh-CN": "招聘经理" },
  "Employee Relations": { "zh-TW": "員工關係專員", "zh-CN": "员工关系专员" },
  "Dept:": { "zh-TW": "部門:", "zh-CN": "部门:" },
  "Salary:": { "zh-TW": "薪資:", "zh-CN": "薪资:" },
  "Manager:": { "zh-TW": "直屬主管:", "zh-CN": "直属主管:" },
  "Hired:": { "zh-TW": "入職日期:", "zh-CN": "入职日期:" },
  "Absences:": { "zh-TW": "缺勤天數:", "zh-CN": "缺勤天数:" },
  "Satisfaction:": { "zh-TW": "滿意度評分:", "zh-CN": "满意度评分:" },
  "Fully Meets": { "zh-TW": "符合預期指標", "zh-CN": "符合预期指标" },
  "Exceeds": { "zh-TW": "超出預期表現", "zh-CN": "超出预期表现" },

  // Leave Management
  "Submit Leave Request": { "zh-TW": "提交請假申請表格", "zh-CN": "提交请假申请表格" },
  "Leave Type": { "zh-TW": "請假假別類型", "zh-CN": "请假假别类型" },
  "Annual Leave": { "zh-TW": "特休/年假", "zh-CN": "特休/年假" },
  "Sick Leave": { "zh-TW": "病假", "zh-CN": "病假" },
  "Personal Leave": { "zh-TW": "事假", "zh-CN": "事假" },
  "Start Date": { "zh-TW": "開始請假日期", "zh-CN": "开始请假日期" },
  "End Date": { "zh-TW": "結束請假日期", "zh-CN": "结束请假日期" },
  "Reason": { "zh-TW": "詳細請假原因", "zh-CN": "详细请假原因" },
  "Brief details...": { "zh-TW": "請在此輸入請假事由簡述...", "zh-CN": "请在此输入请假事由简述..." },
  "Submit Request": { "zh-TW": "確定送出申請", "zh-CN": "确定送出申请" },
  "Your Leave Requests History": { "zh-TW": "您的請假申請歷史記錄", "zh-CN": "您的请假申请历史记录" },
  "Employee": { "zh-TW": "申請員工姓名", "zh-CN": "申请员工姓名" },
  "Type": { "zh-TW": "假別類型", "zh-CN": "假别类型" },
  "Status": { "zh-TW": "審批狀態", "zh-CN": "审批状态" },
  "Comments": { "zh-TW": "審查主管評語", "zh-CN": "审查主管评语" },
  "Pending": { "zh-TW": "審核中", "zh-CN": "审核中" },
  "Approved": { "zh-TW": "審批已核准", "zh-CN": "审批已核准" },

  // Document Center
  "Uploaded Documents": { "zh-TW": "已上傳存檔文件", "zh-CN": "已上传存档文件" },
  "Upload Document": { "zh-TW": "上傳存檔新文件", "zh-CN": "上传存档新文件" },
  "Document Name": { "zh-TW": "上傳文件名稱", "zh-CN": "上传文件名称" },
  "File Text Content": { "zh-TW": "文件文本詳細內容", "zh-CN": "文件文本详细内容" },
  "Paste document text or invoice values here...": { "zh-TW": "請在此貼上文件內容或發票數值...", "zh-CN": "请在此贴上文件内容或发票数值..." },
  "Save Document": { "zh-TW": "儲存並保存文件", "zh-CN": "储存并保存文件" },

  // Workflow Approvals
  "Workflow & Request Approvals": { "zh-TW": "工作流與請求審計審批", "zh-CN": "工作流与请求审计审批" },
  "Pending Actions": { "zh-TW": "待處理審核項目", "zh-CN": "待处理审核项目" },
  "Approval Audit Logs": { "zh-TW": "審核歷史審計日誌", "zh-CN": "审核历史审计日志" },
  "Task Detail": { "zh-TW": "審批任務詳情", "zh-CN": "审批任务详情" },
  "Requested By": { "zh-TW": "申請人姓名", "zh-CN": "申请人姓名" },
  "Date": { "zh-TW": "申請日期時間", "zh-CN": "申请日期时间" },
  "Outcome": { "zh-TW": "審查結果", "zh-CN": "审查结果" },
  "Approve": { "zh-TW": "審查同意核准", "zh-CN": "审查同意核准" },
  "Reject": { "zh-TW": "拒絕駁回退回", "zh-CN": "拒绝驳回退回" },
  "Enter approval note / REJECTION reason (Mandatory)": { "zh-TW": "請輸入審批意見或拒絕原因(必填)", "zh-CN": "请输入审批意见或拒绝原因(必填)" },

  // ERP Access
  "ERP / MES Integration Center": { "zh-TW": "ERP / MES 系統集成控制中心", "zh-CN": "ERP / MES 系统集成控制中心" },
  "Material & Inventory (MES)": { "zh-TW": "物料與庫存管理系統 (MES)", "zh-CN": "物料与库存管理系统 (MES)" },
  "Procurement (Purchase Orders)": { "zh-TW": "採購供應鏈模組 (採購單)", "zh-CN": "采购供应链模组 (采购单)" },
  "Finance & Sales (SO)": { "zh-TW": "財務與銷售模組 (銷售單)", "zh-CN": "财务与销售模组 (销售单)" },
  "Active ERP Gateway Status": { "zh-TW": "活躍 ERP 網關通訊狀態", "zh-CN": "活跃 ERP 网关通讯状态" },
  "SAP ERP Financials Gateway": { "zh-TW": "SAP ERP 財務總賬網關", "zh-CN": "SAP ERP 财务总账网关" },
  "Production MES Floor Scheduler": { "zh-TW": "MES 生產車間排程調度器", "zh-CN": "MES 生产车间排程调度器" },
  "Workday HR Employee Database Sync": { "zh-TW": "Workday 人力資源數據庫同步", "zh-CN": "Workday 人力资源数据库同步" },
  "Legacy Warehouse WMS API": { "zh-TW": "傳統倉庫管理 (WMS) 連接埠", "zh-CN": "传统仓库管理 (WMS) 连接口" },
  "Connected": { "zh-TW": "通訊已連接", "zh-CN": "通讯已连接" },
  "Maintenance": { "zh-TW": "維護保養中", "zh-CN": "维护保养中" },

  // Workflows View
  "Defined Enterprise Workflows": { "zh-TW": "已定義之企業工作流", "zh-CN": "已定义之企业工作流" },
  "Leave Approval Protocol": { "zh-TW": "請假審批流程協議", "zh-CN": "请假审批流程协议" },
  "Procurement Capex Approval": { "zh-TW": "採購資本支出審批", "zh-CN": "采购资本支出审批" },
  "New Vendor Onboarding Policy": { "zh-TW": "新供應商入駐政策流程", "zh-CN": "新供应商入驻政策流程" },
  "2-step validation": { "zh-TW": "兩階段驗證", "zh-CN": "两阶段验证" },
  "3-step budget check": { "zh-TW": "三階段預算審查", "zh-CN": "三阶段预算审查" },
  "1-step contract check": { "zh-TW": "單階段合約核對", "zh-CN": "单阶段合约核对" },

  // Document AI View
  "OCR Document Parsing (FastAPI Document AI)": { "zh-TW": "OCR 文件智能解析 (FastAPI Document AI)", "zh-CN": "OCR 文件智能解析 (FastAPI Document AI)" },
  "Paste invoice texts, shipping slip data, or employee memos to trigger automated entity extraction and summaries via AI.": {
    "zh-TW": "請在下方貼上發票文本、出貨單數據或員工備忘錄，以觸發 AI 自動化實體提取與摘要。",
    "zh-CN": "请在下方贴上发票文本、出货单数据或员工备忘录，以触发 AI 自动化实体提取与摘要。"
  },
  "Extract Entities & Summary": { "zh-TW": "開始提取實體與摘要", "zh-CN": "开始提取实体与摘要" },
  "AI Extraction Results": { "zh-TW": "AI 數據提取分析結果", "zh-CN": "AI 数据提取分析结果" },
  "Submit raw text in the left panel to review extracted details.": { "zh-TW": "請在左側面板提交原始文本以查看提取的詳細資訊。", "zh-CN": "请在左侧面板提交原始文本以查看提取的详细信息。" },

  // Knowledge Base View
  "Articles": { "zh-TW": "企業知識庫文章", "zh-CN": "企业知识库文章" },
  "Cotton Republic Head Office Info": { "zh-TW": "棉花共和國總部資訊指南", "zh-CN": "棉花共和国总部资讯指南" },
  "Travel Disposable Underwear Tech Specs": { "zh-TW": "旅行一次性內衣技術規格說明", "zh-CN": "旅行一次性内衣技术规格说明" },
  "How to Submit and Manage Leaves": { "zh-TW": "如何提交與管理您的請假申請", "zh-CN": "如何提交与管理您的请假申请" },
  "Add Article": { "zh-TW": "新增知識庫文章", "zh-CN": "新增知识库文章" },
  "Select an article from the left sidebar to start reading.": { "zh-TW": "請從左側欄選擇一篇文章開始閱讀。", "zh-CN": "请从left側欄选择一篇文章开始阅读。" },
  "Add": { "zh-TW": "確定新增", "zh-CN": "确定新增" },

  // Database Sync Control
  "ERP Database Sync Control": { "zh-TW": "ERP 資料庫同步控制台", "zh-CN": "ERP 数据库同步控制台" },
  "Database Synchronization Logs": { "zh-TW": "系統資料庫同步日誌", "zh-CN": "系统数据库同步日志" },
  "Sync Database Now": { "zh-TW": "立即執行資料庫同步", "zh-CN": "立即执行数据库同步" },
  "MES Production": { "zh-TW": "MES 生產製造系統", "zh-CN": "MES 生产制造系统" },
  "SAP Financials": { "zh-TW": "SAP 財務會計系統", "zh-CN": "SAP 财务会计系统" },
  "Workday HR DB": { "zh-TW": "Workday 人事資料庫", "zh-CN": "Workday 人事数据库" },
  "Legacy Warehouse WMS": { "zh-TW": "舊款倉庫 WMS 系統", "zh-CN": "旧款仓库 WMS 系统" },
  "30 records": { "zh-TW": "30 筆同步記錄", "zh-CN": "30 笔同步记录" },
  "31 records": { "zh-TW": "31 筆同步記錄", "zh-CN": "31 笔同步记录" },
  "3 records": { "zh-TW": "3 筆同步記錄", "zh-CN": "3 笔同步记录" },
  "Failed": { "zh-TW": "同步失敗", "zh-CN": "同步失败" },
  "Success": { "zh-TW": "同步成功", "zh-CN": "同步成功" },
  "Timestamp": { "zh-TW": "同步時間戳", "zh-CN": "同步时间戳" },
  "Details": { "zh-TW": "日誌詳情", "zh-CN": "日志详情" },

  // Real Data View
  "Database Inspector: INVENTORY": { "zh-TW": "資料庫檢查器：實時庫存", "zh-CN": "数据库检查器：实时库存" },
  "Database Tables": { "zh-TW": "系統資料數據表", "zh-CN": "系统资料数据表" },
  "PRODUCT NAME": { "zh-TW": "產品品名", "zh-CN": "产品品名" },
  "CATEGORY": { "zh-TW": "品類分類", "zh-CN": "品类分类" },
  "STOCK LEVEL": { "zh-TW": "庫存水位", "zh-CN": "库存水位" },
  "PRICE": { "zh-TW": "單價價格", "zh-CN": "单价价格" },
  "Total Records:": { "zh-TW": "總記錄數:", "zh-CN": "总记录数:" }
};

const LOCALIZED_ANNOUNCEMENTS: { [key: string]: any[] } = {
  en: [
    { id: 1, title: 'Updated Hybrid Work Guidelines', content: 'Under the new company policy, employees at our Taipei head office are eligible for up to 3 days of remote work per week. Please coordinate your schedules with team leads and log them in HR services.', author: 'David Vance (HR Head)', category: 'HR', date: '2026-07-05' },
    { id: 2, title: 'New Combed Cotton Production Target', content: 'The MES factory floor is scaling up manufacturing of our functional disposable travel underwear lines. Please make sure that inventory orders for Grade A cotton raw materials are processed via the Procurement tab.', author: 'Sarah Jenkins (Finance Director)', category: 'Finance', date: '2026-07-08' },
    { id: 3, title: 'Welcome to Cotton Republic Portal', content: 'We are thrilled to launch our new Smart Enterprise AI Platform for Cotton Republic (Dah Je Co LTD). This portal centralizes HR services, leave management, real-time ERP/MES access, and features our AI Copilot for operational and logistics insights.', author: 'System Administrator', category: 'General', date: '2026-07-01' }
  ],
  'zh-TW': [
    { id: 1, title: '混合辦公指南更新', content: '根據公司最新政策，台北總部的員工每週可申請最多3天的遠程辦公。請與團隊主管協調您的時間安排，並在人事服務中記錄。', author: 'David Vance (HR 主管)', category: 'HR', date: '2026-07-05' },
    { id: 2, title: '精梳棉生產新目標', content: 'MES 工廠正在擴大功能性一次性旅行內衣產品線的生產規模。請確保通過採購選項卡處理 A 級棉花原材料的庫存訂單。', author: 'Sarah Jenkins (財務總監)', category: 'Finance', date: '2026-07-08' },
    { id: 3, title: '歡迎來到棉花共和國門戶網站', content: '我們很高興為棉花共和國（大杰有限公司）推出全新的智能企業 AI 平台。該門戶網站集成了人事服務、請假管理、實時 ERP/MES 訪問，並提供 AI 協同助手以獲取運營和物流洞察。', author: '系統管理員', category: 'General', date: '2026-07-01' }
  ],
  'zh-CN': [
    { id: 1, title: '混合办公指南更新', content: '根据公司最新政策，台北总部的员工每周可申请最多3天的远程办公。请与团队主管协调您的时间安排，并在人事服务中记录。', author: 'David Vance (HR 主管)', category: 'HR', date: '2026-07-05' },
    { id: 2, title: '精梳棉生产新目标', content: 'MES 工厂正在扩大功能性一次性旅行内衣产品线的生产规模。请确保通过采购选项卡处理 A 级棉花原材料的库存订单。', author: 'Sarah Jenkins (财务总监)', category: 'Finance', date: '2026-07-08' },
    { id: 3, title: '欢迎来到棉花共和国门户网站', content: '我们很高兴为棉花共和国（大杰有限公司）推出全新的智能企业 AI 平台。该门户网站集成了人事服务、请假管理、实时 ERP/MES 访问，并提供 AI 协同助手以获取运营和物流内参。', author: '系统管理员', category: 'General', date: '2026-07-01' }
  ]
};

// API Configuration URLs
const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://cotton-backend-h674.onrender.com/api'
    : `https://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8445/api`);

const AI_URL = (import.meta as any).env.VITE_AI_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://cotton-ai-service.onrender.com/api'
    : `https://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8440/api`);

// Static fallbacks for offline mode
const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'Welcome to Dah Je Co LTD Portal', content: 'We are thrilled to launch our new Smart Enterprise AI Platform. This portal centralizes HR services, leave management, real-time ERP access, and features our AI Copilot for operational insights.', author: 'System Administrator', category: 'General', date: '2026-07-01' },
  { id: 2, title: 'Q3 Financial Review Next Wednesday', content: 'All department managers are requested to submit their expense reports by Friday 5 PM. The Q3 review will be broadcasted live on Zoom starting Wednesday at 10:00 AM.', author: 'Sarah Jenkins (Finance Director)', category: 'Finance', date: '2026-07-08' },
  { id: 3, title: 'Updated Hybrid Work Guidelines', content: 'Under the new company policy, employees are eligible for up to 3 days of remote work per week. Please coordinate your schedules with team leads and log them in HR services.', author: 'David Vance (HR Head)', category: 'HR', date: '2026-07-05' }
];

const MOCK_LEAVES = [
  { id: 1, employeeName: 'Sarah Jenkins', type: 'Annual', startDate: '2026-07-20', endDate: '2026-07-25', status: 'Approved', reason: 'Family summer vacation trip.', comments: 'Approved by HR Director Vance.' },
  { id: 2, employeeName: 'Bob Carter', type: 'Sick', startDate: '2026-07-09', endDate: '2026-07-10', status: 'Pending', reason: 'Sudden high fever and flu.', comments: '' }
];

const MOCK_EMPLOYEES = [
  {
    "id": "DJ0008",
    "employeeName": "Carol Xu",
    "name": "Carol Xu",
    "empId": "DJ0008",
    "position": "Deputy Manager",
    "role": "Deputy Manager",
    "department": "Logistics course",
    "email": "carol@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0017",
    "employeeName": "Wang Kui",
    "name": "Wang Kui",
    "empId": "DJ0017",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Logistics course",
    "email": "a0922429480@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0018",
    "employeeName": "Steven Chen",
    "name": "Steven Chen",
    "empId": "DJ0018",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Logistics course",
    "email": "steven21835@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0020",
    "employeeName": "Judy Huang",
    "name": "Judy Huang",
    "empId": "DJ0020",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics Support Section",
    "email": "judy@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0022",
    "employeeName": "Wu Yiru Iva",
    "name": "Wu Yiru Iva",
    "empId": "DJ0022",
    "position": "Executive Vice President",
    "role": "Executive Vice President",
    "department": "Operations Management Office",
    "email": "iva@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0023",
    "employeeName": "Zhang Xuanhao (Howard)",
    "name": "Zhang Xuanhao (Howard)",
    "empId": "DJ0023",
    "position": "Section Chief",
    "role": "Section Chief",
    "department": "Fourth subject",
    "email": "howard@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0024",
    "employeeName": "Lin Xiuying Candy",
    "name": "Lin Xiuying Candy",
    "empId": "DJ0024",
    "position": "assistant",
    "role": "assistant",
    "department": "Administration and Human Resources Department",
    "email": "candy@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0025",
    "employeeName": "Chen Yingru Hannah",
    "name": "Chen Yingru Hannah",
    "empId": "DJ0025",
    "position": "Senior Specialist",
    "role": "Senior Specialist",
    "department": "Commodity Control Department",
    "email": "hannah@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0026",
    "employeeName": "Michelle Qiu",
    "name": "Michelle Qiu",
    "empId": "DJ0026",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Finance Department",
    "email": "michelle@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0028",
    "employeeName": "Wang Zhihao",
    "name": "Wang Zhihao",
    "empId": "DJ0028",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Logistics course",
    "email": "s94273308@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0029",
    "employeeName": "Huang Shujuan Eva",
    "name": "Huang Shujuan Eva",
    "empId": "DJ0029",
    "position": "Deputy Manager",
    "role": "Deputy Manager",
    "department": "Finance Department",
    "email": "eva@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0030",
    "employeeName": "Catherine Wu",
    "name": "Catherine Wu",
    "empId": "DJ0030",
    "position": "CEO",
    "role": "CEO",
    "department": "Chairman's Office",
    "email": "catherine@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0031",
    "employeeName": "Wu Fangyi (Selina)",
    "name": "Wu Fangyi (Selina)",
    "empId": "DJ0031",
    "position": "manager",
    "role": "manager",
    "department": "Business Department",
    "email": "selina@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0044",
    "employeeName": "Huang Meiyue",
    "name": "Huang Meiyue",
    "empId": "DJ0044",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "moonhuang0621@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0047",
    "employeeName": "Xiao Meili Li",
    "name": "Xiao Meili Li",
    "empId": "DJ0047",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "a0935778288@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0048",
    "employeeName": "Wang Rougui",
    "name": "Wang Rougui",
    "empId": "DJ0048",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "wang5702140214@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0050",
    "employeeName": "Chen Gaosuzhu Su",
    "name": "Chen Gaosuzhu Su",
    "empId": "DJ0050",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "soju12100@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0059",
    "employeeName": "Carrie Jiang",
    "name": "Carrie Jiang",
    "empId": "DJ0059",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Procurement Class",
    "email": "carrie@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0062",
    "employeeName": "Zhang Xiaomin Grace Wu",
    "name": "Zhang Xiaomin Grace Wu",
    "empId": "DJ0062",
    "position": "President",
    "role": "President",
    "department": "Chairman's Office",
    "email": "",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0081",
    "employeeName": "Jimmy Shih",
    "name": "Jimmy Shih",
    "empId": "DJ0081",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Class 1",
    "email": "jimmy@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0100",
    "employeeName": "Li Sihua (Lykke)",
    "name": "Li Sihua (Lykke)",
    "empId": "DJ0100",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics Support Section",
    "email": "lykke_lee@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0107",
    "employeeName": "Liu Lijun Mandy",
    "name": "Liu Lijun Mandy",
    "empId": "DJ0107",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Class 1",
    "email": "MandyL@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0108",
    "employeeName": "Yang Rongfen",
    "name": "Yang Rongfen",
    "empId": "DJ0108",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "rongfenyang3@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0120",
    "employeeName": "Zhang Jiafang",
    "name": "Zhang Jiafang",
    "empId": "DJ0120",
    "position": "work-study students",
    "role": "work-study students",
    "department": "Logistics course",
    "email": "amyhappy1020@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0127",
    "employeeName": "Du Fangjie Jay",
    "name": "Du Fangjie Jay",
    "empId": "DJ0127",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Class 1",
    "email": "jayd@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0128",
    "employeeName": "Lin Youcai",
    "name": "Lin Youcai",
    "empId": "DJ0128",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Logistics course",
    "email": "s7104112003@yahoo.com.tw",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0140",
    "employeeName": "Huang Yuting (Tina)",
    "name": "Huang Yuting (Tina)",
    "empId": "DJ0140",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Finance Department",
    "email": "tinah@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0146",
    "employeeName": "Jimmy Zhan",
    "name": "Jimmy Zhan",
    "empId": "DJ0146",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Design Course",
    "email": "jimmyj@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0160",
    "employeeName": "Ollie He",
    "name": "Ollie He",
    "empId": "DJ0160",
    "position": "assistant",
    "role": "assistant",
    "department": "Finance Department",
    "email": "ollieh@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0161",
    "employeeName": "Wang Wenxu (Jimmy)",
    "name": "Wang Wenxu (Jimmy)",
    "empId": "DJ0161",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Information Department",
    "email": "Jimmyw@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0162",
    "employeeName": "Hong Yiting",
    "name": "Hong Yiting",
    "empId": "DJ0162",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "love1234562123@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0163",
    "employeeName": "Tong Chenglei",
    "name": "Tong Chenglei",
    "empId": "DJ0163",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "leit@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0170",
    "employeeName": "Stephan Qiu",
    "name": "Stephan Qiu",
    "empId": "DJ0170",
    "position": "manager",
    "role": "manager",
    "department": "Information Department",
    "email": "stephan@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0179",
    "employeeName": "Zhang Xiaoping Angle",
    "name": "Zhang Xiaoping Angle",
    "empId": "DJ0179",
    "position": "Deputy Manager",
    "role": "Deputy Manager",
    "department": "Logistics course",
    "email": "hsiaoping2206@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0183",
    "employeeName": "Claire Chen",
    "name": "Claire Chen",
    "empId": "DJ0183",
    "position": "Senior Specialist",
    "role": "Senior Specialist",
    "department": "Procurement Class",
    "email": "clairec@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0189",
    "employeeName": "Xu Ziwei Ivy",
    "name": "Xu Ziwei Ivy",
    "empId": "DJ0189",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "ivys@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0192",
    "employeeName": "Deng Xiaolin Linda",
    "name": "Deng Xiaolin Linda",
    "empId": "DJ0192",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Procurement Class",
    "email": "lindat@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0195",
    "employeeName": "Li Peiyi (Maggie)",
    "name": "Li Peiyi (Maggie)",
    "empId": "DJ0195",
    "position": "Senior Specialist",
    "role": "Senior Specialist",
    "department": "Third subject",
    "email": "maggiel@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0196",
    "employeeName": "Jerry Liang Yaozhang",
    "name": "Jerry Liang Yaozhang",
    "empId": "DJ0196",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "CEO's Office",
    "email": "jerryle@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0197",
    "employeeName": "Chen Peixuan Shaly",
    "name": "Chen Peixuan Shaly",
    "empId": "DJ0197",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Procurement Class",
    "email": "shalyc@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0200",
    "employeeName": "Lin Yuanda",
    "name": "Lin Yuanda",
    "empId": "DJ0200",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "f076592@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0203",
    "employeeName": "Jessie Wu",
    "name": "Jessie Wu",
    "empId": "DJ0203",
    "position": "assistant",
    "role": "assistant",
    "department": "Procurement Class",
    "email": "jessiew@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0204",
    "employeeName": "Janice Tseng",
    "name": "Janice Tseng",
    "empId": "DJ0204",
    "position": "Senior Specialist",
    "role": "Senior Specialist",
    "department": "Planning Class",
    "email": "janicet@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0206",
    "employeeName": "Wu Xiangchen Minami",
    "name": "Wu Xiangchen Minami",
    "empId": "DJ0206",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Design Course",
    "email": "minamiw@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0207",
    "employeeName": "Wayne Yu",
    "name": "Wayne Yu",
    "empId": "DJ0207",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Design Course",
    "email": "wayney@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0208",
    "employeeName": "Chen Ziqian",
    "name": "Chen Ziqian",
    "empId": "DJ0208",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "lisa952626@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0209",
    "employeeName": "Kalle Chakradhar",
    "name": "Kalle Chakradhar",
    "empId": "DJ0209",
    "position": "Commissioner",
    "role": "Commissioner",
    "department": "Information Department",
    "email": "kallec@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0210",
    "employeeName": "Gao Zhiling",
    "name": "Gao Zhiling",
    "empId": "DJ0210",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics course",
    "email": "pig2000.10.1@gmail.com",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0212",
    "employeeName": "Qiu Hongjun (Vincent)",
    "name": "Qiu Hongjun (Vincent)",
    "empId": "DJ0212",
    "position": "manager",
    "role": "manager",
    "department": "Finance Department",
    "email": "vincentc@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0213",
    "employeeName": "Tina Tsoi",
    "name": "Tina Tsoi",
    "empId": "DJ0213",
    "position": "assistant",
    "role": "assistant",
    "department": "Logistics Support Section",
    "email": "tinat@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  },
  {
    "id": "DJ0214",
    "employeeName": "Rene Lin",
    "name": "Rene Lin",
    "empId": "DJ0214",
    "position": "Senior Specialist",
    "role": "Senior Specialist",
    "department": "Planning Class",
    "email": "renel@wugroup.co",
    "sex": "Not specified",
    "maritalDesc": "Single",
    "employmentStatus": "Active",
    "salary": 60000.0,
    "dateOfHire": "2026-01-01",
    "managerName": "System Admin",
    "engagementSurvey": 4.5,
    "empSatisfaction": 4,
    "absences": 0,
    "performanceScore": "Exceeds Expectations"
  }
];

const MOCK_WORKFLOWS = [
  { id: 1, type: 'Leave Request', title: 'Leave request for Sarah Jenkins (Annual)', requestedBy: 'Sarah Jenkins', requestedDate: '2026-07-05', status: 'Approved', description: 'Family summer vacation trip.', referenceId: 1 },
  { id: 2, type: 'Leave Request', title: 'Leave request for Bob Carter (Sick)', requestedBy: 'Bob Carter', requestedDate: '2026-07-09', status: 'Pending', description: 'Sudden high fever and flu.', referenceId: 2 },
  { id: 3, type: 'Purchase Order Approval', title: 'Approve PO-001 - Global Supply Partner A', requestedBy: 'John Smith', requestedDate: '2026-07-09', status: 'Pending', description: 'Purchase Order for cotton fiber raw material stock. Amount: $18,450.', referenceId: 1 }
];

const MOCK_INVENTORY = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  code: `INV-${String(i + 1).padStart(3, '0')}`,
  name: i === 11 ? 'Premium Cotton Thread (Blue)' : `Industrial Component Spec ${i + 1}`,
  category: i % 3 === 0 ? 'Raw Materials' : i % 3 === 1 ? 'Work In Progress' : 'Finished Goods',
  quantity: i === 11 ? 8 : (15 + (i * 7) % 350),
  unit: i === 11 ? 'kg' : i % 2 === 0 ? 'pcs' : 'liters',
  price: parseFloat((10.5 + (i * 12.3) % 250).toFixed(2)),
  status: 'Active',
  isLowStock: i === 11
}));

const MOCK_POS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  orderNumber: `PO-${String(i + 1).padStart(3, '0')}`,
  type: 'PO',
  customerOrVendor: `Global Supply Partner ${String.fromCharCode(65 + (i % 5))}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
  totalAmount: parseFloat((1500 + (i * 340) % 20000).toFixed(2)),
  status: i <= 2 ? 'Pending' : 'Approved',
  itemDetails: `[{"item": "Component ${i + 1}", "qty": ${10 + i}, "price": 45}]`
}));

const MOCK_SOS = Array.from({ length: 41 }, (_, i) => ({
  id: i + 1,
  orderNumber: `SO-${String(i + 1).padStart(3, '0')}`,
  type: 'SO',
  customerOrVendor: `Enterprise Client ${String.fromCharCode(86 + (i % 4))}`,
  date: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toLocaleDateString(),
  totalAmount: parseFloat((4500 + (i * 620) % 45000).toFixed(2)),
  status: i <= 1 ? 'Pending' : 'Approved',
  itemDetails: `[{"item": "Finished Product ${i + 1}", "qty": ${5 + i}, "price": 120}]`
}));

const MOCK_KNOWLEDGE = [
  { id: 1, title: 'IT Helpdesk FAQ & Setup Guide', content: 'Welcome to Dah Je Co IT support. To configure your corporate email, download the Microsoft Authenticator app on your mobile device. Scan the QR code displayed in your profile settings. For VPN connections, select server "vpn-asia.dahje.com" and use your Active Directory credentials.', category: 'IT FAQ', author: 'Marcus Cole (IT Support)', views: 124 },
  { id: 2, title: 'Employee Travel Expense Reimbursement Policy', content: 'Employees travelling on business are eligible for a daily meals stipend of $60 inside Asia, and $85 for international destinations. All taxi and flight receipts must be scanned and uploaded via the Document Center under category "Expenses" within 14 days of travel completion.', category: 'Policies', author: 'Sarah Jenkins (Finance Director)', views: 89 },
  { id: 3, title: 'How to Submit and Manage Leaves', content: 'Leave requests should be logged at least 5 business days in advance for annual leaves. In case of emergency or sick leave, please request your leave on the day of absence and notify your line manager immediately. The status can be tracked under Leave Management.', category: 'Guides', author: 'David Vance (HR Head)', views: 242 }
];

const MOCK_DOCUMENTS = [
  { id: 1, name: 'Annual_Q2_Performance_Review.pdf', path: '/documents/Q2_Review.pdf', uploadedBy: 'Kalle Chakradhar', uploadDate: '2026-06-30', ocrSummary: 'A report reviewing the performance indicators of Dah Je Co LTD during Q2 2026. Highlighting a 12% revenue growth and supply chain efficiency improvement.', keyEntities: 'Dah Je Co LTD, Q2 2026, Revenue, Supply Chain', actionItems: 'Prepare slide deck for board meeting, review production capacity.' },
  { id: 2, name: 'Industrial_Safety_Protocol.pdf', path: '/documents/Safety_Protocol.pdf', uploadedBy: 'System Administrator', uploadDate: '2026-07-02', ocrSummary: 'Standard operating procedures for factory floor workers. Focuses on machine lockout procedures, protective helmet wearing, and emergency fire escape routes.', keyEntities: 'Lockout Tagout, Factory Floor, PPE, Escape Route', actionItems: 'Organize safety drill, inspect fire extinguishers.' }
];

const LangContext = React.createContext({ lang: 'en' });

function translateText(text: string, lang: string): string {
  if (lang === 'en' || !text) return text;
  const trimmed = text.trim();
  if (DICTIONARY[trimmed] && DICTIONARY[trimmed][lang]) {
    const leading = text.match(/^\s*/)?.[0] || '';
    const trailing = text.match(/\s*$/)?.[0] || '';
    return leading + DICTIONARY[trimmed][lang] + trailing;
  }
  
  let result = text;
  let changed = false;
  Object.keys(DICTIONARY).forEach(key => {
    if (key.length > 3 && result.includes(key) && DICTIONARY[key][lang]) {
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedKey, 'g');
      result = result.replace(regex, DICTIONARY[key][lang]);
      changed = true;
    }
  });
  return result;
}

function translateElement(node: any, lang: string): any {
  if (lang === 'en' || !node) return node;
  
  if (typeof node === 'string') {
    return translateText(node, lang);
  }
  
  if (typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }
  
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const translated = translateElement(child, lang);
      if (React.isValidElement(translated) && !translated.key && React.isValidElement(child)) {
        return React.cloneElement(translated, { key: child.key || index });
      }
      return translated;
    });
  }
  
  if (React.isValidElement(node)) {
    const props = node.props as any;
    if (props) {
      const newProps = { ...props };
      if (props.children) {
        newProps.children = translateElement(props.children, lang);
      }
      if (typeof props.placeholder === 'string') {
        newProps.placeholder = translateText(props.placeholder, lang);
      }
      return React.cloneElement(node, newProps);
    }
  }
  
  return node;
}

export default function App() {
  const { instance, accounts } = useMsal();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDashboardSubView, setActiveDashboardSubView] = useState('home');

  const handleMicrosoftLogin = async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await instance.loginRedirect({ scopes: ["User.Read"] });
      } catch (err: any) {
        console.error(err);
        setLoginError(err.message || 'Microsoft Login failed');
      }
    };

  const handleSetActiveTab = (tab: string) => {
    if (tab === 'dashboard') {
      setActiveTab('dashboard');
      setActiveDashboardSubView('home');
    } else {
      setActiveTab('dashboard');
      setActiveDashboardSubView(tab);
    }
  };
  const [lang, setLang] = useState(localStorage.getItem('portal_lang') || 'en');
  const [theme, setTheme] = useState('dark');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portal_leave_types');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.includes('Overtime')) parsed.push('Overtime');
          if (!parsed.includes('Remote Work')) parsed.push('Remote Work');
          return parsed;
        } catch (e) {
          // fallback
        }
      }
      return ['Annual', 'Sick', 'Maternity/Paternity', 'Unpaid', 'Overtime', 'Remote Work'];
    }
    return ['Annual', 'Sick', 'Maternity/Paternity', 'Unpaid', 'Overtime', 'Remote Work'];
  });

  const updateLeaveTypes = (newTypes: string[]) => {
    setLeaveTypes(newTypes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal_leave_types', JSON.stringify(newTypes));
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('admin@cotton.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin@cotton.com' && loginPassword === 'password123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError(lang === 'en' ? 'Invalid username or password' : '無效的使用者名稱或密碼');
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(() => setIsLoggedIn(false));
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024; // Use 1024px to ensure smooth tablet (iPad) support too

  const handleLangChange = (newLang: string) => {
    localStorage.setItem('portal_lang', newLang);
    setLang(newLang);
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = newLang;
      selectEl.dispatchEvent(new Event('change'));
    }
  };
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isAiOnline, setIsAiOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Loaded database state
  const [announcements, setAnnouncements] = useState<any[]>(MOCK_ANNOUNCEMENTS);
  const [leaves, setLeaves] = useState<any[]>(MOCK_LEAVES);
  const [workflows, setWorkflows] = useState<any[]>(MOCK_WORKFLOWS);
  const [inventory, setInventory] = useState<any[]>(MOCK_INVENTORY);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>(MOCK_POS);
  const [salesOrders, setSalesOrders] = useState<any[]>(MOCK_SOS);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>(MOCK_KNOWLEDGE);
  const [documents, setDocuments] = useState<any[]>(MOCK_DOCUMENTS);
  const [employees, setEmployees] = useState<any[]>(MOCK_EMPLOYEES);

  // User details
  const [userProfile, setUserProfile] = useState(() => {
    const defaultProfile = {
      name: 'Kalle Chakradhar',
      role: 'Commissioner',
      department: 'Information Department',
      email: 'kallec@wugroup.co',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      notificationsEnabled: true,
      theme: 'dark',
      employeeNumber: 'DJ0209'
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portal_user_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name && !parsed.name.includes('John Doe')) {
            return parsed;
          }
        } catch (e) {
          // fallback
        }
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const email = (accounts[0].username || '').toLowerCase();
      const matched = MOCK_EMPLOYEES.find((emp: any) => 
        (emp.email && emp.email.toLowerCase() === email) ||
        (emp.employeeName && accounts[0].name && emp.employeeName.toLowerCase().includes(accounts[0].name.toLowerCase()))
      );

      const profileName = matched ? (matched.employeeName || matched.name) : (accounts[0].name || accounts[0].username || 'Kalle Chakradhar');
      const profileRole = matched ? (matched.position || matched.role || 'Commissioner') : 'Commissioner';
      const profileDept = matched ? matched.department : 'Information Department';
      const empNum = matched ? (matched.empId || matched.id || 'DJ0209') : 'DJ0209';

      const profile = {
        name: profileName,
        role: profileRole,
        department: profileDept,
        email: accounts[0].username,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        notificationsEnabled: true,
        theme: 'dark',
        employeeNumber: empNum
      };

      setUserProfile(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('portal_user_profile', JSON.stringify(profile));
      }
      setIsLoggedIn(true);
    }
  }, [accounts]);

  const saveUserProfile = (newProfile: any) => {
    setUserProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal_user_profile', JSON.stringify(newProfile));
    }
  };

  // Recent activity feed
  const [activities, setActivities] = useState([
    { id: 1, text: 'Purchase Order #PO-001 created', user: 'John Smith', time: '2 hours ago' },
    { id: 2, text: 'Sales Order #SO-002 approved', user: 'Jane Doe', time: '4 hours ago' },
    { id: 3, text: 'Inventory updated: 500 units', user: 'System', time: '1 day ago' }
  ]);

  // Test backend and AI connection
  const checkAPIs = async () => {
    try {
      const res = await fetch(BACKEND_URL + '/announcements');
      if (res.ok) {
        setIsBackendOnline(true);
        fetchBackendData();
      } else {
        setIsBackendOnline(false);
      }
    } catch {
      setIsBackendOnline(false);
    }

    try {
      const res = await fetch(AI_URL + '/');
      if (res.ok) {
        setIsAiOnline(true);
      } else {
        setIsAiOnline(false);
      }
    } catch {
      setIsAiOnline(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      const annRes = await fetch(BACKEND_URL + '/announcements');
      if (annRes.ok) setAnnouncements(await annRes.json());

      const leaveRes = await fetch(BACKEND_URL + '/leaves');
      if (leaveRes.ok) setLeaves(await leaveRes.json());

      const wfRes = await fetch(BACKEND_URL + '/workflows');
      if (wfRes.ok) setWorkflows(await wfRes.json());

      const invRes = await fetch(BACKEND_URL + '/erp/inventory');
      if (invRes.ok) setInventory(await invRes.json());

      const poRes = await fetch(BACKEND_URL + '/erp/orders?type=PO');
      if (poRes.ok) setPurchaseOrders(await poRes.json());

      const soRes = await fetch(BACKEND_URL + '/erp/orders?type=SO');
      if (soRes.ok) setSalesOrders(await soRes.json());

      const kbRes = await fetch(BACKEND_URL + '/knowledge-base');
      if (kbRes.ok) setKnowledgeBase(await kbRes.json());

      const docRes = await fetch(BACKEND_URL + '/documents');
      if (docRes.ok) setDocuments(await docRes.json());

      const empRes = await fetch(BACKEND_URL + '/employees');
      if (empRes.ok) setEmployees(await empRes.json());
    } catch (e) {
      console.warn('Failed to load from backend, running in local-mock mode.', e);
    }
  };

  useEffect(() => {
    checkAPIs();
    // Poll API status every 10 seconds
    const interval = setInterval(checkAPIs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isBackendOnline) {
      setAnnouncements(LOCALIZED_ANNOUNCEMENTS[lang]);
    }
  }, [lang, isBackendOnline]);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = lang;
        selectEl.dispatchEvent(new Event('change'));
        clearInterval(interval);
      }
      attempts++;
      if (attempts > 15) {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    if (lang === 'en') return;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue?.trim();
        if (text) {
          if (DICTIONARY[text] && DICTIONARY[text][lang]) {
            node.nodeValue = DICTIONARY[text][lang];
          } else {
            let newText = text;
            let changed = false;
            Object.keys(DICTIONARY).forEach(key => {
              if (key.length > 3 && newText.includes(key) && DICTIONARY[key][lang]) {
                const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(escapedKey, 'g');
                newText = newText.replace(regex, DICTIONARY[key][lang]);
                changed = true;
              }
            });
            if (changed) {
              node.nodeValue = newText;
            }
          }
        }
      } else {
        const el = node as Element;
        const tagName = el.tagName;
        if (tagName && tagName !== 'SCRIPT' && tagName !== 'STYLE' && tagName !== 'SELECT' && tagName !== 'TEXTAREA') {
          // Translate placeholder attribute
          if (el.getAttribute && el.getAttribute('placeholder')) {
            const ph = el.getAttribute('placeholder') || '';
            const trimmedPh = ph.trim();
            if (DICTIONARY[trimmedPh] && DICTIONARY[trimmedPh][lang]) {
              el.setAttribute('placeholder', DICTIONARY[trimmedPh][lang]);
            }
          }
          // Translate button values
          if (tagName === 'INPUT' && (el.getAttribute('type') === 'button' || el.getAttribute('type') === 'submit')) {
            const val = el.getAttribute('value') || '';
            const trimmedVal = val.trim();
            if (DICTIONARY[trimmedVal] && DICTIONARY[trimmedVal][lang]) {
              el.setAttribute('value', DICTIONARY[trimmedVal][lang]);
            }
          }
          node.childNodes.forEach(translateNode);
        }
      }
    };

    const root = document.getElementById('root');
    if (root) {
      translateNode(root);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            translateNode(node);
          });
        } else if (mutation.type === 'characterData') {
          observer.disconnect();
          translateNode(mutation.target);
          observer.observe(root!, { 
            childList: true, 
            subtree: true, 
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'value']
          });
        } else if (mutation.type === 'attributes') {
          observer.disconnect();
          translateNode(mutation.target);
          observer.observe(root!, { 
            childList: true, 
            subtree: true, 
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'value']
          });
        }
      });
    });

    if (root) {
      observer.observe(root, { 
        childList: true, 
        subtree: true, 
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'value']
      });
    }

    return () => observer.disconnect();
  }, [lang]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Sidebar Menu Items based on the mockup image
  const menuItems = [
    { id: 'dashboard', label: TRANSLATIONS[lang].dashboard, icon: LayoutDashboard }
  ];

  if (!isLoggedIn) {
    return (
      <LangContext.Provider value={{ lang }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("/dashboard_background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1rem',
          fontFamily: 'var(--font-sans)',
          color: '#fff',
          position: 'relative'
        }}>
          {/* Top-Right Language Switcher on Login Page */}
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} style={{ color: 'var(--primary)' }} />
            <select 
              value={lang} 
              onChange={(e) => handleLangChange(e.target.value)} 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.8rem',
                padding: '0.35rem 0.5rem',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)'
              }}
            >
              <option value="en" style={{ backgroundColor: '#111', color: '#fff' }}>English</option>
              <option value="zh-TW" style={{ backgroundColor: '#111', color: '#fff' }}>繁體中文 (Traditional)</option>
              <option value="zh-CN" style={{ backgroundColor: '#111', color: '#fff' }}>简体中文 (Simplified)</option>
            </select>
          </div>

          {/* Login Card */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'rgba(24, 25, 32, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dah Je Co LTD</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Employee Portal Login' : '員工企業門戶登入'}
              </span>
            </div>

            {/* Error Message */}
            {loginError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                textAlign: 'center'
              }}>
                {loginError}
              </div>
            )}

            {/* Form */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <button 
                type="button"
                onClick={handleMicrosoftLogin}
                style={{
                  backgroundColor: '#0078D4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.8rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
                  transition: 'opacity 0.2s',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21"><path fill="#f35325" d="M0 0h10v10H0z"/><path fill="#81bc06" d="M11 0h10v10H11z"/><path fill="#05a6f0" d="M0 11h10v10H0z"/><path fill="#ffba08" d="M11 11h10v10H11z"/></svg>
                {lang === 'en' ? 'Sign In with Microsoft' : '使用 Microsoft 登入'}
              </button>
            </form>

            {/* MSAL Status Display */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                MSAL Status: {accounts && accounts.length > 0 ? (
                  <strong style={{ color: '#10b981' }}>Connected ({accounts[0].username})</strong>
                ) : (
                  <strong style={{ color: '#f59e0b' }}>Not Connected</strong>
                )}
              </span>
            </div>
          </div>
            </div>
          </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={{ lang }}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
        {/* MOBILE BACKDROP */}
        {isMobile && isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
              zIndex: 105
            }}
          />
        )}

        {/* SIDEBAR */}
        <aside style={{
          width: isMobile ? 'var(--sidebar-width)' : (isSidebarCollapsed ? '0px' : 'var(--sidebar-width)'),
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: isSidebarCollapsed && !isMobile ? 'none' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: isMobile ? (isMobileMenuOpen ? 0 : 'calc(-1 * var(--sidebar-width))') : 0,
          zIndex: 110,
          transition: 'width 0.3s ease, left var(--transition-normal)',
          boxShadow: isMobile && isMobileMenuOpen ? '0 10px 40px rgba(0,0,0,0.7)' : 'none',
          overflowX: 'hidden'
        }}>
          {/* Company Title */}
          <div style={{
            padding: isSidebarCollapsed && !isMobile ? '1.5rem 0.5rem' : '1.5rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'space-between',
            gap: isSidebarCollapsed && !isMobile ? 0 : '0.75rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <img
                src="/logo.jpg"
                alt="Logo"
                style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>Dah Je Co LTD</h2>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>{TRANSLATIONS[lang].internalPortal}</span>
                </div>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
              >
                {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </div>


        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: isSidebarCollapsed && !isMobile ? '1rem 0.4rem' : '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'padding 0.3s ease' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSetActiveTab(item.id);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
                title={isSidebarCollapsed && !isMobile ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                  gap: isSidebarCollapsed && !isMobile ? 0 : '0.75rem',
                  padding: isSidebarCollapsed && !isMobile ? '0.7rem 0' : '0.7rem 0.85rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-glass)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Snapshot */}
        <div style={{
          padding: isSidebarCollapsed && !isMobile ? '1rem 0.5rem' : '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: isSidebarCollapsed && !isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'space-between',
          gap: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isSidebarCollapsed && !isMobile ? 'column' : 'row', 
            alignItems: 'center', 
            gap: '0.75rem', 
            overflow: 'hidden',
            width: isSidebarCollapsed && !isMobile ? 'auto' : '100%',
            justifyContent: 'center'
          }}>
            <img
              src={userProfile.avatarUrl}
              alt="profile"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', flexShrink: 0 }}
            />
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userProfile.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userProfile.role}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--danger)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
              transition: 'opacity 0.2s',
              marginTop: isSidebarCollapsed && !isMobile ? '0.25rem' : 0,
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      {isMobile && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 100
        }}>
          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={24} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="/logo.jpg"
              alt="Logo"
              style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.5px' }}>Dah Je Co</span>
          </div>

          {/* Right-side mobile action controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile Search Toggle */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  const newQuery = searchQuery ? '' : ' ';
                  setSearchQuery(newQuery);
                }}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
              >
                <Search size={18} />
              </button>
              {searchQuery && (
                <div style={{
                  position: 'fixed',
                  top: '60px',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-sidebar)',
                  borderBottom: '1px solid var(--border-color)',
                  padding: '0.5rem 1rem',
                  zIndex: 99,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery.trim()}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.45rem 1rem 0.45rem 2.25rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {searchQuery.trim() && (
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {menuItems
                        .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setSearchQuery('');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: 'var(--text-main)',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '0.85rem',
                              fontFamily: 'var(--font-sans)'
                            }}
                          >
                            <Search size={12} style={{ color: 'var(--primary)' }} />
                            <span>{item.label}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Notification Bell */}
            <div 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              style={{ position: 'relative', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              <Bell size={18} />
              {workflows.filter(w => w.status === 'Pending').length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  backgroundColor: 'red',
                  borderRadius: '50%'
                }} />
              )}
              {/* Mobile Bell Dropdown */}
              {isNotificationsOpen && (
                <div 
                  style={{
                    position: 'fixed',
                    top: '60px',
                    right: '10px',
                    width: '300px',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    padding: '1rem',
                    zIndex: 150,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    {lang === 'en' ? 'Notifications' : '系統通知'}
                  </h4>
                  {workflows.filter(w => w.status === 'Pending').map(w => (
                    <div 
                      key={w.id} 
                      onClick={() => {
                        setActiveTab('approvals');
                        setIsNotificationsOpen(false);
                      }}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{w.type}</div>
                      <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>{w.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <select 
              value={lang} 
              onChange={(e) => handleLangChange(e.target.value)} 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '0.2rem 0.3rem',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <option value="en" style={{ backgroundColor: '#111' }}>EN</option>
              <option value="zh-TW" style={{ backgroundColor: '#111' }}>繁體</option>
              <option value="zh-CN" style={{ backgroundColor: '#111' }}>简体</option>
            </select>

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.25rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>
      )}

      {/* MAIN CONTAINER */}
      <div style={{
        marginLeft: isMobile ? 0 : (isSidebarCollapsed ? '0px' : 'var(--sidebar-width)'),
        paddingTop: isMobile ? '60px' : 0,
        flex: 1,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: theme === 'dark'
          ? 'linear-gradient(rgba(18, 19, 24, 0.82), rgba(18, 19, 24, 0.82)), url("/dashboard_background.jpg")'
          : 'linear-gradient(rgba(244, 246, 250, 0.85), rgba(244, 246, 250, 0.85)), url("/dashboard_background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* HEADER */}
        {!isMobile && (
          <header style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            backgroundColor: theme === 'dark' ? 'rgba(24, 25, 32, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                title={isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  padding: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
              >
                <Menu size={16} />
              </button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Smart Enterprise AI Platform</h3>
              {/* Database / AI status pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '99px',
                  backgroundColor: isBackendOnline ? 'var(--success-glass)' : 'var(--danger-glass)',
                  color: isBackendOnline ? 'var(--success)' : 'var(--danger)',
                  fontWeight: 600
                }}>
                  {isBackendOnline ? 'Django Online' : 'Django Offline (Mock Mode)'}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '99px',
                  backgroundColor: isAiOnline ? 'var(--success-glass)' : 'var(--warning-glass)',
                  color: isAiOnline ? 'var(--success)' : 'var(--warning)',
                  fontWeight: 600
                }}>
                  {isAiOnline ? 'FastAPI Online' : 'AI Offline (Mock Mode)'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Language Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.25rem' }}>
                <Globe size={16} style={{ color: 'var(--primary)' }} />
                <select 
                  value={lang} 
                  onChange={(e) => handleLangChange(e.target.value)} 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.5rem',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600
                  }}
                >
                  <option value="en" style={{ backgroundColor: '#111', color: '#fff' }}>English</option>
                  <option value="zh-TW" style={{ backgroundColor: '#111', color: '#fff' }}>繁體中文 (Traditional)</option>
                  <option value="zh-CN" style={{ backgroundColor: '#111', color: '#fff' }}>简体中文 (Simplified)</option>
                </select>
              </div>

              {/* Search Input */}
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 1rem 0.45rem 2.25rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                {searchQuery && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    width: '280px',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    padding: '0.75rem',
                    zIndex: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                      {lang === 'en' ? 'Matching Pages' : '匹配的頁面'}
                    </span>
                    {menuItems
                      .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setSearchQuery('');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left',
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-sans)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Search size={12} style={{ color: 'var(--primary)' }} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    {menuItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.25rem 0' }}>
                        {lang === 'en' ? 'No results found' : '無匹配結果'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                padding: 6
              }}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ position: 'relative', cursor: 'pointer', padding: 6 }}
              >
                <Bell size={20} />
                {workflows.filter(w => w.status === 'Pending').length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    backgroundColor: 'var(--danger)',
                    borderRadius: '50%',
                    border: '2px solid var(--bg-app)'
                  }} />
                )}

                {/* Floating Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: 0,
                      width: '320px',
                      backgroundColor: 'var(--bg-sidebar)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                      padding: '1rem',
                      zIndex: 150,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      cursor: 'default'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{lang === 'en' ? 'System Notifications' : '系統通知日誌'}</span>
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--danger-glass)', color: 'var(--danger)', borderRadius: '99px' }}>
                        {workflows.filter(w => w.status === 'Pending').length} {lang === 'en' ? 'Pending' : '待處理'}
                      </span>
                    </h4>
                    {workflows.filter(w => w.status === 'Pending').length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                        {lang === 'en' ? 'No pending approval actions' : '無待處理的審批事項'}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {workflows.filter(w => w.status === 'Pending').map(w => (
                          <div 
                            key={w.id} 
                            onClick={() => {
                              setActiveTab('approvals');
                              setIsNotificationsOpen(false);
                            }}
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                              e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--primary)' }}>
                              <span>{w.type}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>Pending</span>
                            </div>
                            <div style={{ color: 'var(--text-main)', marginTop: '4px', fontWeight: 500 }}>{w.title}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{w.requestedDate}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* WORKSPACE CONTENT ROUTER */}
        <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'dashboard' && (
            <DashboardView
              purchaseOrders={purchaseOrders}
              salesOrders={salesOrders}
              inventory={inventory}
              activities={activities}
              setActiveTab={handleSetActiveTab}
              activeSubView={activeDashboardSubView}
              setActiveSubView={setActiveDashboardSubView}
              
              // View components dependencies passed as props
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              isBackendOnline={isBackendOnline}
              lang={lang}
              employees={employees}
              setEmployees={setEmployees}
              leaves={leaves}
              setLeaves={setLeaves}
              userProfile={userProfile}
              leaveTypes={leaveTypes}
              updateLeaveTypes={updateLeaveTypes}
              workflows={workflows}
              setWorkflows={setWorkflows}
              documents={documents}
              setDocuments={setDocuments}
              isAiOnline={isAiOnline}
              saveUserProfile={saveUserProfile}
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
              fetchBackendData={fetchBackendData}
            />
          )}
        </main>
      </div>
    </div>
    </LangContext.Provider>
  );
}

// ==========================================
// VIEW COMPONENTS
// ==========================================

// --- 1. EMPLOYEE DASHBOARD ---
function DashboardChart() {
  const [selectedLayer, setSelectedLayer] = useState('satisfaction');
  const chartRef = useRef<HTMLDivElement>(null);
  const echartsInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance
    if (!echartsInstanceRef.current) {
      echartsInstanceRef.current = echarts.init(chartRef.current, 'dark');
    }

    // Set chart options based on selected layer
    let options: any = {};
    const textStyle = {
      color: '#cbd5e1',
      fontFamily: 'system-ui, sans-serif'
    };

    const baseGrid = {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    };

    if (selectedLayer === 'satisfaction') {
      options = {
        title: {
          text: 'Employee Satisfaction & Burnout by Department',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: 16 }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['Satisfaction Index', 'Burnout Index'],
          bottom: '0%',
          textStyle: textStyle
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: ['HR', 'Engineering', 'Sales', 'Finance', 'Production', 'Logistics'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 10,
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Satisfaction Index',
            type: 'line',
            smooth: true,
            data: [8.2, 7.8, 8.5, 7.4, 8.1, 7.9],
            itemStyle: { color: '#0ea5e9' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(14, 165, 233, 0.4)' },
                { offset: 1, color: 'rgba(14, 165, 233, 0.0)' }
              ])
            }
          },
          {
            name: 'Burnout Index',
            type: 'line',
            smooth: true,
            data: [3.1, 4.2, 2.8, 5.1, 3.6, 3.9],
            itemStyle: { color: '#f43f5e' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(244, 63, 94, 0.4)' },
                { offset: 1, color: 'rgba(244, 63, 94, 0.0)' }
              ])
            }
          }
        ]
      };
    } else if (selectedLayer === 'sales_orders') {
      options = {
        title: {
          text: 'Active Sales Orders & Monthly Revenue',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: 16 }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['Active Orders', 'Revenue (NT$10k)'],
          bottom: '0%',
          textStyle: textStyle
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Active Orders',
            type: 'bar',
            data: [12, 18, 25, 30, 35, 41, 45],
            itemStyle: { color: '#10b981' }
          },
          {
            name: 'Revenue (NT$10k)',
            type: 'line',
            smooth: true,
            data: [36, 54, 75, 90, 105, 123, 135],
            itemStyle: { color: '#f59e0b' }
          }
        ]
      };
    } else if (selectedLayer === 'purchase_orders') {
      options = {
        title: {
          text: 'Purchase Values & Items Received Trends',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: 16 }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['Purchase Value (NT$10k)', 'Items Received'],
          bottom: '0%',
          textStyle: textStyle
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Purchase Value (NT$10k)',
            type: 'line',
            smooth: true,
            data: [20, 28, 35, 40, 48, 55, 60],
            itemStyle: { color: '#a855f7' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(168, 85, 247, 0.4)' },
                { offset: 1, color: 'rgba(168, 85, 247, 0.0)' }
              ])
            }
          },
          {
            name: 'Items Received',
            type: 'bar',
            data: [8, 14, 18, 22, 26, 30, 32],
            itemStyle: { color: '#0ea5e9' }
          }
        ]
      };
    } else if (selectedLayer === 'leave_requests') {
      options = {
        title: {
          text: 'Leave Category Distribution & Status',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: 16 }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: {
          data: ['Approved', 'Pending'],
          bottom: '0%',
          textStyle: textStyle
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: ['Sick', 'Personal', 'Annual', 'Maternity', 'Official'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Approved',
            type: 'bar',
            stack: 'total',
            data: [15, 12, 28, 4, 8],
            itemStyle: { color: '#10b981' }
          },
          {
            name: 'Pending',
            type: 'bar',
            stack: 'total',
            data: [2, 3, 1, 0, 1],
            itemStyle: { color: '#f59e0b' }
          }
        ]
      };
    }

    // Set options
    echartsInstanceRef.current.setOption(options);

    // Resize handler
    const handleResize = () => {
      echartsInstanceRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedLayer]);

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-color)' }}>Interactive Metrics Analyzer</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Select a metrics layer to visualize live corporate trends via Apache ECharts</p>
        </div>
        
        {/* Layer Selector */}
        <select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        >
          <option value="satisfaction">Employee Satisfaction Index</option>
          <option value="sales_orders">Sales Orders & Revenue</option>
          <option value="purchase_orders">Purchase Orders & Shipments</option>
          <option value="leave_requests">Leave Request Analytics</option>
        </select>
      </div>

      {/* Chart container */}
      <div ref={chartRef} style={{ width: '100%', height: '320px', borderRadius: 'var(--radius-sm)' }} />
    </div>
  );
}

function DashboardView({
  purchaseOrders,
  salesOrders,
  inventory,
  activities,
  setActiveTab,
  activeSubView,
  setActiveSubView,

  // Sub-view component props
  announcements,
  setAnnouncements,
  isBackendOnline,
  lang,
  employees,
  setEmployees,
  leaves,
  setLeaves,
  userProfile,
  leaveTypes,
  updateLeaveTypes,
  workflows,
  setWorkflows,
  documents,
  setDocuments,
  isAiOnline,
  saveUserProfile,
  knowledgeBase,
  setKnowledgeBase,
  fetchBackendData
}: any) {
  const totalPOs = purchaseOrders.length;
  const totalSOs = salesOrders.length;
  const totalInvItems = inventory.length;
  const lowStockCount = inventory.filter((item: any) => item.isLowStock || item.quantity <= 10).length;

  const titleMapping: any = {
    'announcements': 'Announcements & News Board',
    'hr-services': 'HR Employee Directories',
    'leave': 'Leave Management Center',
    'documents': 'Document Center',
    'ai-copilot': 'Smart AI Copilot',
    'approvals': 'Workflow Sign-Off Approvals',
    'erp-access': 'ERP Raw Access Logs',
    'reports': 'Reports & Operational Analytics',
    'profile': 'User Profile',
    'inventory': 'Inventory Stock Manager',
    'purchase-orders': 'Purchase Orders Database',
    'sales-orders': 'Sales Orders Database',
    'workflows-config': 'Operational Workflows Editor',
    'document-ai': 'Document AI OCR',
    'knowledge-base': 'Company Knowledge Base',
    'erp-integration': 'ERP Connector Settings',
    'real-data': 'PostgreSQL Raw Row Viewer',
    'nextchat': 'NextChat (Dify)',
    'meeting-ai': 'Meeting AI',
    'rvc-studio': 'RVC Voice AI Studio',
    'tidb-data': 'TiDB Cloud SQL Editor',
    'qr-management': 'TiDB QR Management'
  };

  if (activeSubView !== 'home') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Navigation Back Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)'
        }}>
          <button 
            onClick={() => setActiveSubView('home')} 
            className="btn" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'var(--text-color)',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-color)' }}>
            {titleMapping[activeSubView] || activeSubView}
          </span>
        </div>

        {/* Selected Component */}
        {activeSubView === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            isBackendOnline={isBackendOnline}
            lang={lang}
          />
        )}
        {activeSubView === 'hr-services' && <HRServicesView employees={employees} setEmployees={setEmployees} isBackendOnline={isBackendOnline} />}
        {activeSubView === 'leave' && (
          <LeaveManagementView
            leaves={leaves}
            setLeaves={setLeaves}
            isBackendOnline={isBackendOnline}
            userProfile={userProfile}
            leaveTypes={leaveTypes}
            updateLeaveTypes={updateLeaveTypes}
            workflows={workflows}
            setWorkflows={setWorkflows}
          />
        )}
        {activeSubView === 'documents' && (
          <DocumentCenterView
            documents={documents}
            setDocuments={setDocuments}
            isBackendOnline={isBackendOnline}
            userProfile={userProfile}
          />
        )}
        {activeSubView === 'ai-copilot' && (
          <AICopilotView
            isAiOnline={isAiOnline}
            inventory={inventory}
            purchaseOrders={purchaseOrders}
            salesOrders={salesOrders}
            employees={employees}
            lang={lang}
          />
        )}
        {activeSubView === 'approvals' && (
          <WorkflowApprovalsView
            workflows={workflows}
            setWorkflows={setWorkflows}
            isBackendOnline={isBackendOnline}
            fetchBackendData={fetchBackendData}
          />
        )}
        {activeSubView === 'erp-access' && (
          <ERPAccessView
            inventory={inventory}
            purchaseOrders={purchaseOrders}
            salesOrders={salesOrders}
          />
        )}
        {activeSubView === 'reports' && (
          <ReportsAnalyticsView
            purchaseOrders={purchaseOrders}
            salesOrders={salesOrders}
            inventory={inventory}
          />
        )}
        {activeSubView === 'profile' && (
          <UserProfileView
            userProfile={userProfile}
            setUserProfile={saveUserProfile}
          />
        )}
        {activeSubView === 'inventory' && <InventoryView inventory={inventory} />}
        {activeSubView === 'purchase-orders' && <PurchaseOrdersView purchaseOrders={purchaseOrders} />}
        {activeSubView === 'sales-orders' && <SalesOrdersView salesOrders={salesOrders} />}
        {activeSubView === 'workflows-config' && <WorkflowsConfigView />}
        {activeSubView === 'document-ai' && (
          <DocumentAIView
            isAiOnline={isAiOnline}
            documents={documents}
            setDocuments={setDocuments}
            isBackendOnline={isBackendOnline}
            userProfile={userProfile}
          />
        )}
        {activeSubView === 'knowledge-base' && (
          <KnowledgeBaseView
            knowledgeBase={knowledgeBase}
            setKnowledgeBase={setKnowledgeBase}
            isBackendOnline={isBackendOnline}
            isAiOnline={isAiOnline}
          />
        )}
        {activeSubView === 'erp-integration' && <ERPIntegrationView isBackendOnline={isBackendOnline} />}
        
        {activeSubView === 'nextchat' && (
          <div style={{ height: '80vh', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe src={`https://${window.location.hostname}:3441/#/?settings=${encodeURIComponent(JSON.stringify({ key: userProfile.email || "kallec@wugroup.co" }))}`} style={{ width: '100%', height: '100%', border: 'none' }} title="NextChat" />
          </div>
        )}
                  {activeSubView === 'meeting-ai' && (
            <div style={{ height: '80vh', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe src={`https://${window.location.hostname}:3440`} style={{ width: '100%', height: '100%', border: 'none' }} title="Meeting AI" />
            </div>
          )}
          {activeSubView === 'rvc-studio' && (
            <div style={{ height: '80vh', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe src={`https://${window.location.hostname}:3442`} style={{ width: '100%', height: '100%', border: 'none' }} title="RVC Studio" />
            </div>
          )}
        {activeSubView === 'qr-management' && <QRManagementView lang={lang} />}
          {activeSubView === 'real-data' && (
          <RealDataView
            announcements={announcements}
            leaves={leaves}
            workflows={workflows}
            inventory={inventory}
            purchaseOrders={purchaseOrders}
            salesOrders={salesOrders}
            knowledgeBase={knowledgeBase}
            documents={documents}
            employees={employees}
          />
        )}
      </div>
    );
  }

  // Define launcher grid items
  const services = [
    { id: 'announcements', label: TRANSLATIONS[lang]?.announcements || 'Announcements', desc: 'Company Announcements & Notifications', icon: Megaphone, color: '#38bdf8' },
    { id: 'hr-services', label: TRANSLATIONS[lang]?.hrServices || 'HR Services', desc: 'HR & Directory Services', icon: Users, color: '#34d399' },
    { id: 'leave', label: TRANSLATIONS[lang]?.leave || 'Leave Management', desc: 'Submit Leaves & View Entitlements', icon: Calendar, color: '#f472b6' },
    { id: 'documents', label: TRANSLATIONS[lang]?.documents || 'Documents', desc: 'Company Document Store & Search', icon: FolderOpen, color: '#fbbf24' },
    { id: 'ai-copilot', label: TRANSLATIONS[lang]?.aiCopilot || 'AI Copilot', desc: 'Smart Platform AI Copilot', icon: Bot, color: '#34d399' },
    { id: 'approvals', label: TRANSLATIONS[lang]?.approvals || 'Approvals', desc: 'Request Approvals & Action Items', icon: CheckSquare, color: '#c084fc' },
    { id: 'erp-access', label: TRANSLATIONS[lang]?.erpAccess || 'ERP Access', desc: 'Direct ERP Data Logs', icon: Database, color: '#38bdf8' },
    { id: 'reports', label: TRANSLATIONS[lang]?.reports || 'Reports & Analytics', desc: 'Reports, Drag & Resize Analytics', icon: BarChart3, color: '#fb923c' },
    { id: 'profile', label: TRANSLATIONS[lang]?.profile || 'User Profile', desc: 'My Profile & Avatar Details', icon: User, color: '#cbd5e1' },
    { id: 'inventory', label: TRANSLATIONS[lang]?.inventory || 'Inventory', desc: 'Verify Current Stock Levels', icon: Package, color: '#c084fc' },
    { id: 'purchase-orders', label: TRANSLATIONS[lang]?.purchaseOrders || 'Purchase Orders', desc: 'Explore Active Purchases Logs', icon: FileText, color: '#38bdf8' },
    { id: 'sales-orders', label: TRANSLATIONS[lang]?.salesOrders || 'Sales Orders', desc: 'Explore Customer Sales History', icon: TrendingUp, color: '#34d399' },
    { id: 'workflows-config', label: TRANSLATIONS[lang]?.workflows || 'Workflows', desc: 'Manage Workflow Diagrams', icon: WorkflowIcon, color: '#818cf8' },
    { id: 'document-ai', label: TRANSLATIONS[lang]?.documentAi || 'Document AI', desc: 'AI Document Parsing & OCR', icon: Cpu, color: '#60a5fa' },
    { id: 'knowledge-base', label: TRANSLATIONS[lang]?.knowledgeBase || 'Knowledge Base', desc: 'FAQ, Guides & System Documentation', icon: BookOpen, color: '#2dd4bf' },
    { id: 'erp-integration', label: TRANSLATIONS[lang]?.erpIntegration || 'ERP Integration', desc: 'Manage Live Database Connections', icon: RefreshCw, color: '#fb7185' },
    { id: 'real-data', label: TRANSLATIONS[lang]?.realData || 'Real Data', desc: 'Inspect raw PostgreSQL data rows', icon: Info, color: '#c084fc' },
      { id: 'nextchat', label: 'NextChat (Dify)', desc: 'Enterprise AI NextChat Gateway', icon: Bot, color: '#f59e0b' },
      { id: 'meeting-ai', label: 'Meeting AI', desc: 'Transcriber and Meeting Summarization', icon: Megaphone, color: '#10b981' },
      { id: 'rvc-studio', label: 'RVC Studio', desc: 'Retrieval-based Voice Conversion AI', icon: Megaphone, color: '#a855f7' },
      { id: 'tidb-data', label: 'TiDB Data View', desc: 'TiDB Cloud SQL Editor', icon: Database, color: '#3b82f6' },
      { id: 'qr-management', label: 'QR Management (TiDB)', desc: 'Manage TiDB Garment QR Codes', icon: QrCode, color: '#6366f1' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url("/dashboard_background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(30px)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.25rem', color: '#ffffff' }}>Welcome to Cotton Republic Portal</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem' }}>Dah Je Co LTD (大傑有限公司) • Smart Enterprise AI Platform</p>
          </div>
        </div>
      </div>

      {/* Launcher Grid Section */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-color)' }}>Portal Applications & Services</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {services.map((srv) => {
            const SrvIcon = srv.icon;
            return (
              <div
                key={srv.id}
                className="glass-panel"
                onClick={() => setActiveSubView(srv.id)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = srv.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${srv.color}15`;
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  backgroundColor: `${srv.color}15`,
                  color: srv.color,
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <SrvIcon size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-color)' }}>{srv.label}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{srv.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Numerical Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total POs</span>
            <span style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>{totalPOs}</span>
          </div>
          <FileText size={32} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, color: 'var(--primary)' }} />
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total SOs</span>
            <span style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem' }}>{totalSOs}</span>
          </div>
          <TrendingUp size={32} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, color: 'var(--success)' }} />
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Inventory Items</span>
            <span style={{ fontSize: '2.75rem', fontWeight: 700, color: '#a855f7', marginTop: '0.5rem' }}>{totalInvItems}</span>
          </div>
          <Package size={32} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, color: '#a855f7' }} />
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', borderLeft: lowStockCount > 0 ? '4px solid var(--warning)' : '' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Low Stock</span>
            <span style={{ fontSize: '2.75rem', fontWeight: 700, color: lowStockCount > 0 ? 'var(--warning)' : 'var(--text-muted)', marginTop: '0.5rem' }}>{lowStockCount}</span>
          </div>
          <AlertTriangle size={32} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, color: 'var(--warning)' }} />
        </div>
      </div>

      {/* Quick Actions Buttons */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button className="btn" onClick={() => setActiveSubView('documents')} style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', justifyContent: 'center' }}>
            <FolderOpen size={18} /> Submit Document
          </button>
          <button className="btn" onClick={() => setActiveSubView('leave')} style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)', color: 'white', justifyContent: 'center' }}>
            <Calendar size={18} /> Request Leave
          </button>
          <button className="btn" onClick={() => setActiveSubView('ai-copilot')} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', justifyContent: 'center' }}>
            <Bot size={18} /> Ask AI
          </button>
          <button className="btn" onClick={() => setActiveSubView('reports')} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', justifyContent: 'center' }}>
            <BarChart3 size={18} /> View Reports
          </button>
        </div>
      </div>

      {/* Interactive ECharts Dashboard */}
      <DashboardChart />

      {/* Recent Activity Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((act: any) => (
            <div key={act.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{act.text}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>by {act.user}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 2. ANNOUNCEMENTS ---
function AnnouncementsView({ announcements, setAnnouncements, isBackendOnline, lang }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [author, setAuthor] = useState('Kalle Chakradhar');
  const [filter, setFilter] = useState('All');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = { title, content, category, author };

    if (isBackendOnline) {
      try {
        const res = await fetch(BACKEND_URL + '/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newAnn = await res.json();
          setAnnouncements([newAnn, ...announcements]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock Local Add
      const newAnn = {
        id: Date.now(),
        ...payload,
        date: new Date().toLocaleDateString()
      };
      setAnnouncements([newAnn, ...announcements]);
    }

    setTitle('');
    setContent('');
  };

  const filteredAnnouncements = announcements.filter(
    (ann: any) => filter === 'All' || ann.category === filter
  );

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{TRANSLATIONS[lang].internalAnnouncements}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'General', 'HR', 'Finance', 'IT'].map(cat => {
              const localizedCat = cat === 'All' ? TRANSLATIONS[lang].filterAll :
                                   cat === 'General' ? TRANSLATIONS[lang].filterGeneral :
                                   cat === 'HR' ? TRANSLATIONS[lang].filterHr :
                                   cat === 'Finance' ? TRANSLATIONS[lang].filterFinance :
                                   TRANSLATIONS[lang].filterIt;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '99px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: filter === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600
                  }}
                >
                  {localizedCat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAnnouncements.map((ann: any) => {
            const displayCategory = ann.category === 'All' ? TRANSLATIONS[lang].filterAll :
                                    ann.category === 'General' ? TRANSLATIONS[lang].filterGeneral :
                                    ann.category === 'HR' ? TRANSLATIONS[lang].filterHr :
                                    ann.category === 'Finance' ? TRANSLATIONS[lang].filterFinance :
                                    ann.category === 'IT' ? TRANSLATIONS[lang].filterIt :
                                    ann.category;
            return (
              <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge" style={{
                    backgroundColor: ann.category === 'Finance' ? 'var(--danger-glass)' : ann.category === 'HR' ? 'var(--accent-glass)' : ann.category === 'IT' ? 'var(--primary-glass)' : 'rgba(255, 255, 255, 0.1)',
                    color: ann.category === 'Finance' ? 'var(--danger)' : ann.category === 'HR' ? 'var(--accent)' : ann.category === 'IT' ? 'var(--primary)' : 'var(--text-main)'
                  }}>{displayCategory}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{ann.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{ann.content}</p>
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {TRANSLATIONS[lang].postedBy} <strong style={{ color: 'var(--text-main)' }}>{ann.author}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Announcement Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>{TRANSLATIONS[lang].createAnnouncement}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{TRANSLATIONS[lang].title}</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={TRANSLATIONS[lang].placeholderTitle}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{TRANSLATIONS[lang].category}</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ background: '#1f2029' }}
            >
              <option value="General">{TRANSLATIONS[lang].filterGeneral}</option>
              <option value="HR">{TRANSLATIONS[lang].filterHr}</option>
              <option value="Finance">{TRANSLATIONS[lang].filterFinance}</option>
              <option value="IT">{TRANSLATIONS[lang].filterIt}</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{TRANSLATIONS[lang].content}</label>
            <textarea
              className="form-input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={TRANSLATIONS[lang].placeholderContent}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{TRANSLATIONS[lang].authorName}</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            {TRANSLATIONS[lang].postAnnouncement}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- 3. HR SERVICES ---
function HRServicesView({ employees, setEmployees, isBackendOnline }: any) {
  const hrContacts = [
    { name: 'David Vance', title: 'HR Director', email: 'david.vance@dahje.com', phone: '+886-2-8765-4321', ext: '101' },
    { name: 'Alice Wu', title: 'Recruitment Manager', email: 'alice.wu@dahje.com', phone: '+886-2-8765-4322', ext: '102' },
    { name: 'Kevin Lin', title: 'Employee Relations', email: 'kevin.lin@dahje.com', phone: '+886-2-8765-4323', ext: '103' }
  ];

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<any>(null);

  const [empName, setEmpName] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [empDept, setEmpDept] = useState('Production');
  const [empSex, setEmpSex] = useState('M');
  const [empMarital, setEmpMarital] = useState('Single');
  const [empSalary, setEmpSalary] = useState('');
  const [empHireDate, setEmpHireDate] = useState('');
  const [empManager, setEmpManager] = useState('');
  const [empScore, setEmpScore] = useState('Fully Meets');
  const [empSatisfaction, setEmpSatisfaction] = useState('5');
  const [empAbsences, setEmpAbsences] = useState('0');

  const openAddModal = () => {
    setEditingEmp(null);
    setEmpName('');
    setEmpCode(String(10000 + Math.floor(Math.random() * 9000)));
    setEmpPosition('');
    setEmpDept('Production');
    setEmpSex('M');
    setEmpMarital('Single');
    setEmpSalary('65000');
    setEmpHireDate(new Date().toLocaleDateString('en-US'));
    setEmpManager('Brandon R. LeBlanc');
    setEmpScore('Fully Meets');
    setEmpSatisfaction('5');
    setEmpAbsences('0');
    setIsModalOpen(true);
  };

  const openEditModal = (emp: any) => {
    setEditingEmp(emp);
    setEmpName(emp.employeeName);
    setEmpCode(emp.empId);
    setEmpPosition(emp.position);
    setEmpDept(emp.department);
    setEmpSex(emp.sex || 'M');
    setEmpMarital(emp.maritalDesc || 'Single');
    setEmpSalary(String(emp.salary));
    setEmpHireDate(emp.dateOfHire);
    setEmpManager(emp.managerName);
    setEmpScore(emp.performanceScore || 'Fully Meets');
    setEmpSatisfaction(String(emp.empSatisfaction || 5));
    setEmpAbsences(String(emp.absences || 0));
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employeeName: empName,
      empId: empCode,
      position: empPosition,
      department: empDept,
      sex: empSex,
      maritalDesc: empMarital,
      employmentStatus: 'Active',
      salary: Number(empSalary),
      dateOfHire: empHireDate,
      managerName: empManager,
      engagementSurvey: editingEmp ? editingEmp.engagementSurvey : 4.0,
      empSatisfaction: Number(empSatisfaction),
      absences: Number(empAbsences),
      performanceScore: empScore
    };

    if (isBackendOnline) {
      try {
        if (editingEmp) {
          const res = await fetch(`${BACKEND_URL}/employees/${editingEmp.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const updated = await res.json();
            setEmployees(employees.map((e: any) => e.id === editingEmp.id ? updated : e));
          }
        } else {
          const res = await fetch(`${BACKEND_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const created = await res.json();
            setEmployees([created, ...employees]);
          }
        }
      } catch (err) {
        console.error('Error modifying employee database', err);
      }
    } else {
      if (editingEmp) {
        setEmployees(employees.map((e: any) => e.empId === editingEmp.empId ? { ...e, ...payload } : e));
      } else {
        setEmployees([{ id: Date.now(), ...payload }, ...employees]);
      }
    }

    setIsModalOpen(false);
  };

  const filteredEmployees = (employees || []).filter((emp: any) => {
    const matchesSearch = emp.employeeName.toLowerCase().includes(search.toLowerCase()) || 
                          emp.position.toLowerCase().includes(search.toLowerCase()) ||
                          emp.empId.includes(search);
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getPerformanceBadge = (score: string) => {
    const s = (score || '').toLowerCase();
    let bg = 'rgba(34, 197, 94, 0.15)';
    let color = '#22c55e';
    if (s === 'exceeds') {
      bg = 'rgba(168, 85, 247, 0.15)';
      color = '#a855f7';
    } else if (s.includes('needs') || s.includes('pip')) {
      bg = 'rgba(239, 68, 68, 0.15)';
      color = '#ef4848';
    }
    return (
      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: bg, color }}>
        {score}
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>HR Services & Contacts</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {hrContacts.map((contact, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-glass)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700
              }}>
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{contact.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{contact.title}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email: <strong style={{ color: 'var(--text-light)' }}>{contact.email}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Phone: <strong style={{ color: 'var(--text-light)' }}>{contact.phone}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Office Ext: <strong style={{ color: 'var(--text-light)' }}>{contact.ext}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Directory Section */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Employee Directory (Kaggle HR Dataset)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real enterprise employee directory loaded from the database.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={openAddModal}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#000',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Plus size={16} />
              <span>Register Employee</span>
            </button>
            <input
              type="text"
              placeholder="Search employee or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.85rem',
                width: '200px'
              }}
            />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Departments</option>
              <option value="Production">Production</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="IT/IS">IT/IS</option>
              <option value="Admin Offices">Admin Offices</option>
              <option value="Executive Office">Executive Office</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredEmployees.map((emp: any) => (
            <div key={emp.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{emp.employeeName}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.position} (ID: {emp.empId})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {getPerformanceBadge(emp.performanceScore)}
                  <button
                    onClick={() => openEditModal(emp)}
                    title="Adjust Profile"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--primary)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.4rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-glass)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', color: 'var(--text-muted)' }}>
                <div>Dept: <strong style={{ color: 'var(--text-light)' }}>{emp.department}</strong></div>
                <div>Salary: <strong style={{ color: 'var(--text-light)' }}>${(emp.salary || 0).toLocaleString()}</strong></div>
                <div>Manager: <strong style={{ color: 'var(--text-light)' }}>{emp.managerName}</strong></div>
                <div>Hired: <strong style={{ color: 'var(--text-light)' }}>{emp.dateOfHire}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span>Absences: <strong style={{ color: emp.absences > 5 ? '#ef4848' : 'var(--text-light)' }}>{emp.absences}</strong></span>
                  <span>Satisfaction: <strong style={{ color: 'var(--warning)' }}>{'★'.repeat(emp.empSatisfaction || 5)}</strong></span>
                </div>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No employees match your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Forms Section */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Frequently Used HR Forms</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            'Travel Reimbursement Form',
            'Medical Claim Submission',
            'Internal Job Application',
            'Equipment Request Agreement',
            'Referral Reward Application'
          ].map((form, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.01)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => alert(`Downloading mock template: ${form}.pdf`)}>
              <span style={{ fontSize: '0.85rem' }}>{form}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>PDF</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(20, 21, 28, 0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                {editingEmp ? 'Adjust Employee Profile' : 'Register New Employee'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', padding: '0 0.5rem' }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Employee Name</label>
                  <input 
                    type="text" required
                    value={empName} onChange={e => setEmpName(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Employee ID</label>
                  <input 
                    type="text" required disabled={!!editingEmp}
                    value={empCode} onChange={e => setEmpCode(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)', color: '#aaa', cursor: 'not-allowed', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Position / Role</label>
                  <input 
                    type="text" required
                    value={empPosition} onChange={e => setEmpPosition(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</label>
                  <select 
                    value={empDept} onChange={e => setEmpDept(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#181920', color: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Production">Production</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="IT/IS">IT/IS</option>
                    <option value="Admin Offices">Admin Offices</option>
                    <option value="Executive Office">Executive Office</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Salary (USD)</label>
                  <input 
                    type="number" required
                    value={empSalary} onChange={e => setEmpSalary(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manager Name</label>
                  <input 
                    type="text" required
                    value={empManager} onChange={e => setEmpManager(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender</label>
                  <select 
                    value={empSex} onChange={e => setEmpSex(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#181920', color: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marital Status</label>
                  <select 
                    value={empMarital} onChange={e => setEmpMarital(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#181920', color: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hire Date</label>
                  <input 
                    type="text" required
                    value={empHireDate} onChange={e => setEmpHireDate(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Performance</label>
                  <select 
                    value={empScore} onChange={e => setEmpScore(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#181920', color: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Exceeds">Exceeds</option>
                    <option value="Fully Meets">Fully Meets</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="PIP">PIP</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Satisfaction (1-5)</label>
                  <input 
                    type="number" min="1" max="5" required
                    value={empSatisfaction} onChange={e => setEmpSatisfaction(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Absences</label>
                  <input 
                    type="number" min="0" required
                    value={empAbsences} onChange={e => setEmpAbsences(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--primary)', color: '#000', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. LEAVE MANAGEMENT ---
function LeaveManagementView({ leaves, setLeaves, isBackendOnline, userProfile, leaveTypes, updateLeaveTypes, workflows, setWorkflows }: any) {
  const [type, setType] = useState(leaveTypes && leaveTypes.length > 0 ? (leaveTypes[0].name || leaveTypes[0]) : 'Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  const isManager = userProfile.role.toLowerCase().includes('manager') || userProfile.role.toLowerCase().includes('director');
  const isFemale = userProfile.name.toLowerCase().includes('sarah') || userProfile.name.toLowerCase().includes('jane') || userProfile.name.toLowerCase().includes('colleen') || userProfile.name.toLowerCase().includes('jennifer');

  const getLimit = (t: string) => {
    const config = (leaveTypes || []).find((lt: any) => {
      const name = typeof lt === 'string' ? lt : lt.name;
      return name.toLowerCase() === t.toLowerCase();
    });
    if (config && typeof config === 'object') {
      if (config.limit === 'Unlimited') return Infinity;
      return Number(config.limit);
    }

    const lower = t.toLowerCase();
    if (lower === 'annual') return isManager ? 18 : 10;
    if (lower === 'sick') return 30;
    if (lower === 'maternity/paternity' || lower === 'maternity' || lower === 'paternity') return isFemale ? 56 : 5;
    if (lower === 'unpaid') return 14;
    if (lower.includes('personal')) return 7;
    return Infinity;
  };

  const getUsedDays = (leaveType: string) => {
    return (leaves || [])
      .filter((l: any) => l.employeeName === userProfile.name && l.type === leaveType && l.status !== 'Rejected')
      .reduce((acc: number, curr: any) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return acc;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return acc + diffDays;
      }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    const isSick = type.toLowerCase().includes('sick');
    if (isSick && !proofFileName) {
      alert('Error: You must upload a medical certificate or consultation receipt (PDF or Image) to submit a sick leave request.');
      return;
    }

    // Limit validation check
    const limit = getLimit(type);
    const used = getUsedDays(type);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (used + requestedDays > limit) {
      alert(`Warning: This request exceeds your available limit of ${limit - used} days remaining for ${type} leave.`);
    }

    // Overlap validation check
    const hasOverlap = (leaves || []).some((l: any) => {
      if (l.employeeName !== userProfile.name || l.status === 'Rejected') return false;
      const existingStart = new Date(l.startDate);
      const existingEnd = new Date(l.endDate);
      if (isNaN(existingStart.getTime()) || isNaN(existingEnd.getTime())) return false;
      return start <= existingEnd && existingStart <= end;
    });

    if (hasOverlap) {
      alert(`Error: You have already applied for leave that overlaps with the selected period (${startDate} to ${endDate}). Double booking is not allowed.`);
      return;
    }

    const isSpecial = type === 'Overtime' || type === 'Remote Work';
    const payload = {
      employeeName: userProfile.name,
      type,
      startDate,
      endDate,
      reason,
      proof: isSick ? proofFileName : ''
    };

    if (isBackendOnline) {
      try {
        const res = await fetch(BACKEND_URL + '/leaves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newLeave = await res.json();
          setLeaves([newLeave, ...leaves]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock local
      const newLeave = {
        id: Date.now(),
        ...payload,
        status: isSpecial ? 'Pending Upper Manager' : 'Pending Manager',
        comments: ''
      };
      setLeaves([newLeave, ...leaves]);

      // Mock workflows trigger
      if (workflows && setWorkflows) {
        const newWorkflow = {
          id: Date.now(),
          type: isSpecial ? 'Leave Request (Upper Manager)' : 'Leave Request (Manager)',
          title: `${type} request for ${userProfile.name} (${isSpecial ? 'Upper Manager Approval Required' : 'Manager Approval Required'})`,
          requestedBy: userProfile.name,
          requestedDate: new Date().toLocaleDateString(),
          status: 'Pending',
          description: reason || `Request from ${startDate} to ${endDate}`,
          referenceId: newLeave.id
        };
        setWorkflows([newWorkflow, ...workflows]);
      }
    }

    setStartDate('');
    setEndDate('');
    setReason('');
    setProofFileName('');
    const fileInput = document.getElementById('leave-proof-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    alert(isSpecial 
      ? 'Overtime/Remote request submitted. Routing to Upper Manager approval stage.' 
      : 'Leave request submitted. A waiting approval task was added to approvals workflow.'
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Sidebar Request Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Request Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Submit Leave Request</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Leave Type</label>
              <select
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ background: '#1f2029' }}
              >
                {(leaveTypes || []).map((lt: any) => {
                  const name = typeof lt === 'string' ? lt : lt.name;
                  return (
                    <option key={name} value={name}>
                      {name} {name === 'Overtime' || name === 'Remote Work' ? 'Request' : 'Leave'}
                    </option>
                  );
                })}
              </select>

              {/* Manage Leave Types Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Manage Leave Types</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(leaveTypes || []).map((lt: any, idx: number) => {
                    const name = typeof lt === 'string' ? lt : lt.name;
                    const limit = typeof lt === 'string' ? 'Unlimited' : lt.limit;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', fontSize: '0.72rem', color: '#fff' }}>
                        <span>{name} <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>({limit === 'Unlimited' ? '∞' : `${limit}d`})</span></span>
                        <button
                          type="button"
                          onClick={() => {
                            const newName = prompt('Enter Leave Type Name:', name);
                            if (newName === null) return;
                            
                            const limitInput = prompt('Enter Limit in Days (number or type "Unlimited"):', String(limit));
                            if (limitInput === null) return;

                            const updated = [...leaveTypes];
                            const newLimit = limitInput.trim().toLowerCase() === 'unlimited' ? 'Unlimited' : (parseInt(limitInput) || 7);
                            updated[idx] = { name: newName.trim() || name, limit: newLimit };
                            updateLeaveTypes(updated);
                            if (type === name) setType(newName.trim() || name);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0 0.15rem', display: 'flex', alignItems: 'center' }}
                          title="Adjust Name and Limit"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove the leave type "${name}"?`)) {
                              const updated = leaveTypes.filter((_: any, i: any) => i !== idx);
                              updateLeaveTypes(updated);
                              if (type === name && updated.length > 0) {
                                const nextVal = typeof updated[0] === 'string' ? updated[0] : updated[0].name;
                                setType(nextVal);
                              }
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0 0.15rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
                          title="Delete"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="New type name (e.g. Sabbatical)..."
                    id="new-leave-type-input"
                    style={{
                      padding: '0.3rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Limit (days or 'Unlimited')"
                      id="new-leave-limit-input"
                      defaultValue="Unlimited"
                      style={{
                        flex: 1,
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nameInput = document.getElementById('new-leave-type-input') as HTMLInputElement;
                        const limitInput = document.getElementById('new-leave-limit-input') as HTMLInputElement;
                        if (nameInput && limitInput) {
                          const name = nameInput.value.trim();
                          const limitStr = limitInput.value.trim();
                          if (name) {
                            const limit = limitStr.toLowerCase() === 'unlimited' ? 'Unlimited' : (parseInt(limitStr) || 7);
                            const alreadyExists = leaveTypes.some((lt: any) => {
                              const existingName = typeof lt === 'string' ? lt : lt.name;
                              return existingName.toLowerCase() === name.toLowerCase();
                            });
                            if (!alreadyExists) {
                              updateLeaveTypes([...leaveTypes, { name, limit }]);
                              nameInput.value = '';
                              limitInput.value = 'Unlimited';
                            } else {
                              alert('This leave type name already exists.');
                            }
                          }
                        }
                      }}
                      style={{
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        color: '#000',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Reason</label>
              <textarea
                className="form-input"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief details..."
              />
            </div>

            {/* Dynamic Proof Upload Field for Sick Leave */}
            {type.toLowerCase().includes('sick') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Medical Proof Document <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="leave-proof-file-input"
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  className="form-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProofFileName(file.name);
                    } else {
                      setProofFileName('');
                    }
                  }}
                  style={{
                    padding: '0.4rem 0.5rem',
                    background: '#1f2029',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    width: '100%',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Please upload consultation receipt or medical certificate (PDF/Image).
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Submit Request
            </button>
          </form>
        </div>

        {/* Entitlements Summary Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Leave Entitlements & Availability
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Available allocations calculated under Gov Regulations based on role seniority ({userProfile.role}) and profile.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(leaveTypes || []).map((lt: any) => {
              const t = typeof lt === 'string' ? lt : lt.name;
              const limit = getLimit(t);
              const used = getUsedDays(t);
              const isUnlimited = limit === Infinity;
              const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);
              return (
                <div key={t} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {t} {t === 'Overtime' || t === 'Remote Work' ? 'Quota' : 'Leave'}
                      {isUnlimited && (
                        <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(0, 255, 100, 0.08)', color: '#00ff64', border: '1px solid rgba(0, 255, 100, 0.15)', fontWeight: 700 }}>
                          Unlimited
                        </span>
                      )}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: isUnlimited ? 'var(--primary)' : remaining === 0 ? 'var(--danger)' : remaining < 3 ? 'var(--warning)' : 'var(--success)' 
                    }}>
                      {isUnlimited ? `Used: ${used} ${t === 'Overtime' ? 'Times' : 'Days'}` : `${remaining} / ${limit} ${t === 'Overtime' ? 'Times' : 'Days'} Left`}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ 
                      width: isUnlimited ? '100%' : `${(remaining / limit) * 100}%`, 
                      height: '100%', 
                      backgroundColor: isUnlimited ? 'var(--primary)' : remaining === 0 ? 'var(--danger)' : remaining < 3 ? 'var(--warning)' : 'var(--primary)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Your Leave Requests History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Employee</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Start Date</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>End Date</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Proof</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave: any) => (
              <tr key={leave.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{leave.employeeName}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{leave.type}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{leave.startDate}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{leave.endDate}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  {leave.proof ? (
                    <span 
                      onClick={() => alert(`Opening proof file preview: ${leave.proof}`)}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem', 
                        color: 'var(--primary)', 
                        textDecoration: 'underline', 
                        cursor: 'pointer', 
                        fontSize: '0.8rem' 
                      }}
                      title={leave.proof}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      {leave.proof.length > 12 ? `${leave.proof.slice(0, 10)}...` : leave.proof}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                  )}
                </td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span className={`badge badge-${leave.status.toLowerCase().replace(/ /g, '-')}`}>{leave.status}</span>
                </td>
                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {leave.comments || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 5. DOCUMENT CENTER ---
function DocumentCenterView({ documents, setDocuments, isBackendOnline, userProfile }: any) {
  const [docName, setDocName] = useState('');
  const [docText, setDocText] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docText) return;

    const payload = {
      name: docName,
      path: `/documents/${docName}`,
      uploadedBy: userProfile.name,
      ocrSummary: `Simulated OCR processing for document: ${docName}. Content length: ${docText.length} chars.`,
      keyEntities: 'Internal, Local Document',
      actionItems: 'Review contents'
    };

    if (isBackendOnline) {
      try {
        const res = await fetch(BACKEND_URL + '/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newDoc = await res.json();
          setDocuments([newDoc, ...documents]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const newDoc = {
        id: Date.now(),
        ...payload,
        uploadDate: new Date().toLocaleDateString()
      };
      setDocuments([newDoc, ...documents]);
    }

    setDocName('');
    setDocText('');
    alert('Document added successfully.');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Uploaded Documents</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {documents.map((doc: any) => (
            <div key={doc.id} style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FolderOpen size={24} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Uploaded by: {doc.uploadedBy}</span>
                <span>Date: {doc.uploadDate}</span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '0.5rem',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>
                <strong>OCR Summary:</strong> {doc.ocrSummary ? doc.ocrSummary.substring(0, 100) + '...' : 'No OCR processed.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Upload Document</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Document Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Invoice_INV_883.pdf"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>File Text Content</label>
            <textarea
              className="form-input"
              rows={6}
              placeholder="Paste document text or invoice values here..."
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Upload size={16} /> Save Document
          </button>
        </form>
      </div>
    </div>
  );
}

// --- 6. AI COPILOT ---
function AICopilotView({ isAiOnline, inventory, purchaseOrders, salesOrders, employees = [], lang }: any) {
  const greeting = lang === 'zh-TW' 
    ? '您好！我是您的智能門戶 AI 協同助手。您可以詢問我關於庫存指標、採購單、銷售單或員工與人事部的數據，我也能為您解答各類運營與請假政策。今天有什麼我可以幫您的？' 
    : lang === 'zh-CN' 
    ? '您好！我是您的智能门户 AI 协同助手。您可以询问我关于库存指标、采购单、销售单或员工与人事部的数据，也能为您解答各类运营与请假政策。今天有什么我可以帮您的？' 
    : 'Hello! I am your Smart Enterprise Portal AI Copilot. I can fetch live ERP metrics, search employee lists, draft emails, review HR counts, or search knowledge articles. How can I help you today?';

  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: greeting }
  ]);

  // Load jsPDF and html2canvas dynamically from CDN
  useEffect(() => {
    if (!(window as any).jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
    if (!(window as any).html2canvas) {
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script2.async = true;
      document.body.appendChild(script2);
    }
  }, []);

  const downloadMsgAsPdf = (messageText: string, messageIndex: number) => {
    const { jsPDF } = (window as any).jspdf || {};
    const html2canvas = (window as any).html2canvas;
    
    if (!jsPDF || !html2canvas) {
      alert('PDF generation engine is loading. Please try again in 3 seconds!');
      return;
    }

    // Create a temporary beautiful HTML element for the report layout
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '750px'; // A4 width proportion
    container.style.backgroundColor = '#181920';
    container.style.color = '#ffffff';
    container.style.fontFamily = '"PingFang TC", "Microsoft JhengHei", "Noto Sans TC", "PingFang SC", "Microsoft YaHei", sans-serif';
    container.style.padding = '30px';
    container.style.boxSizing = 'border-box';
    container.style.lineHeight = '1.6';
    
    // Header
    const header = document.createElement('div');
    header.style.backgroundColor = '#1f2029';
    header.style.padding = '20px';
    header.style.borderBottom = '2px solid #00ff64';
    header.style.marginBottom = '25px';
    header.style.borderRadius = '6px';
    
    const title = document.createElement('h2');
    title.innerText = 'Smart Enterprise AI Copilot Report';
    title.style.margin = '0 0 8px 0';
    title.style.color = '#00ff64';
    title.style.fontSize = '22px';
    title.style.fontWeight = 'bold';
    
    const subtitle = document.createElement('div');
    subtitle.style.display = 'flex';
    subtitle.style.justifyContent = 'space-between';
    subtitle.style.fontSize = '12px';
    subtitle.style.color = '#a0aec0';
    
    const company = document.createElement('span');
    company.innerText = 'Dah Je Co LTD (大傑有限公司) - Automated Report';
    const date = document.createElement('span');
    date.innerText = `Generated: ${new Date().toLocaleString()}`;
    
    subtitle.appendChild(company);
    subtitle.appendChild(date);
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Body Text
    const body = document.createElement('div');
    body.style.whiteSpace = 'pre-line';
    body.style.fontSize = '14px';
    body.style.color = '#e2e8f0';
    body.style.padding = '0 10px';
    
    // Clean markdown bold symbols and keep it readable
    const cleanedText = messageText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '');
      
    body.innerText = cleanedText;
    container.appendChild(body);
    document.body.appendChild(container);

    // Render using html2canvas
    html2canvas(container, {
      scale: 2, // higher resolution
      useCORS: true,
      backgroundColor: '#181920'
    }).then((canvas: HTMLCanvasElement) => {
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF, supporting multi-page if needed
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save(`Copilot_Report_${messageIndex + 1}.pdf`);
    }).catch((err: any) => {
      console.error(err);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      alert('Error rendering Chinese font to PDF.');
    });
  };

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: greeting }];
      }
      return prev;
    });
  }, [lang]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const langNames: { [key: string]: string } = {
      en: "English",
      'zh-TW': "Traditional Chinese (繁體中文)",
      'zh-CN': "Simplified Chinese (简体中文)"
    };
    const targetLangName = langNames[lang] || "English";

    let systemContext = `
      You are the Smart Enterprise Portal AI Copilot for Dah Je Co LTD.
      You have access to live ERP and HR data states:
      - Inventory count: ${inventory.length} items. Low stock count: ${inventory.filter((i: any) => i.isLowStock).length} items.
      - Purchase Orders: ${purchaseOrders.length} active.
      - Sales Orders: ${salesOrders.length} active.
      - HR Employee Count: ${employees.length} employees currently registered.
      
      Answer questions professionally. If the user asks for directories, active orders, or leaves, query them via your database tools.
      
      CRITICAL LANGUAGE INSTRUCTION: You MUST translate and write your entire response in ${targetLangName}. Do not output any other language.
    `;

    if (isAiOnline) {
      try {
        const res = await fetch(AI_URL + '/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMsg,
            history: messages.map(m => ({ role: m.role, content: m.content })),
            system_instruction: systemContext
          })
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } else {
          throw new Error('AI service failed');
        }
      } catch (err) {
        const fallbackText = lang === 'zh-TW'
          ? `無法連接至雲端 AI 服務。請確認 FastAPI 服務是否在連接埠 8080 正常運行。\n\n*本地模擬回覆*：目前採購訂單：30，銷售訂單：41，庫存總計：30件，人事部員工總數為：${employees.length}名。`
          : lang === 'zh-CN'
          ? `无法连接至云端 AI 服务。请确认 FastAPI 服务是否在端口 8080 正常运行。\n\n*本地模拟回复*：目前采购订单：30，销售订单：41，库存总计：30件，人事部员工总数为：${employees.length}名。`
          : `Error communicating with the Python FastAPI AI service. Please make sure the server is running on port 8080. \n\n*Local Mock Response*: Total POs: 30, Total SOs: 41, Inventory: 30 items, HR Employee headcount is: ${employees.length} employees.`;
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackText }]);
      }
    } else {
      // Offline local AI Mock
      setTimeout(() => {
        let answer = "";
        if (lang === 'zh-TW') {
          answer += "系統目前運行於離線模擬模式。請在 Render 或本地端啟動 Python FastAPI 服務，並配置您的 Hugging Face 金鑰來啟用完整的 Qwen 智能模型。\n\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock') || userMsg.includes('庫存') || userMsg.includes('存貨')) {
            answer += `實時庫存狀態：我們在 ERP 數據庫中擁有 ${inventory.length} 件紡織品和面料。其中，1 件標記為「低庫存」狀態，急需補貨。`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase') || userMsg.includes('採購')) {
            answer += `採購單統計：當前系統中已同步並記錄了 ${purchaseOrders.length} 筆活躍採購訂單。`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales') || userMsg.includes('銷售')) {
            answer += `銷售單統計：當前系統中已處理並歸檔了 ${salesOrders.length} 筆活躍銷售訂單。`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr') || userMsg.includes('員工') || userMsg.includes('雇員') || userMsg.includes('人數') || userMsg.includes('人事')) {
            answer += `人事部統計：我們的人力資源系統中目前註冊了 ${employees.length} 名員工。您可以在「人事服務」頁面查看完整的員工名冊和主管名單。`;
          } else {
            answer += `模擬助手回覆：「${userMsg}」。請問還有什麼我可以協助您查詢的嗎？`;
          }
        } else if (lang === 'zh-CN') {
          answer += "系统目前运行于离线模拟模式。请在 Render 或本地端启动 Python FastAPI 服务，并配置您的 Hugging Face 密钥来启用完整的 Qwen 智能模型。\n\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock') || userMsg.includes('库存') || userMsg.includes('存货')) {
            answer += `实时库存状态：我们在 ERP 数据库中拥有 ${inventory.length} 件纺织品和面料。其中，1 件标记为「低库存」状态，急需补货。`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase') || userMsg.includes('采购')) {
            answer += `采购单统计：当前系统中已同步并记录了 ${purchaseOrders.length} 笔活跃采购订单。`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales') || userMsg.includes('销售')) {
            answer += `销售单统计：当前系统中已处理并归档了 ${salesOrders.length} 笔活跃销售订单。`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr') || userMsg.includes('员工') || userMsg.includes('雇员') || userMsg.includes('人数') || userMsg.includes('人事')) {
            answer += `人事部统计：我们的人力资源系统中目前注册了 ${employees.length} 名员工。您可以在「人事服务」页面查看完整的员工名册和主管名单。`;
          } else {
            answer += `模拟助手回复：“${userMsg}”。请问还有什么我可以协助您查询的吗？`;
          }
        } else {
          answer += "I am running in offline mode. Please run the Python FastAPI AI service (port 8080) with your HuggingFace API key to activate full Qwen models. \n\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock')) {
            answer += `Current Inventory status: We have ${inventory.length} inventory products in the ERP database. Out of these, 1 item is marked as LOW STOCK.`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase')) {
            answer += `We have ${purchaseOrders.length} active Purchase Orders synced with the supply chain db.`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales')) {
            answer += `We have ${salesOrders.length} active Sales Orders processed.`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr') || userMsg.toLowerCase().includes('staff') || userMsg.toLowerCase().includes('headcount')) {
            answer += `HR Headcount statistics: There are currently ${employees.length} employees registered in our HR database systems.`;
          } else {
            answer += `Mock reply to: "${userMsg}". How can I help you with ERP, announcements, or workflow requests?`;
          }
        }
        setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 180px)',
      padding: '1.5rem',
      gap: '1rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>AI Copilot Workspace</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Connected to Qwen Model via FastAPI</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              gap: '0.75rem',
              alignItems: 'start'
            }}>
              {!isUser && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-glass)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={16} />
                </div>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isUser ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                border: isUser ? 'none' : '1px solid var(--border-color)',
                color: 'white',
                fontSize: '0.92rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-line',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div>{msg.content}</div>
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => downloadMsgAsPdf(msg.content, index)}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(0, 255, 100, 0.3)',
                      backgroundColor: 'rgba(0, 255, 100, 0.05)',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginTop: '0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 100, 0.05)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download PDF Report
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} className="animate-spin" />
            </div>
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about inventory stock status, PO summaries, or draft a memo..."
          required
        />
        <button type="submit" className="btn btn-primary">
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}

// --- 7. WORKFLOW APPROVALS ---
function WorkflowApprovalsView({ workflows, setWorkflows, isBackendOnline, fetchBackendData }: any) {
  const [commentsMap, setCommentsMap] = useState<{[key: number]: string}>({});

  const handleAction = async (id: number, status: 'Approved' | 'Rejected') => {
    const reason = (commentsMap[id] || '').trim();
    if (status === 'Rejected' && !reason) {
      alert("Action Blocked: A reason for rejection is mandatory. Please enter the reason in the comment field.");
      return;
    }

    const finalComment = reason || (status === 'Approved' ? 'Approved by supervisor.' : 'Rejected by supervisor.');

    if (isBackendOnline) {
      try {
        const res = await fetch(`${BACKEND_URL}/workflows/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, comments: finalComment })
        });
        if (res.ok) {
          setCommentsMap(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          fetchBackendData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock Local Update
      setWorkflows(workflows.map((wf: any) => {
        if (wf.id === id) {
          return { ...wf, status, comments: finalComment };
        }
        return wf;
      }));
    }
    alert(`Workflow task marked as ${status}.`);
  };

  const pending = workflows.filter((w: any) => w.status === 'Pending');
  const completed = workflows.filter((w: any) => w.status !== 'Pending');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Workflow & Request Approvals</h2>

      {/* Pending approvals */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Pending Actions
          <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--warning-glass)', color: 'var(--warning)', padding: '0.1rem 0.5rem', borderRadius: 99 }}>{pending.length} new</span>
        </h3>

        {pending.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All approvals are completed. No pending tasks!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pending.map((wf: any) => (
              <div key={wf.id} style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1', minWidth: '280px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{wf.type}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>{wf.title}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{wf.description}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Requested by {wf.requestedBy} on {wf.requestedDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Enter approval note / REJECTION reason (Mandatory)..."
                    value={commentsMap[wf.id] || ''}
                    onChange={(e) => setCommentsMap({ ...commentsMap, [wf.id]: e.target.value })}
                    style={{
                      padding: '0.5rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      width: '320px',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" onClick={() => handleAction(wf.id, 'Approved')} style={{ backgroundColor: 'var(--success-glass)', color: 'var(--success)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      <Check size={16} /> Approve
                    </button>
                    <button className="btn" onClick={() => handleAction(wf.id, 'Rejected')} style={{ backgroundColor: 'var(--danger-glass)', color: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed approvals */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Approval Audit Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Task Detail</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Requested By</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((wf: any) => (
              <tr key={wf.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--primary)' }}>{wf.type}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{wf.title}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{wf.requestedBy}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{wf.requestedDate}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span className={`badge badge-${wf.status.toLowerCase()}`}>{wf.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 8. ERP ACCESS ---
function ERPAccessView({ inventory, purchaseOrders, salesOrders }: any) {
  const activePOs = purchaseOrders.filter((p: any) => p.status === 'Pending').length;
  const activeSOs = salesOrders.filter((s: any) => s.status === 'Pending').length;
  
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ERP / MES Integration Center</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Inventory Module card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Package size={32} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Material & Inventory (MES)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time stock control, fabric raw material weights, and barcode locator tracking.</p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>Total Skus: <strong>{inventory.length}</strong></span>
            <span style={{ color: 'var(--warning)' }}>Reorder levels: <strong>{inventory.filter((i: any) => i.isLowStock).length}</strong></span>
          </div>
        </div>

        {/* Procurement module */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <FileText size={32} style={{ color: 'var(--success)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Procurement (Purchase Orders)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automate supplier agreements, vendor lead times, raw component purchases, and budget limits.</p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>Synced POs: <strong>{purchaseOrders.length}</strong></span>
            <span>Awaiting Approval: <strong style={{ color: 'var(--warning)' }}>{activePOs}</strong></span>
          </div>
        </div>

        {/* Finance sales */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <TrendingUp size={32} style={{ color: '#ec4899' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Finance & Sales (SO)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sales invoice generations, ledger allocations, payment tracking, and customer balance reviews.</p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>Synced SOs: <strong>{salesOrders.length}</strong></span>
            <span>Unbilled: <strong style={{ color: 'var(--warning)' }}>{activeSOs}</strong></span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active ERP Gateway Status</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { system: 'SAP ERP Financials Gateway', status: 'Connected', ping: '12ms' },
            { system: 'Production MES Floor Scheduler', status: 'Connected', ping: '4ms' },
            { system: 'Workday HR Employee Database Sync', status: 'Connected', ping: '24ms' },
            { system: 'Legacy Warehouse WMS API', status: 'Maintenance', ping: 'Down' }
          ].map((gateway, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.01)'
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{gateway.system}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ping: {gateway.ping}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 99,
                  backgroundColor: gateway.status === 'Connected' ? 'var(--success-glass)' : 'var(--warning-glass)',
                  color: gateway.status === 'Connected' ? 'var(--success)' : 'var(--warning)'
                }}>{gateway.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 8.5 ECHARTS REPORTS WIDGET ---
function EChartsReportsWidget({ purchaseOrders, salesOrders, inventory }: any) {
  const [selectedLayer, setSelectedLayer] = useState('profit');
  const chartRef = useRef<HTMLDivElement>(null);
  const echartsInstanceRef = useRef<any>(null);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!echartsInstanceRef.current) {
      echartsInstanceRef.current = echarts.init(chartRef.current, 'dark');
    }

    // Dynamic Font & Plot Sizing based on current container width
    const scaleFactor = Math.max(0.6, Math.min(2.0, width / 600));
    const titleSize = Math.max(12, Math.min(26, Math.round(15 * scaleFactor)));
    const labelSize = Math.max(9, Math.min(18, Math.round(11 * scaleFactor)));
    const legendSize = Math.max(9, Math.min(16, Math.round(11 * scaleFactor)));
    const lineWidth = Math.max(2, Math.min(6, Math.round(3 * scaleFactor)));
    const symbolSize = Math.max(4, Math.min(12, Math.round(6 * scaleFactor)));

    const textStyle = {
      color: '#cbd5e1',
      fontFamily: 'system-ui, sans-serif',
      fontSize: labelSize
    };

    const baseGrid = {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    };

    // Calculate aggregated datasets
    const salesByDate = salesOrders.reduce((acc: any, so: any) => {
      acc[so.date] = (acc[so.date] || 0) + so.totalAmount;
      return acc;
    }, {});

    const purchaseByDate = purchaseOrders.reduce((acc: any, po: any) => {
      acc[po.date] = (acc[po.date] || 0) + po.totalAmount;
      return acc;
    }, {});

    // Sort unique dates chronologically
    const allDates = Array.from(new Set([...Object.keys(salesByDate), ...Object.keys(purchaseByDate)]))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let options: any = {};

    if (selectedLayer === 'profit') {
      const revenueData = allDates.map(date => salesByDate[date] || 0);
      const expenseData = allDates.map(date => purchaseByDate[date] || 0);
      const profitData = allDates.map(date => (salesByDate[date] || 0) - (purchaseByDate[date] || 0));

      options = {
        title: {
          text: 'Ecosystem Profit & Cash Flow Margins',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: titleSize }
        },
        backgroundColor: 'transparent',
        tooltip: { 
          trigger: 'axis',
          textStyle: { fontSize: labelSize }
        },
        legend: {
          data: ['Sales Revenue', 'Purchase Expense', 'Net Profit Margin'],
          bottom: '0%',
          textStyle: { color: '#cbd5e1', fontSize: legendSize }
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: allDates.length > 0 ? allDates : ['No Data'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Sales Revenue',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            lineStyle: { width: lineWidth },
            data: revenueData,
            itemStyle: { color: '#10b981' }
          },
          {
            name: 'Purchase Expense',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            lineStyle: { width: lineWidth },
            data: expenseData,
            itemStyle: { color: '#f43f5e' }
          },
          {
            name: 'Net Profit Margin',
            type: 'bar',
            data: profitData,
            itemStyle: {
              color: (params: any) => params.value >= 0 ? '#0ea5e9' : '#f59e0b'
            }
          }
        ]
      };
    } else if (selectedLayer === 'sales_orders') {
      const revenueData = allDates.map(date => salesByDate[date] || 0);
      options = {
        title: {
          text: 'Sales Revenue Growth Trend',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: titleSize }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', textStyle: { fontSize: labelSize } },
        legend: { data: ['Revenue ($)'], bottom: '0%', textStyle: { color: '#cbd5e1', fontSize: legendSize } },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: allDates.length > 0 ? allDates : ['No Data'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Revenue ($)',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            lineStyle: { width: lineWidth },
            data: revenueData,
            itemStyle: { color: '#10b981' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0)' }
              ])
            }
          }
        ]
      };
    } else if (selectedLayer === 'purchase_orders') {
      const expenseData = allDates.map(date => purchaseByDate[date] || 0);
      options = {
        title: {
          text: 'Purchase Expense Distribution Flow',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: titleSize }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', textStyle: { fontSize: labelSize } },
        legend: { data: ['Expenses ($)'], bottom: '0%', textStyle: { color: '#cbd5e1', fontSize: legendSize } },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: allDates.length > 0 ? allDates : ['No Data'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Expenses ($)',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            lineStyle: { width: lineWidth },
            data: expenseData,
            itemStyle: { color: '#f43f5e' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(244, 63, 94, 0.4)' },
                { offset: 1, color: 'rgba(244, 63, 94, 0)' }
              ])
            }
          }
        ]
      };
    } else if (selectedLayer === 'inventory') {
      const categoryMap = inventory.reduce((acc: any, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity;
        return acc;
      }, {});

      const categories = Object.keys(categoryMap);
      const quantities = categories.map(cat => categoryMap[cat]);

      options = {
        title: {
          text: 'Inventory Quantity Distribution by Category',
          left: 'center',
          textStyle: { color: '#f8fafc', fontSize: titleSize }
        },
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontSize: labelSize } },
        legend: { data: ['Stock Qty'], bottom: '0%', textStyle: { color: '#cbd5e1', fontSize: legendSize } },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: categories.length > 0 ? categories : ['No Data'],
          axisLabel: { textStyle: textStyle }
        },
        yAxis: {
          type: 'value',
          axisLabel: { textStyle: textStyle },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
        },
        series: [
          {
            name: 'Stock Qty',
            type: 'bar',
            data: quantities,
            itemStyle: { color: '#a855f7' }
          }
        ]
      };
    }

    echartsInstanceRef.current.setOption(options);
    echartsInstanceRef.current.resize();
  }, [selectedLayer, width]);

  useEffect(() => {
    if (!chartRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(chartRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select Dataset Layer:</span>
        <select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          <option value="profit">1. Operations Profit Analysis</option>
          <option value="sales_orders">2. Sales Orders Revenue Trends</option>
          <option value="purchase_orders">3. Purchase Orders Expenses</option>
          <option value="inventory">4. Warehouse Inventory Levels</option>
        </select>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '240px' }} />
    </div>
  );
}

// --- 8.6 COMPANY LOCATIONS WIDGET (INTERACTIVE MAP) ---
function CompanyLocationsWidget() {
  const chartRef = useRef<HTMLDivElement>(null);
  const echartsInstanceRef = useRef<any>(null);
  const [activeDetails, setActiveDetails] = useState<any>({
    isRoute: false,
    name: 'Taipei Headquarters (大傑總部)',
    type: 'Corporate Office',
    address: 'No. 8, Sec. 5, Xinyi Rd, Taipei City',
    employees: 42,
    shipments: 18,
    metrics: 'Main administration, order planning, design office & retail network hub.'
  });

  const locations = [
    { id: 'taipei', name: 'Taipei HQ', type: 'Corporate Office', coords: [75, 18], employees: 42, shipments: 18, metrics: 'Main administration, order planning, design office & retail network hub.', address: 'No. 8, Sec. 5, Xinyi Rd, Taipei City' },
    { id: 'taichung', name: 'Taichung Logistics', type: 'Distribution Hub', coords: [50, 44], employees: 25, shipments: 34, metrics: 'Central storage, sorting facility, order packing & regional courier dispatch.', address: 'No. 120, Sec. 3, Taiwan Blvd, Taichung City' },
    { id: 'tainan', name: 'Tainan Spinning Mill', type: 'Production Plant', coords: [34, 68], employees: 85, shipments: 12, metrics: 'Raw yarn spinning, loom weaving, quality checking & fabrication floor.', address: 'No. 55, Zhongzheng Rd, Yongkang Dist, Tainan City' },
    { id: 'kaohsiung', name: 'Kaohsiung Port', type: 'Seaport Warehousing', coords: [30, 82], employees: 14, shipments: 45, metrics: 'Import raw material customs clearance, export container shipping logs.', address: 'No. 3, Qianzhen Rd, Kaohsiung City' }
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    if (!echartsInstanceRef.current) {
      echartsInstanceRef.current = echarts.init(chartRef.current, 'dark');
    }

    const taiwanSvgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path
        name="Taiwan Main Island"
        d="M 70 8 C 73 9, 78 12, 79 16 C 81 22, 75 25, 71 30 C 67 35, 62 42, 60 49 C 58 55, 57 60, 52 68 C 48 74, 45 81, 38 88 C 32 94, 25 98, 20 95 C 16 93, 18 86, 21 82 C 24 76, 29 70, 31 63 C 33 55, 36 48, 41 40 C 45 32, 50 25, 55 18 C 60 12, 65 8, 70 8 Z"
        fill="rgba(14, 165, 233, 0.03)"
        stroke="rgba(14, 165, 233, 0.2)"
        stroke-width="0.8"
      />
      <circle cx="12" cy="72" r="1.2" fill="rgba(14, 165, 233, 0.08)" stroke="rgba(14, 165, 233, 0.2)" stroke-width="0.3" />
    </svg>
    `;

    echarts.registerMap('taiwan_svg', { svg: taiwanSvgString });

    const options = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesType === 'lines') {
            return `<b>Supply Route</b><br/>${params.data.fromName} ➔ ${params.data.toName}<br/>Cargo: ${params.data.cargo}<br/>Rate: ${params.data.value} shipments/day`;
          }
          return `<b>${params.name}</b><br/>Staff: ${params.value[2]} active`;
        }
      },
      geo: {
        map: 'taiwan_svg',
        roam: false,
        layoutCenter: ['50%', '50%'],
        layoutSize: '95%',
        itemStyle: {
          areaColor: 'transparent',
          borderColor: 'transparent'
        }
      },
      series: [
        // Pulsing line trails representing cargo flow (geo-graph style)
        {
          name: 'Supply Chain Routes',
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 1,
          effect: {
            show: true,
            period: 4,
            trailLength: 0.6,
            color: '#38bdf8',
            symbolSize: 4,
            symbol: 'arrow'
          },
          lineStyle: {
            color: 'rgba(14, 165, 233, 0.35)',
            width: 2,
            curveness: 0.25
          },
          data: [
            { coords: [[34, 68], [50, 44]], fromName: 'Tainan Spinning Mill', toName: 'Taichung Logistics', cargo: 'Organic Yarn Spools', value: 12 },
            { coords: [[50, 44], [75, 18]], fromName: 'Taichung Logistics', toName: 'Taipei HQ', cargo: 'Finished Retail Garments', value: 18 },
            { coords: [[30, 82], [34, 68]], fromName: 'Kaohsiung Port', toName: 'Tainan Spinning Mill', cargo: 'Imported Cotton Fiber bales', value: 8 },
            { coords: [[50, 44], [30, 82]], fromName: 'Taichung Logistics', toName: 'Kaohsiung Port', cargo: 'Export Shipments (Air & Sea freight)', value: 15 }
          ]
        },
        // Static nodes representing facilities
        {
          name: 'Facilities',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: 12,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#94a3b8',
            fontSize: 10,
            fontWeight: 500
          },
          itemStyle: {
            color: '#0ea5e9',
            shadowBlur: 8,
            shadowColor: '#0ea5e9'
          },
          data: locations.map(l => ({
            name: l.name,
            value: [...l.coords, l.employees]
          }))
        }
      ]
    };

    echartsInstanceRef.current.setOption(options);

    // Click handler to update the detail side card
    echartsInstanceRef.current.on('click', (params: any) => {
      if (params.seriesType === 'lines') {
        const routeData = params.data;
        setActiveDetails({
          isRoute: true,
          name: `${routeData.fromName} ➔ ${routeData.toName}`,
          cargo: routeData.cargo,
          frequency: routeData.value,
          metrics: `Automated transit flow monitoring raw output. Cargo: ${routeData.cargo}. Average frequency is ${routeData.value} runs/day.`
        });
      } else {
        const matched = locations.find(l => l.name === params.name);
        if (matched) {
          setActiveDetails({
            isRoute: false,
            name: matched.name,
            type: matched.type,
            address: matched.address,
            employees: matched.employees,
            shipments: matched.shipments,
            metrics: matched.metrics
          });
        }
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      echartsInstanceRef.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', width: '100%', height: '100%', minHeight: '300px', padding: '0.5rem' }}>
      {/* ECharts Map Canvas */}
      <div style={{
        flex: '1 1 280px',
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: '280px'
      }}>
        <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '280px' }} />
      </div>

      {/* Info Panel */}
      <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--text-color)', margin: 0 }}>
          🗺️ Logistics Transit Index
        </h4>
        
        {activeDetails ? (
          <div className="animate-fade-in" style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeDetails.isRoute ? (
              // Route detail display
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-color)', fontSize: '0.9rem' }}>{activeDetails.name}</span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(16,185,129,0.2)' }}>Transit Flow</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}><strong>Transit Cargo:</strong> {activeDetails.cargo}</p>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.5rem', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Daily Freight Frequency</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{activeDetails.frequency} shipments / day</div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{activeDetails.metrics}</p>
              </>
            ) : (
              // Facility detail display
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-color)', fontSize: '0.95rem' }}>{activeDetails.name}</span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(14,165,233,0.15)', color: '#38bdf8', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(14,165,233,0.2)' }}>{activeDetails.type}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}><strong>Address:</strong> {activeDetails.address}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.15rem' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: 'var(--radius-xs)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Staff Count</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-color)' }}>{activeDetails.employees} active</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: 'var(--radius-xs)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Logistics Actions</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>{activeDetails.shipments} runs</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{activeDetails.metrics}</p>
              </>
            )}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
            Click on any coordinate node or flowing supply chain arrow on the map to display logistics telemetry, route volumes, or staff allocations.
          </div>
        )}
      </div>
    </div>
  );
}

// --- 9. REPORTS & ANALYTICS ---
function ReportsAnalyticsView({ purchaseOrders, salesOrders, inventory }: any) {
  // Aggregate sales orders totals grouped by date
  const salesGroupMap = salesOrders.reduce((acc: any, so: any) => {
    acc[so.date] = (acc[so.date] || 0) + so.totalAmount;
    return acc;
  }, {});
  const salesGroupedData = Object.keys(salesGroupMap).map(date => ({
    date,
    Amount: salesGroupMap[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate purchase orders totals grouped by date
  const purchaseGroupMap = purchaseOrders.reduce((acc: any, po: any) => {
    acc[po.date] = (acc[po.date] || 0) + po.totalAmount;
    return acc;
  }, {});
  const purchaseGroupedData = Object.keys(purchaseGroupMap).map(date => ({
    date,
    Amount: purchaseGroupMap[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate inventory category quantities
  const inventoryGroupMap = inventory.reduce((acc: any, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});

  const inventoryPieData = Object.keys(inventoryGroupMap).map(category => ({
    name: category,
    value: inventoryGroupMap[category]
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#a855f7', '#f59e0b'];

  // State to manage list order, sizes and collapse states dynamically
  const [widgets, setWidgets] = useState([
    { id: 'sales_trend', title: 'Sales Orders Revenue Analysis', type: 'recharts_sales', size: 'medium', isCollapsed: false },
    { id: 'purchases_trend', title: 'Purchase Orders Expense Analysis', type: 'recharts_purchases', size: 'medium', isCollapsed: false },
    { id: 'inventory_distribution', title: 'Inventory Distribution (Stock Qty)', type: 'recharts_inventory', size: 'medium', isCollapsed: false },
    { id: 'company_locations_map', title: 'Company Locations & Logistics Infrastructure Map', type: 'company_locations', size: 'medium', isCollapsed: false },
    { id: 'interactive_echarts', title: 'Ecosystem Profit & Operations Analyzer (ECharts)', type: 'echarts_profit', size: 'large', isCollapsed: false }
  ]);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newWidgets = [...widgets];
    const draggedWidget = newWidgets[draggedIndex];
    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);
    setWidgets(newWidgets);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handler to toggle widget size (large/full-width vs medium/half-width)
  const toggleSize = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets[index].size = newWidgets[index].size === 'large' ? 'medium' : 'large';
    setWidgets(newWidgets);
  };

  // Handler to toggle widget collapse height
  const toggleCollapse = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets[index].isCollapsed = !newWidgets[index].isCollapsed;
    setWidgets(newWidgets);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reports & Operational Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Fully interactive layout: drag cards by their headers to swap positions, and drag their bottom-right corners to resize them freely!
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          🔄 Drag-to-Swap & Corner Resizing Enabled
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {widgets.map((widget, index) => {
          const isLarge = widget.size === 'large';
          const isDragged = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <div
              key={widget.id}
              className="glass-panel"
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                padding: '1.5rem',
                gridColumn: isLarge ? 'span 2' : 'span 1',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: widget.isCollapsed ? 'auto' : (isLarge ? '380px' : '350px'),
                border: isDragOver 
                  ? '2px dashed var(--primary)' 
                  : (isDragged ? '2px dotted rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)'),
                opacity: isDragged ? 0.4 : 1,
                backgroundColor: isDragOver ? 'rgba(14, 165, 233, 0.05)' : '',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
                
                // Native Corner Resizing
                resize: widget.isCollapsed ? 'none' : 'both',
                overflow: 'hidden',
                minWidth: '280px',
                maxWidth: '100%'
              }}
            >
              {/* Widget Header (Draggable Handle) */}
              <div 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: widget.isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.05)', 
                  paddingBottom: widget.isCollapsed ? '0' : '0.75rem',
                  cursor: 'grab'
                }}
                title="Drag here to move this card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab', opacity: 0.7 }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-color)', margin: 0 }}>
                    {widget.title}
                  </h3>
                </div>
                
                {/* Control Panel Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                  {/* Maximize/Minimize (Toggle size span) */}
                  <button
                    onClick={() => toggleSize(index)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: 'var(--text-color)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={isLarge ? "Minimize Grid Size (Half Width)" : "Maximize Grid Size (Full Width)"}
                  >
                    {isLarge ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  {/* Collapse/Expand toggle */}
                  <button
                    onClick={() => toggleCollapse(index)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: 'var(--text-color)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={widget.isCollapsed ? "Expand Content" : "Collapse Content"}
                  >
                    {widget.isCollapsed ? <Plus size={16} /> : <Minus size={16} />}
                  </button>
                </div>
              </div>

              {/* Widget Body Content */}
              {!widget.isCollapsed && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', overflow: 'hidden' }}>
                  
                  {/* Sales Orders Bar Chart */}
                  {widget.type === 'recharts_sales' && (
                    <ResponsiveContainer width="100%" height="95%">
                      <AreaChart data={salesGroupedData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#181920', borderColor: 'var(--border-color)' }} />
                        <Area type="monotone" dataKey="Amount" stroke="var(--success)" fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {/* Purchase Orders Area Chart */}
                  {widget.type === 'recharts_purchases' && (
                    <ResponsiveContainer width="100%" height="95%">
                      <AreaChart data={purchaseGroupedData}>
                        <defs>
                          <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#181920', borderColor: 'var(--border-color)' }} />
                        <Area type="monotone" dataKey="Amount" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPurchases)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {/* Stock distribution Pie */}
                  {widget.type === 'recharts_inventory' && (
                    <ResponsiveContainer width="100%" height="95%">
                      <PieChart>
                        <Pie
                          data={inventoryPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {inventoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#181920', borderColor: 'var(--border-color)' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}

                  {/* Company Locations Map */}
                  {widget.type === 'company_locations' && (
                    <CompanyLocationsWidget />
                  )}

                  {/* ECharts selector widget */}
                  {widget.type === 'echarts_profit' && (
                    <EChartsReportsWidget purchaseOrders={purchaseOrders} salesOrders={salesOrders} inventory={inventory} />
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- 10. USER PROFILE ---
function UserProfileView({ userProfile, setUserProfile }: any) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [department, setDepartment] = useState(userProfile.department);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name,
      email,
      department,
      avatarUrl
    });
    alert('Profile information saved locally.');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <img
            src={avatarUrl}
            alt="Avatar larger"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', padding: 4 }}
          />
          <label 
            htmlFor="profile-image-upload" 
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              backgroundColor: 'var(--primary)', 
              color: '#000', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              border: '2px solid var(--border-color)', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)',
              fontSize: '0.9rem'
            }}
            title="Upload Photo"
          >
            📷
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === 'string') {
                    setAvatarUrl(reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{userProfile.name}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{userProfile.role} - {userProfile.department}</span>
        </div>
        <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>Email: <strong style={{ color: 'white' }}>{userProfile.email}</strong></span>
          <span>Access Level: <strong style={{ color: 'white' }}>Write / Approver</strong></span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Account and Settings</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Work Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department</label>
            <input
              type="text"
              className="form-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

// --- 11. INVENTORY VIEW ---
function InventoryView({ inventory }: any) {
  return (
    <div className="animate-fade-in glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>MES ERP Inventory Ledger</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.75rem 0.5rem' }}>Code</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Item Description</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Balance</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Unit</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Unit Price ($)</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item: any) => (
            <tr key={item.id} style={{
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: item.isLowStock ? 'rgba(245, 158, 11, 0.05)' : ''
            }}>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{item.code}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                {item.name}
                {item.isLowStock && (
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--warning-glass)', color: 'var(--warning)', padding: '2px 6px', borderRadius: 4, marginLeft: '0.5rem', fontWeight: 700 }}>
                    LOW STOCK
                  </span>
                )}
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{item.category}</td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: item.isLowStock ? 'var(--warning)' : '' }}>{item.quantity}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{item.unit}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>${item.price}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <span className="badge badge-approved" style={{ color: 'var(--success)', backgroundColor: 'var(--success-glass)' }}>Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 12. PURCHASE ORDERS VIEW ---
function PurchaseOrdersView({ purchaseOrders }: any) {
  return (
    <div className="animate-fade-in glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>Synced Purchase Orders (Procurement)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.75rem 0.5rem' }}>PO Number</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Supplier/Vendor</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Total Amount ($)</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((po: any) => (
            <tr key={po.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{po.orderNumber}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{po.customerOrVendor}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{po.date}</td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>${po.totalAmount.toLocaleString()}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <span className={`badge badge-${po.status.toLowerCase()}`}>{po.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 13. SALES ORDERS VIEW ---
function SalesOrdersView({ salesOrders }: any) {
  return (
    <div className="animate-fade-in glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>Synced Sales Orders (Finance Ledger)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.75rem 0.5rem' }}>SO Number</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Customer / Client</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Total Amount ($)</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {salesOrders.map((so: any) => (
            <tr key={so.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{so.orderNumber}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{so.customerOrVendor}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{so.date}</td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>${so.totalAmount.toLocaleString()}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <span className={`badge badge-${so.status.toLowerCase()}`}>{so.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 14. WORKFLOWS CONFIG ---
function WorkflowsConfigView() {
  const workflowDefinitions = [
    { id: 'WF-1', name: 'Leave Approval Protocol', description: 'Requires approval from HR Director Vance if leave spans more than 5 days, else Line Manager approval.', step: '2-step validation' },
    { id: 'WF-2', name: 'Procurement Capex Approval', description: 'Purchase Orders over $15,000 are forwarded to Finance Director Sarah Jenkins. Under $15,000 resolved by line manager.', step: '3-step budget check' },
    { id: 'WF-3', name: 'New Vendor Onboarding Policy', description: 'Mandates compliance review by Legal Desk, then MES systems synchronization.', step: '1-step contract check' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Defined Enterprise Workflows</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {workflowDefinitions.map((definition) => (
          <div key={definition.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{definition.name}</h3>
              <span className="badge badge-approved" style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-glass)' }}>{definition.step}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{definition.description}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>Workflow ID: {definition.id}</span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>Status: Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 15. DOCUMENT AI ---
function DocumentAIView({ isAiOnline, documents, setDocuments, isBackendOnline, userProfile }: any) {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [docContentText, setDocContentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!docContentText.trim()) return;
    setLoading(true);

    if (isAiOnline) {
      try {
        const formData = new FormData();
        formData.append('text', docContentText);

        const res = await fetch(AI_URL + '/document-ai', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const result = await res.json();
          setSelectedDoc(result);

          // Save parsed document details to document center
          const savedDocPayload = {
            name: `AI_Extracted_Report_${Date.now() % 1000}.pdf`,
            path: '/documents/extracted.pdf',
            uploadedBy: userProfile.name,
            ocrSummary: result.summary || 'Summary could not be extracted.',
            keyEntities: Array.isArray(result.key_entities) ? result.key_entities.join(', ') : String(result.key_entities || ''),
            actionItems: Array.isArray(result.action_items) ? result.action_items.join(', ') : String(result.action_items || '')
          };

          const saveRes = await fetch(BACKEND_URL + '/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedDocPayload)
          });
          if (saveRes.ok) {
            const savedDoc = await saveRes.json();
            setDocuments((prev: any) => [savedDoc, ...prev]);
          }
        }
      } catch (err) {
        console.error(err);
        alert('AI Service failed to summarize. Falling back to local offline mock.');
        mockLocalExtract();
      }
    } else {
      mockLocalExtract();
    }
    setLoading(false);
  };

  const mockLocalExtract = () => {
    setSelectedDoc({
      summary: `Parsed local document. The text indicates procurement of cotton yarn and synthetic blends. Estimated total cost value stands at $8,450.`,
      key_entities: ['Dah Je Co LTD', 'Cotton Yarn', '$8,450', '2026-07-09'],
      action_items: ['Approve payment voucher', 'Forward to warehouse receiving clerk', 'Check inventory safety bounds']
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Upload and Input */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>OCR Document Parsing (FastAPI Document AI)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Paste invoice texts, shipping slip data, or employee memos to trigger automated entity extraction and summaries via AI.</p>
        <textarea
          className="form-input"
          rows={10}
          placeholder="Paste raw invoice text or shipping logs here..."
          value={docContentText}
          onChange={(e) => setDocContentText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleExtract} disabled={loading} style={{ justifyContent: 'center' }}>
          {loading ? 'AI Extracting...' : 'Extract Entities & Summary'}
        </button>
      </div>

      {/* Extracted results */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Extraction Results</h3>
        {selectedDoc ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Summary:</strong>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>{selectedDoc.summary}</p>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Key Entities Identified:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedDoc.key_entities?.map((ent: string, idx: number) => (
                  <span key={idx} style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px'
                  }}>{ent}</span>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>Recommended Action Items:</strong>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedDoc.action_items?.map((act: string, idx: number) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            Submit raw text in the left panel to review extracted details.
          </div>
        )}
      </div>
    </div>
  );
}

// --- 16. KNOWLEDGE BASE ---
function KnowledgeBaseView({ knowledgeBase, setKnowledgeBase, isBackendOnline, isAiOnline }: any) {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Policies');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      title,
      content,
      category,
      author: 'Kalle Chakradhar',
      views: 0
    };

    if (isBackendOnline) {
      try {
        const res = await fetch(BACKEND_URL + '/knowledge-base', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newArt = await res.json();
          setKnowledgeBase([...knowledgeBase, newArt]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const newArt = {
        id: Date.now(),
        ...payload
      };
      setKnowledgeBase([...knowledgeBase, newArt]);
    }

    setTitle('');
    setContent('');
    alert('Knowledge article created.');
  };

  const handleSummary = async (text: string) => {
    setAiLoading(true);
    setAiSummary('');
    if (isAiOnline) {
      try {
        const res = await fetch(AI_URL + '/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Summarize this policy in 2 sentences:\n\n${text}`
          })
        });
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data.response);
        }
      } catch {
        setAiSummary('Failed to connect to AI summary service.');
      }
    } else {
      setTimeout(() => {
        setAiSummary('Offline Mode: This policy explains employee guidelines, compliance records, and approval requirements.');
      }, 800);
    }
    setAiLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Sidebar List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Articles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {knowledgeBase.map((art: any) => (
              <button
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art);
                  setAiSummary('');
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: selectedArticle?.id === art.id ? 'var(--primary-glass)' : 'transparent',
                  color: selectedArticle?.id === art.id ? 'var(--primary)' : 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500
                }}
              >
                {art.title}
              </button>
            ))}
          </div>
        </div>

        {/* Create article */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Add Article</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', background: '#1f2029' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Policies">Policies</option>
              <option value="Guides">Guides</option>
              <option value="IT FAQ">IT FAQ</option>
            </select>
            <textarea
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              rows={3}
              placeholder="Content text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', justifyContent: 'center' }}>
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Reader Panel */}
      <div className="glass-panel" style={{ padding: '2rem', minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        {selectedArticle ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedArticle.title}</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category: {selectedArticle.category} | Author: {selectedArticle.author}</span>
              </div>
              <button
                className="btn"
                onClick={() => handleSummary(selectedArticle.content)}
                style={{ backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Get AI Summary
              </button>
            </div>

            {aiLoading && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Summarizing policy...</div>}
            {aiSummary && (
              <div style={{
                backgroundColor: 'var(--primary-glass)',
                border: '1px solid rgba(14,165,233,0.3)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}>
                <strong>AI Summary:</strong> {aiSummary}
              </div>
            )}

            <p style={{ fontSize: '0.98rem', lineHeight: '1.7', whiteSpace: 'pre-line', color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {selectedArticle.content}
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select an article from the left sidebar to start reading.
          </div>
        )}
      </div>
    </div>
  );
}

// --- 17. ERP INTEGRATION ---
function ERPIntegrationView({ isBackendOnline }: any) {
  const [syncLogs, setSyncLogs] = useState<any[]>([
    { id: 1, system: 'MES Production', time: '16:05:12', status: 'Success', itemsSynced: 30 },
    { id: 2, system: 'SAP Financials', time: '16:00:00', status: 'Success', itemsSynced: 71 },
    { id: 3, system: 'Workday HR DB', time: '15:30:10', status: 'Success', itemsSynced: 3 },
    { id: 4, system: 'Legacy Warehouse WMS', time: '15:00:00', status: 'Failed', itemsSynced: 0 }
  ]);
  const [syncing, setSyncing] = useState(false);

  const triggerSync = async () => {
    setSyncing(true);
    if (isBackendOnline) {
      try {
        const res = await fetch(BACKEND_URL + '/erp/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          const newLog = {
            id: Date.now(),
            system: 'ERPNext Cloud Gateway',
            time: new Date().toLocaleTimeString(),
            status: 'Success',
            itemsSynced: 30
          };
          setSyncLogs(prev => [newLog, ...prev]);
          alert('ERPNext Sync completed successfully!');
        } else {
          const newLog = {
            id: Date.now(),
            system: 'ERPNext Cloud Gateway',
            time: new Date().toLocaleTimeString(),
            status: 'Failed',
            itemsSynced: 0,
            reason: data.reason || 'Forbidden (403)'
          };
          setSyncLogs(prev => [newLog, ...prev]);
          alert(`ERPNext Sync failed: ${data.reason || 'Forbidden (403)'}. Running in local database fallback mode.`);
        }
      } catch (err: any) {
        const newLog = {
          id: Date.now(),
          system: 'ERPNext Cloud Gateway',
          time: new Date().toLocaleTimeString(),
          status: 'Failed',
          itemsSynced: 0,
          reason: err.message
        };
        setSyncLogs(prev => [newLog, ...prev]);
        alert(`ERPNext Connection Error: ${err.message}`);
      }
    } else {
      // Mock Offline Sync
      setTimeout(() => {
        const newLog = {
          id: Date.now(),
          system: 'ERPNext Cloud Sync (Mock)',
          time: new Date().toLocaleTimeString(),
          status: 'Success',
          itemsSynced: 104
        };
        setSyncLogs(prev => [newLog, ...prev]);
        alert('Database sync successful (running locally).');
      }, 1000);
    }
    setSyncing(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ERP Database Sync Control</h2>
        <button className="btn btn-primary" onClick={triggerSync} disabled={syncing}>
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? 'Syncing...' : 'Sync Database Now'}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Database Synchronization Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>System</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {syncLogs.map((log: any) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{log.system}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{log.time}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span className={`badge badge-${log.status === 'Success' ? 'approved' : 'rejected'}`}>{log.status}</span>
                </td>
                <td style={{ padding: '0.75rem 0.5rem', color: log.status === 'Failed' ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {log.status === 'Success' ? `${log.itemsSynced} records` : log.reason || 'Insufficient Permission (403)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- 18. REAL DATA (INSPECTOR) ---
function RealDataView({
  announcements,
  leaves,
  workflows,
  inventory,
  purchaseOrders,
  salesOrders,
  knowledgeBase,
  documents,
  employees
}: any) {
  const [selectedDB, setSelectedDB] = useState('inventory');

  const getActiveDB = () => {
    switch (selectedDB) {
      case 'announcements': return announcements;
      case 'leaves': return leaves;
      case 'workflows': return workflows;
      case 'inventory': return inventory;
      case 'purchaseOrders': return purchaseOrders;
      case 'salesOrders': return salesOrders;
      case 'knowledgeBase': return knowledgeBase;
      case 'documents': return documents;
      case 'employees': return employees;
      default: return [];
    }
  };

  const renderDBTable = () => {
    const data = getActiveDB();
    if (!data || data.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          No records found in this table.
        </div>
      );
    }

    const tableHeaderStyle: React.CSSProperties = {
      padding: '0.75rem 1rem',
      borderBottom: '2px solid var(--border-color)',
      color: 'var(--text-muted)',
      fontWeight: 600,
      textAlign: 'left',
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    };

    const tableCellStyle: React.CSSProperties = {
      padding: '1rem',
      borderBottom: '1px solid var(--border-color)',
      fontSize: '0.85rem',
      color: 'var(--text-light)',
      verticalAlign: 'middle'
    };

    const getStatusBadge = (status: string) => {
      const normalized = (status || '').toLowerCase();
      let bg = 'rgba(234, 179, 8, 0.15)'; // Yellow for pending/WIP
      let color = '#eab308';
      
      if (normalized === 'approved' || normalized === 'active' || normalized === 'success') {
        bg = 'rgba(34, 197, 94, 0.15)';
        color = '#22c55e';
      } else if (normalized === 'failed' || normalized === 'rejected' || normalized === 'low stock') {
        bg = 'rgba(239, 68, 68, 0.15)';
        color = '#ef4848';
      }

      return (
        <span style={{
          padding: '0.25rem 0.6rem',
          borderRadius: '50px',
          backgroundColor: bg,
          color: color,
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'inline-block',
          textAlign: 'center'
        }}>
          {status}
        </span>
      );
    };

    switch (selectedDB) {
      case 'inventory':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Code</th>
                  <th style={tableHeaderStyle}>Product Name</th>
                  <th style={tableHeaderStyle}>Category</th>
                  <th style={tableHeaderStyle}>Stock Level</th>
                  <th style={tableHeaderStyle}>Price</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 600, color: 'var(--primary)' }}>{item.code}</td>
                    <td style={tableCellStyle}>{item.name}</td>
                    <td style={tableCellStyle}>{item.category}</td>
                    <td style={tableCellStyle}>
                      <span style={{ fontWeight: 600, color: item.isLowStock ? '#ef4848' : 'var(--text-light)' }}>
                        {item.quantity}
                      </span>{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>${item.price.toFixed(2)}</td>
                    <td style={tableCellStyle}>{getStatusBadge(item.isLowStock ? 'Low Stock' : item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'purchaseOrders':
      case 'salesOrders':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Order #</th>
                  <th style={tableHeaderStyle}>{selectedDB === 'purchaseOrders' ? 'Vendor' : 'Customer'}</th>
                  <th style={tableHeaderStyle}>Date</th>
                  <th style={tableHeaderStyle}>Total Amount</th>
                  <th style={tableHeaderStyle}>Items Details</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order: any) => {
                  let itemsText = order.itemDetails;
                  try {
                    const itemsObj = JSON.parse(order.itemDetails);
                    if (Array.isArray(itemsObj)) {
                      itemsText = itemsObj.map((i: any) => `${i.item || i.name} (Qty: ${i.qty || i.quantity})`).join(', ');
                    }
                  } catch (e) {}

                  return (
                    <tr key={order.id}>
                      <td style={{ ...tableCellStyle, fontWeight: 600, color: 'var(--primary)' }}>{order.orderNumber}</td>
                      <td style={tableCellStyle}>{order.customerOrVendor}</td>
                      <td style={tableCellStyle}>{order.date}</td>
                      <td style={{ ...tableCellStyle, fontWeight: 600 }}>${order.totalAmount.toLocaleString()}</td>
                      <td style={{ ...tableCellStyle, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{itemsText}</td>
                      <td style={tableCellStyle}>{getStatusBadge(order.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'workflows':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Workflow Title</th>
                  <th style={tableHeaderStyle}>Requested By</th>
                  <th style={tableHeaderStyle}>Date</th>
                  <th style={tableHeaderStyle}>Description / Reference</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((wf: any) => (
                  <tr key={wf.id}>
                    <td style={tableCellStyle}><span className="category-badge" style={{ backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{wf.type}</span></td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{wf.title}</td>
                    <td style={tableCellStyle}>{wf.requestedBy}</td>
                    <td style={tableCellStyle}>{wf.requestedDate}</td>
                    <td style={{ ...tableCellStyle, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wf.description}</td>
                    <td style={tableCellStyle}>{getStatusBadge(wf.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'leaves':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Employee</th>
                  <th style={tableHeaderStyle}>Leave Type</th>
                  <th style={tableHeaderStyle}>Duration</th>
                  <th style={tableHeaderStyle}>Reason</th>
                  <th style={tableHeaderStyle}>Comments</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lv: any) => (
                  <tr key={lv.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{lv.employeeName}</td>
                    <td style={tableCellStyle}>{lv.type}</td>
                    <td style={tableCellStyle}>{lv.startDate} to {lv.endDate}</td>
                    <td style={tableCellStyle}>{lv.reason}</td>
                    <td style={{ ...tableCellStyle, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lv.comments || '—'}</td>
                    <td style={tableCellStyle}>{getStatusBadge(lv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'announcements':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font-sans)' }}>
            {data.map((ann: any) => (
              <div key={ann.id} className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{ann.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', marginBottom: '0.75rem' }}>{ann.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                  <span>Posted by: <strong>{ann.author}</strong></span>
                  <span className="category-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-light)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{ann.category}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'knowledgeBase':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            {data.map((art: any) => (
              <div key={art.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="category-badge" style={{ backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{art.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Views: <strong>{art.views}</strong></span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>{art.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{art.content}</p>
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Author: <strong>{art.author}</strong>
                </div>
              </div>
            ))}
          </div>
        );

      case 'documents':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            {data.map((doc: any) => (
              <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>{doc.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded: {doc.uploadDate} by {doc.uploadedBy}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <div><strong>OCR Summary:</strong> <span style={{ color: 'var(--text-muted)' }}>{doc.ocrSummary}</span></div>
                  <div><strong>Key Entities:</strong> <span style={{ backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{doc.keyEntities}</span></div>
                  {doc.actionItems && <div><strong>Action Items:</strong> <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{doc.actionItems}</span></div>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'employees':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Employee Name</th>
                  <th style={tableHeaderStyle}>Position</th>
                  <th style={tableHeaderStyle}>Department</th>
                  <th style={tableHeaderStyle}>Salary</th>
                  <th style={tableHeaderStyle}>Manager</th>
                  <th style={tableHeaderStyle}>Absences</th>
                  <th style={tableHeaderStyle}>Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {data.map((emp: any) => (
                  <tr key={emp.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 600, color: 'var(--primary)' }}>{emp.empId}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{emp.employeeName}</td>
                    <td style={tableCellStyle}>{emp.position}</td>
                    <td style={tableCellStyle}>{emp.department}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>${emp.salary.toLocaleString()}</td>
                    <td style={tableCellStyle}>{emp.managerName}</td>
                    <td style={tableCellStyle}>{emp.absences}</td>
                    <td style={tableCellStyle}>{getStatusBadge(emp.performanceScore)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <pre style={{ color: '#10b981' }}>{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Table Selector */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>Database Tables</h3>
        {[
          { id: 'inventory', label: 'MES Inventory' },
          { id: 'purchaseOrders', label: 'Purchase Orders' },
          { id: 'salesOrders', label: 'Sales Orders' },
          { id: 'workflows', label: 'Workflows & Approvals' },
          { id: 'leaves', label: 'HR Leaves' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'knowledgeBase', label: 'Knowledge Base' },
          { id: 'documents', label: 'Documents & OCR Metadata' },
          { id: 'employees', label: 'Employee Records (Kaggle)' }
        ].map(tbl => (
          <button
            key={tbl.id}
            onClick={() => setSelectedDB(tbl.id)}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: selectedDB === tbl.id ? 'var(--primary-glass)' : 'transparent',
              color: selectedDB === tbl.id ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: selectedDB === tbl.id ? 600 : 500
            }}
          >
            {tbl.label}
          </button>
        ))}
      </div>

      {/* Table Records Inspector */}
      <div className="glass-panel" style={{ padding: '2rem', minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Database Inspector: {selectedDB.toUpperCase()}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Records: {getActiveDB().length}</span>
        </h2>
        <div style={{ flex: 1, overflow: 'auto', maxHeight: '550px' }}>
          {renderDBTable()}
        </div>
      </div>
    </div>
  );
}
