# -*- coding: utf-8 -*-
with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find the BACKEND_URL definition
old_url = r"const BACKEND_URL = \(window\.location\.hostname\.includes\('loca\.lt'\) \|\| window\.location\.protocol === 'https:'\) && \!window\.location\.hostname\.includes\('localhost'\) \? 'https://weak-goats-write\.loca\.lt/api' : 'http://' \+ \(window\.location\.hostname \|\| 'localhost'\) \+ ':8005/api';"
new_url = "const BACKEND_URL = '/api';"
content = re.sub(old_url, new_url, content)

# Remove the debug alerts I added earlier so it doesn't annoy the user
content = content.replace("alert(\"MSAL Login Success! Welcome \" + msalUser.username);", "console.log(\"MSAL Login Success!\");")
content = content.replace("alert('Initiating Microsoft Login...');", "")
# keep the other alerts just in case

with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
