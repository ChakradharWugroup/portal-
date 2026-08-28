# -*- coding: utf-8 -*-
with open('C:/Users/KalleChakradhar/Desktop/meeting_AI_report/meeting-ai-enterprise/backend/api/fastapi.py', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Disable Gemini Summarization and just dump the raw transcript
old_summary_block = """        update_status("Step 4/4: AI Summarization (Gemini)...")
        print(f"Transcription complete. Total length: {len(full_transcript_text)}")
        
        summary = full_transcript_text
        try:
            import httpx
            print("Calling Gemini 1.5 Flash for summarization...")
            prompt = f"Please summarize the following video/meeting transcript. Provide a structured markdown report with 'Main Topics', 'Speaker Insights', and 'Action Items'.\\n\\nTranscript:\\n{full_transcript_text[:100000]}"
            gemini_key = "YOUR_GEMINI_API_KEY_HERE"
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={gemini_key}"
            res = httpx.post(gemini_url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60.0)
            if res.status_code == 200:
                summary = res.json()["candidates"][0]["content"]["parts"][0]["text"]
            else:
                print(f"Gemini API returned status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"Gemini summarization failed: {e}")"""

new_summary_block = """        update_status("Step 4/4: AI Summarization (Disabled)...")
        print(f"Transcription complete. Total length: {len(full_transcript_text)}")
        print("AI Summarization is disabled per user request. Outputting raw transcript.")
        summary = full_transcript_text"""

content = content.replace(old_summary_block, new_summary_block)

with open('C:/Users/KalleChakradhar/Desktop/meeting_AI_report/meeting-ai-enterprise/backend/api/fastapi.py', 'w', encoding='utf-8') as f:
    f.write(content)
