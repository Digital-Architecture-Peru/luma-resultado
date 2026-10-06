"""Pruebas unitarias de configuración por variables de entorno."""

from app.core.config import Settings


def test_settings_given_no_base_url_defaults_to_fake_gateway(monkeypatch) -> None:
    monkeypatch.delenv("PAYMENT_GATEWAY_BASE_URL", raising=False)

    settings = Settings(_env_file=None)

    assert settings.use_fake_gateway is True
    assert settings.payment_gateway_base_url is None


def test_settings_given_environment_variables_reads_them(monkeypatch) -> None:
    monkeypatch.setenv("PAYMENT_GATEWAY_BASE_URL", "https://gateway.example.test")
    monkeypatch.setenv("PAYMENT_GATEWAY_API_KEY", "test-key")
    monkeypatch.setenv("USE_FAKE_GATEWAY", "false")

    settings = Settings(_env_file=None)

    assert settings.payment_gateway_base_url == "https://gateway.example.test"
    assert settings.payment_gateway_api_key == "test-key"
    assert settings.use_fake_gateway is False
