# -*- coding: utf-8 -*-
import json
import glob
import os

brains = glob.glob(r'C:\Users\KalleChakradhar\.gemini\antigravity\brain\*\.system_generated\logs\transcript_full.jsonl')

for brain in brains:
    with open(brain, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                content = data.get('content', '')
                if 'useMsal' in content and 'export default App' in content and 'import React' in content:
                    print(f"FOUND in {brain}")
                    # Write it out
                    with open(r'C:\Users\KalleChakradhar\Desktop\portal\recovered_app.tsx', 'w', encoding='utf-8') as out:
                        out.write(content)
                    print("Recovered!")
                    exit(0)
            except:
                pass
print("Not found in any transcript.")
