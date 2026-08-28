# -*- coding: utf-8 -*-
path = 'C:/Users/KalleChakradhar/Desktop/portal/frontend/vite.config.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import react from '@vitejs/plugin-react'", "import react from '@vitejs/plugin-react'\nimport basicSsl from '@vitejs/plugin-basic-ssl'")
content = content.replace("plugins: [react()],", "plugins: [react(), basicSsl()],")
content = content.replace("server: {", "server: {\n    https: true,")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
