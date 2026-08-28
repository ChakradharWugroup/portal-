import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    "{lang === 'en' ? 'Employee Portal Login' : 'Unlimited'}": "{lang === 'en' ? 'Employee Portal Login' : (lang === 'zh-CN' ? '员工门户登录' : '員工門戶登入')}",
    "{lang === 'en' ? 'Username / Email' : 'Unlimited'}": "{lang === 'en' ? 'Username / Email' : (lang === 'zh-CN' ? '用户名 / 邮箱' : '用戶名 / 郵箱')}",
    "{lang === 'en' ? 'Password' : 'Unlimited'}": "{lang === 'en' ? 'Password' : (lang === 'zh-CN' ? '密码' : '密碼')}",
    "{lang === 'en' ? 'Sign In' : 'Unlimited'}": "{lang === 'en' ? 'Sign In' : (lang === 'zh-CN' ? '登录' : '登入')}",
    "{lang === 'en' ? 'Demo Login Credentials:' : 'Unlimited'}": "{lang === 'en' ? 'Demo Login Credentials:' : (lang === 'zh-CN' ? '演示登录凭证:' : '測試登入資訊:')}",
    "{lang === 'en' ? 'System Notifications' : 'Unlimited'}": "{lang === 'en' ? 'System Notifications' : (lang === 'zh-CN' ? '系统通知' : '系統通知')}",
    "{lang === 'en' ? 'Pending' : 'Unlimited'}": "{lang === 'en' ? 'Pending' : (lang === 'zh-CN' ? '待办' : '待辦')}",
    "{lang === 'en' ? 'No pending approval actions' : 'Unlimited'}": "{lang === 'en' ? 'No pending approval actions' : (lang === 'zh-CN' ? '没有待处理的审批操作' : '沒有待處理的審批操作')}",
    "{lang === 'en' ? 'Matching Pages' : 'Unlimited'}": "{lang === 'en' ? 'Matching Pages' : (lang === 'zh-CN' ? '相符页面' : '相符頁面')}",
    "{lang === 'en' ? 'No results found' : 'Unlimited'}": "{lang === 'en' ? 'No results found' : (lang === 'zh-CN' ? '未找到结果' : '未找到結果')}",
    "({limit === 'Unlimited' ? 'Unlimited' : `${limit}d`})": "({limit === 'Unlimited' ? (typeof lang !== 'undefined' ? (lang === 'zh-CN' ? '无限制' : '無限制') : 'Unlimited') : `${limit}d`})",
    "setLoginError(lang === 'en' ? 'Invalid username or password' : 'Unlimited');": "setLoginError(lang === 'en' ? 'Invalid username or password' : (lang === 'zh-CN' ? '无效的用户名或密码' : '無效的使用者名稱或密碼'));"
}

for k, v in reps.items():
    content = content.replace(k, v)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
