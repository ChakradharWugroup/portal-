import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the dangling logic block I created
broken_block_pattern = r'if \(lang === \'zh-TW\'\) \{.*?\} else \{\n          answer \+= "I am running in offline mode\.'

fixed_block = '''if (lang === 'zh-TW') {
          answer += "無法連接 Python FastAPI 伺服器，這是本地回應：\\n\\n";
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
          answer += "无法连接 Python FastAPI 服务器，这是本地响应：\\n\\n";
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
        } else {
          answer += "I am running in offline mode.'''

content = re.sub(broken_block_pattern, fixed_block, content, flags=re.DOTALL)

# Fix the language switcher labels
content = content.replace('Traditional Chinese (??)', 'Traditional Chinese (繁體中文)')
content = content.replace('Simplified Chinese (??', 'Simplified Chinese (简体中文)')

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
