FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 libxcb1 libxrender1 libxext6 ffmpeg libzbar0 nodejs npm && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY teams-bot/package.json teams-bot/
RUN cd teams-bot && npm install
RUN cd teams-bot && npx playwright install --with-deps chromium
COPY . .
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

