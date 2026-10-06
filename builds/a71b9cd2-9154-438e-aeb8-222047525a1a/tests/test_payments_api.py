"""Pruebas de API (contrato HTTP) para la consulta de pagos."""

from fastapi.testclient import TestClient


def test_list_payments_given_no_filters_returns_all_fixtures(client: TestClient) -> None:
    response = client.get("/v1/payments")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 5
    assert len(body["items"]) == 5
    assert body["page"] == 1
    assert body["page_size"] == 20


def test_list_payments_given_status_filter_returns_matching_subset(client: TestClient) -> None:
    response = client.get("/v1/payments", params={"status": "completed"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert all(item["status"] == "completed" for item in body["items"])


def test_list_payments_given_page_size_paginates_results(client: TestClient) -> None:
    response = client.get("/v1/payments", params={"page": 1, "page_size": 2})

    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5
    assert body["page_size"] == 2


def test_list_payments_given_invalid_page_size_returns_422(client: TestClient) -> None:
    response = client.get("/v1/payments", params={"page_size": 0})

    assert response.status_code == 422


def test_get_payment_given_existing_id_returns_detail(client: TestClient) -> None:
    response = client.get("/v1/payments/pay_1001")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "pay_1001"
    assert body["status"] == "completed"


def test_get_payment_given_missing_id_returns_problem_json_404(client: TestClient) -> None:
    response = client.get("/v1/payments/does-not-exist")

    assert response.status_code == 404
    body = response.json()
    assert body["title"] == "Payment not found"
    assert body["status"] == 404
    assert "correlationId" in body


def test_health_endpoint_given_no_dependencies_returns_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_ready_endpoint_is_reachable(client: TestClient) -> None:
    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json()["status"] in {"ok", "degraded"}
