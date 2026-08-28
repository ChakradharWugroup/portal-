import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    "{ id: 'nextchat', label: 'NextChat (Dify)', desc: 'Enterprise AI NextChat Gateway', icon: Bot, color: '#f59e0b' }": "{ id: 'nextchat', label: 'NextChat (Dify)', desc: lang === 'en' ? 'Enterprise AI NextChat Gateway' : (lang === 'zh-CN' ? '企业级AI NextChat网关' : '企業級AI NextChat網關'), icon: Bot, color: '#f59e0b' }",
    "{ id: 'meeting-ai', label: 'Meeting AI', desc: 'Transcriber and Meeting Summarization', icon: Megaphone, color: '#10b981' }": "{ id: 'meeting-ai', label: lang === 'en' ? 'Meeting AI' : '會議 AI', desc: lang === 'en' ? 'Transcriber and Meeting Summarization' : (lang === 'zh-CN' ? '语音转写与会议摘要' : '語音轉寫與會議摘要'), icon: Megaphone, color: '#10b981' }",
    "{ id: 'rvc-studio', label: 'RVC Studio', desc: 'Retrieval-based Voice Conversion AI', icon: Megaphone, color: '#a855f7' }": "{ id: 'rvc-studio', label: 'RVC Studio', desc: lang === 'en' ? 'Retrieval-based Voice Conversion AI' : (lang === 'zh-CN' ? '基于检索的语音转换AI' : '基於檢索的語音轉換AI'), icon: Megaphone, color: '#a855f7' }"
}

for k, v in reps.items():
    content = content.replace(k, v)

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
