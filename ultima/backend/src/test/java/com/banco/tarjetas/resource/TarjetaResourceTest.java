package com.banco.tarjetas.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;

@QuarkusTest
class TarjetaResourceTest {

    @Test
    void givenPeticion_whenListar_thenOkConCuatroTarjetas() {
        given().when().get("/api/v1/tarjetas")
                .then().statusCode(200).body("$", hasSize(4));
    }

    @Test
    void givenFiltroBloqueada_whenListar_thenUnaTarjeta() {
        given().queryParam("estado", "BLOQUEADA").when().get("/api/v1/tarjetas")
                .then().statusCode(200).body("$", hasSize(1)).body("[0].id", equalTo("tc-003"));
    }

    @Test
    void givenEstadoInvalido_whenListar_thenProblemJson400() {
        given().queryParam("estado", "zzz").when().get("/api/v1/tarjetas")
                .then().statusCode(400)
                .contentType(containsString("application/problem+json"))
                .body("status", equalTo(400));
    }

    @Test
    void givenIdExistente_whenObtener_thenOk() {
        given().when().get("/api/v1/tarjetas/td-002")
                .then().statusCode(200).body("marca", equalTo("MASTERCARD"));
    }

    @Test
    void givenIdInexistente_whenObtener_thenProblemJson404() {
        given().when().get("/api/v1/tarjetas/tc-999")
                .then().statusCode(404)
                .contentType(containsString("application/problem+json"));
    }
}
