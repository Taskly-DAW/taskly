# Running integration tests for Task Service

These tests exercise the Task Service REST API endpoints. They are integration tests that expect the Task Service to be running and accessible via the service port.

Quick steps to run the tests:

1. Start services (if not already running):

```powershell
docker compose -f taskly/backend/docker-compose.yml up -d task_db task_service
```

2. Run tests inside the running `task_service` container (it will install dev dependencies):

```powershell
docker compose -f taskly/backend/docker-compose.yml exec -T task_service sh -lc "pip install -r /app/requirements-dev.txt && python -m pytest -q /app/tests/"
```

3. Alternatively run tests locally (requires Python + dev dependencies installed locally):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/task_service/requirements.txt
pip install -r backend/task_service/requirements-dev.txt
cd backend/task_service
python -m pytest -q tests/
```

Notes:
- Tests are written to use the running service and will attempt to detect the proper base URL (port 8002 from the host, or port 8000 inside the container).
- These tests use `requests` and rely on the `projects` and `tasks` endpoints for readiness checks.
