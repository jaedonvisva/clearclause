# Dockerfile for Flask Backend

# 1. Base Image: Use the official Python image
FROM python:3.9-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of the backend source code
COPY . .

# 5. Expose the port the app runs on
EXPOSE 5001

# 6. Command to run the application using Gunicorn
# We bind to 0.0.0.0 to allow traffic from outside the container.
# We increase the timeout to handle potentially long-running LLM requests.
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "300", "main:app"]
