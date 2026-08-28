import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    "'??????'": "(lang === 'zh-CN' ? '无效的用户名或密码' : '無效的使用者名稱或密碼')",
    "{lang === 'en' ? 'Matching Pages' : '??????'}": "{lang === 'en' ? 'Matching Pages' : (lang === 'zh-CN' ? '相符页面' : '相符頁面')}",
    "{lang === 'en' ? 'No results found' : '?????'}": "{lang === 'en' ? 'No results found' : (lang === 'zh-CN' ? '未找到结果' : '未找到結果')}",
    "'??'.repeat": "'⭐'.repeat",
    "??\n                        </button>": "Apply\n                        </button>",
    "Dah Je Co LTD (????) - Automated Report": "Dah Je Co LTD (達智企業) - Automated Report",
    "'Traditional Chinese (??)'": "'Traditional Chinese (繁體中文)'",
    "'Simplified Chinese (??'": "'Simplified Chinese (简体中文)'",
    "??Logistics Transit Index": "Logistics Transit Index",
    "?? Drag-to-Swap": "Drag-to-Swap",
    "??${params.data.toName}": "-> ${params.data.toName}",
    "??${routeData.toName}": "-> ${routeData.toName}",
}

for k, v in reps.items():
    content = content.replace(k, v)

# Revert AI Copilot responses that were corrupted
content = re.sub(
    r"if \(lang === 'zh-TW'\) \{.*?\} else if \(lang === 'zh-CN'\) \{.*?\}",
    r"""if (lang === 'zh-TW') {
          answer += "無法連接 Python FastAPI 伺服器，這是本地回應：\n\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock')) {
            answer += `目前 ERP 庫存有 ${inventory.length} 筆資料。`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase')) {
            answer += `目前有 ${purchaseOrders.length} 筆採購單。`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales')) {
            answer += `目前有 ${salesOrders.length} 筆銷售單。`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr')) {
            answer += `目前系統有 ${employees.length} 名員工。`;
          } else {
            answer += `我聽不懂 "${userMsg}"，請詢問庫存、採購、銷售或員工。`;
          }
        } else if (lang === 'zh-CN') {
          answer += "无法连接 Python FastAPI 服务器，这是本地响应：\n\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock')) {
            answer += `目前 ERP 库存有 ${inventory.length} 笔数据。`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase')) {
            answer += `目前有 ${purchaseOrders.length} 笔采购单。`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales')) {
            answer += `目前有 ${salesOrders.length} 笔销售单。`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr')) {
            answer += `目前系统有 ${employees.length} 名员工。`;
          } else {
            answer += `我听不懂 "${userMsg}"，请询问库存、采购、销售或员工。`;
          }
        }""",
    content,
    flags=re.DOTALL
)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
