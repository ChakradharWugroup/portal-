import re

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src="http://localhost:3001"', 'src={`http://${window.location.hostname}:3001?lang=${lang}`}')
content = content.replace('src="http://localhost:3000"', 'src={`http://${window.location.hostname}:3000?lang=${lang}`}')
content = content.replace('src="http://localhost:3002"', 'src={`http://${window.location.hostname}:3002?lang=${lang}`}')

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
