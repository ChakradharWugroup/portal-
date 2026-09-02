FROM python:3.10-slim

WORKDIR /app

# Copy requirements if it exists (we will generate a basic one)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django project
COPY . .

# Expose the Django port
EXPOSE 8005

# Run the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8005"]
