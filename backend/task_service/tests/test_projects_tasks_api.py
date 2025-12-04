import uuid
import pytest


def unique_name(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:6]}"


def test_project_crud_flow(base_url, requests_session):
    # Create project
    project_name = unique_name("proj")
    create_resp = requests_session.post(
        f"{base_url}/projects/",
        json={"name": project_name, "description": "Integration test project"},
    )
    assert create_resp.status_code == 201
    project = create_resp.json()
    assert project["name"] == project_name

    project_id = project["id"]

    # Get project by ID
    get_resp = requests_session.get(f"{base_url}/projects/{project_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project_id

    # Update project
    updated_name = project_name + "-updated"
    put_resp = requests_session.put(
        f"{base_url}/projects/{project_id}", json={"name": updated_name}
    )
    assert put_resp.status_code == 200
    assert put_resp.json()["name"] == updated_name

    # Delete project
    del_resp = requests_session.delete(f"{base_url}/projects/{project_id}")
    assert del_resp.status_code in (200, 204)


def test_task_crud_flow(base_url, requests_session):
    # Create project to attach the task to
    project_name = unique_name("proj2")
    pr = requests_session.post(
        f"{base_url}/projects/",
        json={"name": project_name, "description": "Project for tasks"},
    )
    assert pr.status_code == 201
    project_id = pr.json()["id"]

    # Create task
    task_payload = {"title": "Integration Task", "project_id": project_id, "description": "Created by tests"}
    tr = requests_session.post(f"{base_url}/tasks/", json=task_payload)
    assert tr.status_code == 201
    task = tr.json()
    assert task["title"] == task_payload["title"]
    task_id = task["id"]

    # Read task
    gr = requests_session.get(f"{base_url}/tasks/{task_id}")
    assert gr.status_code == 200
    assert gr.json()["id"] == task_id

    # Update task
    ur = requests_session.put(f"{base_url}/tasks/{task_id}", json={"status": "completed", "priority": 2})
    assert ur.status_code == 200
    assert ur.json()["status"] == "completed"

    # Delete task
    dr = requests_session.delete(f"{base_url}/tasks/{task_id}")
    assert dr.status_code in (200, 204)

    # Cleanup project
    requests_session.delete(f"{base_url}/projects/{project_id}")
