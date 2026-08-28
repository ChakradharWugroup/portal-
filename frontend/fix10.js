const fs = require('fs');
let content = fs.readFileSync('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'utf8');

content = content.replace(
  "{ id: 'nextchat', label: 'NextChat (Dify)', desc: 'Enterprise AI NextChat Gateway', icon: Bot, color: '#f59e0b' }",
  "{ id: 'nextchat', label: 'NextChat (Dify)', desc: lang === 'en' ? 'Enterprise AI NextChat Gateway' : (lang === 'zh-CN' ? '企业级AI NextChat网关' : '企業級AI NextChat網關'), icon: Bot, color: '#f59e0b' }"
);

content = content.replace(
  "{ id: 'meeting-ai', label: 'Meeting AI', desc: 'Transcriber and Meeting Summarization', icon: Megaphone, color: '#10b981' }",
  "{ id: 'meeting-ai', label: lang === 'en' ? 'Meeting AI' : '會議 AI', desc: lang === 'en' ? 'Transcriber and Meeting Summarization' : (lang === 'zh-CN' ? '语音转写与会议摘要' : '語音轉寫與會議摘要'), icon: Megaphone, color: '#10b981' }"
);

content = content.replace(
  "{ id: 'rvc-studio', label: 'RVC Studio', desc: 'Retrieval-based Voice Conversion AI', icon: Megaphone, color: '#a855f7' }",
  "{ id: 'rvc-studio', label: 'RVC Studio', desc: lang === 'en' ? 'Retrieval-based Voice Conversion AI' : (lang === 'zh-CN' ? '基于检索的语音转换AI' : '基於檢索的語音轉換AI'), icon: Megaphone, color: '#a855f7' }"
);

fs.writeFileSync('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', content, 'utf8');
