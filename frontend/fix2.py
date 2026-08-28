import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken AI fallback text
broken_fallback = r"const fallbackText = lang === 'zh-TW'.*?employees\.length} employees\.`;"
fixed_fallback = """const fallbackText = lang === 'zh-TW'
          ? `無法與 Python FastAPI 服務通訊。請確保伺服器運行在 8080 端口且 Gemini API 金鑰已設置。\n\n*本地模擬回應*：總採購單：30，總銷售單：41，庫存：30件，員工總數：${employees.length}人。`
          : lang === 'zh-CN'
          ? `无法与 Python FastAPI 服务通信。请确保服务器运行在 8080 端口且 Gemini API 密钥已设置。\n\n*本地模拟响应*：总采购单：30，总销售单：41，库存：30件，员工总数：${employees.length}人。`
          : `Error communicating with the Python FastAPI AI service. Please make sure the server is running on port 8000 and Gemini API key is configured. \n\n*Local Mock Response*: Total POs: 30, Total SOs: 41, Inventory: 30 items, HR Employee headcount is: ${employees.length} employees.`;"""

content = re.sub(broken_fallback, fixed_fallback, content, flags=re.DOTALL)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
