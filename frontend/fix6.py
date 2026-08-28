import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken AI offline block
broken_block_pattern = r'if \(lang === \'zh-TW\'\) \{.*?\n        \} else \{\n          answer \+= "I am running in offline mode\.'

fixed_block = '''if (lang === 'zh-TW') {
          answer += "Offline Mode: Cannot connect to Python FastAPI.\\n\\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock')) {
            answer += `ERP Inventory has ${inventory.length} items.`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase')) {
            answer += `There are ${purchaseOrders.length} purchase orders.`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales')) {
            answer += `There are ${salesOrders.length} sales orders.`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr')) {
            answer += `The system has ${employees.length} employees.`;
          } else {
            answer += `I did not understand "${userMsg}". Please ask about inventory, purchase, sales, or employees.`;
          }
        } else if (lang === 'zh-CN') {
          answer += "Offline Mode: Cannot connect to Python FastAPI.\\n\\n";
          if (userMsg.toLowerCase().includes('inventory') || userMsg.toLowerCase().includes('stock')) {
            answer += `ERP Inventory has ${inventory.length} items.`;
          } else if (userMsg.toLowerCase().includes('po') || userMsg.toLowerCase().includes('purchase')) {
            answer += `There are ${purchaseOrders.length} purchase orders.`;
          } else if (userMsg.toLowerCase().includes('so') || userMsg.toLowerCase().includes('sales')) {
            answer += `There are ${salesOrders.length} sales orders.`;
          } else if (userMsg.toLowerCase().includes('employee') || userMsg.toLowerCase().includes('hr')) {
            answer += `The system has ${employees.length} employees.`;
          } else {
            answer += `I did not understand "${userMsg}". Please ask about inventory, purchase, sales, or employees.`;
          }
        } else {
          answer += "I am running in offline mode.'''

content = re.sub(broken_block_pattern, lambda _: fixed_block, content, flags=re.DOTALL)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
