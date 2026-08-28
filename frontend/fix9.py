import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("({limit === 'Unlimited' ? (typeof lang !== 'undefined' ? (lang === 'zh-CN' ? '无限制' : '無限制') : 'Unlimited') : `${limit}d`})", "({limit === 'Unlimited' ? 'Unlimited' : `${limit}d`})")

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
