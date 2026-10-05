"""Pruebas de API (integración con TestClient) para /accounts."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint_returns_up():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "UP"


def test_list_accounts_requires_owner_id_query_param():
    response = client.get("/api/v1/accounts")
    assert response.status_code == 422  # falta parámetro obligatorio


def test_list_accounts_returns_accounts_for_owner():
    response = client.get("/api/v1/accounts", params={"owner_id": "cust-123"})
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 2
    assert {item["account_id"] for item in body} == {"acc-001", "acc-002"}


def test_list_accounts_returns_empty_list_for_unknown_owner():
    response = client.get("/api/v1/accounts", params={"owner_id": "cust-does-not-exist"})
    assert response.status_code == 200
    assert response.json() == []


def test_get_account_returns_detail_for_existing_account():
    response = client.get("/api/v1/accounts/acc-001")
    assert response.status_code == 200
    body = response.json()
    assert body["account_id"] == "acc-001"
    assert body["owner_id"] == "cust-123"
    assert body["account_type"] == "SAVINGS"


def test_get_account_returns_404_problem_detail_for_unknown_account():
    response = client.get("/api/v1/accounts/acc-unknown")
    assert response.status_code == 404
    body = response.json()
    assert body["status"] == 404
    assert body["title"] == "Cuenta no encontrada"
