import time
import requests
import pytest


@pytest.fixture(scope="session")
def base_url():
    candidates = ["http://localhost:8002", "http://localhost:8000"]
    url = None
    # Wait for service to be ready (max 30s)
    timeout = time.time() + 30
    while time.time() < timeout:
        for candidate in candidates:
            try:
                # Use /projects/ as a basic readiness check because the Task service doesn't expose a dedicated /health endpoint.
                r = requests.get(f"{candidate}/projects/", timeout=1)
                if r.status_code in (200, 204):
                    return candidate
            except (requests.exceptions.ConnectionError, requests.exceptions.ReadTimeout):
                continue
        time.sleep(0.5)
    raise RuntimeError("Task service did not respond on any candidate URLs: %s" % ", ".join(candidates))


@pytest.fixture
def requests_session():
    s = requests.Session()
    yield s
    s.close()
