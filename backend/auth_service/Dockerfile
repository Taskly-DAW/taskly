FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Create wait script
RUN echo '#!/bin/bash\n\
set -e\n\
host="$1"\n\
shift\n\
cmd="$@"\n\
\n\
until pg_isready -h "$host" -p 5432 -U taskly_user; do\n\
  echo "Waiting for postgres at $host..."\n\
  sleep 2\n\
done\n\
\n\
echo "PostgreSQL is ready - executing command"\n\
exec $cmd' > /wait-for-postgres.sh && chmod +x /wait-for-postgres.sh

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Wait for postgres and then start the application
CMD ["/wait-for-postgres.sh", "auth_db", "uvicorn", "app.entrypoints.rest:app", "--host", "0.0.0.0", "--port", "8000"]
