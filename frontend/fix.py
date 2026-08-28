import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    "Dah Je Co LTD (????) ??Smart Enterprise AI Platform": "Dah Je Co LTD (達智企業) - Smart Enterprise AI Platform",
    "{lang === 'en' ? 'System Notifications' : '???'}": "{lang === 'en' ? 'System Notifications' : (lang === 'zh-CN' ? '系统通知' : '系統通知')}",
    "{lang === 'en' ? 'Pending' : '???'}": "{lang === 'en' ? 'Pending' : (lang === 'zh-CN' ? '待办' : '待辦')}",
    "{lang === 'en' ? 'No pending approval actions' : '?????????'}": "{lang === 'en' ? 'No pending approval actions' : (lang === 'zh-CN' ? '没有待处理的审批操作' : '沒有待處理的審批操作')}",
    "??Back to Dashboard": "← Back to Dashboard",
    "({limit === 'Unlimited' ? '??' : `${limit}d`})": "({limit === 'Unlimited' ? (lang === 'zh-CN' ? '无限制' : '無限制') : `${limit}d`})"
}

for k, v in reps.items():
    content = content.replace(k, v)

# Fix the AI Copilot responses
# Just revert the AI copilot text blocks that were destroyed to English so they don't look like garbage.
content = re.sub(
    r"const greeting = lang === 'zh-TW'.*?;",
    "const greeting = 'Hello! I am your Smart Enterprise Portal AI Copilot. I can fetch live ERP metrics, search employee lists, draft emails, review HR counts, or search knowledge articles. How can I help you today?';",
    content,
    flags=re.DOTALL
)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
