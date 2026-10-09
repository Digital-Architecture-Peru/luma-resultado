using Pagos.Application;
using Pagos.Domain;
using Xunit;

namespace Pagos.UnitTests;

public class ConsultarPagosHandlerTests
{
    private static ConsultarPagosHandler Crear(RepositorioEnMemoria repo, params string[] cuentas)
        => new(repo, new ClienteFijo(cuentas), new RelojFijo(Datos.Ahora));

    [Fact]
    public async Task Given_pagos_de_otro_cliente_When_consulta_Then_solo_devuelve_los_propios()
    {
        var repo = new RepositorioEnMemoria(new[]
        {
            Datos.Pago("0012345678", 1),
            Datos.Pago("9999999999", 2)
        });

        var resultado = await Crear(repo, "0012345678").HandleAsync(new ConsultarPagosQuery(null, null, null));

        Assert.Single(resultado.Items);
        Assert.Equal(1, resultado.Total);
    }

    [Fact]
    public async Task Given_cuenta_When_consulta_Then_enmascara_a_ultimos_4_digitos()
    {
        var repo = new RepositorioEnMemoria(new[] { Datos.Pago("0012345678", 1) });

        var resultado = await Crear(repo, "0012345678").HandleAsync(new ConsultarPagosQuery(null, null, null));

        Assert.Equal("****5678", resultado.Items[0].CuentaEnmascarada);
    }

    [Fact]
    public async Task Given_sin_fechas_When_consulta_Then_usa_ultimos_30_dias()
    {
        var repo = new RepositorioEnMemoria(new[]
        {
            Datos.Pago("0012345678", 5),
            Datos.Pago("0012345678", 45)
        });

        var resultado = await Crear(repo, "0012345678").HandleAsync(new ConsultarPagosQuery(null, null, null));

        Assert.Single(resultado.Items);
        Assert.Equal(Datos.Ahora, repo.UltimoFiltro!.Hasta);
        Assert.Equal(Datos.Ahora.AddDays(-30), repo.UltimoFiltro.Desde);
    }

    [Fact]
    public async Task Given_estado_When_consulta_Then_filtra_por_estado_sin_distinguir_mayusculas()
    {
        var repo = new RepositorioEnMemoria(new[]
        {
            Datos.Pago("0012345678", 1, EstadoPago.Rechazado),
            Datos.Pago("0012345678", 2, EstadoPago.Procesado)
        });

        var resultado = await Crear(repo, "0012345678").HandleAsync(new ConsultarPagosQuery(null, null, "rechazado"));

        Assert.Single(resultado.Items);
        Assert.Equal("RECHAZADO", resultado.Items[0].Estado);
    }

    [Fact]
    public async Task Given_tres_pagos_y_size_2_When_pide_pagina_2_Then_devuelve_el_restante_y_total_3()
    {
        var repo = new RepositorioEnMemoria(new[]
        {
            Datos.Pago("0012345678", 1),
            Datos.Pago("0012345678", 2),
            Datos.Pago("0012345678", 3)
        });

        var resultado = await Crear(repo, "0012345678").HandleAsync(new ConsultarPagosQuery(null, null, null, Page: 2, Size: 2));

        Assert.Single(resultado.Items);
        Assert.Equal(3, resultado.Total);
        Assert.Equal(2, resultado.Page);
    }

    [Fact]
    public async Task Given_rango_mayor_a_90_dias_When_consulta_Then_lanza_ConsultaInvalida()
    {
        var repo = new RepositorioEnMemoria(Array.Empty<Pago>());
        var query = new ConsultarPagosQuery(Datos.Ahora.AddDays(-120), Datos.Ahora, null);

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() => Crear(repo, "0012345678").HandleAsync(query));
    }

    [Fact]
    public async Task Given_solo_desde_antiguo_When_consulta_Then_aplica_limite_de_90_dias_contra_hasta_por_defecto()
    {
        var repo = new RepositorioEnMemoria(Array.Empty<Pago>());
        var query = new ConsultarPagosQuery(Datos.Ahora.AddDays(-200), null, null);

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() => Crear(repo, "0012345678").HandleAsync(query));
    }

    [Fact]
    public async Task Given_pago_ajeno_When_obtiene_por_id_Then_devuelve_null()
    {
        var ajeno = Datos.Pago("9999999999", 1);
        var repo = new RepositorioEnMemoria(new[] { ajeno });
        var handler = new ObtenerPagoHandler(repo, new ClienteFijo("0012345678"));

        Assert.Null(await handler.HandleAsync(ajeno.Id));
    }

    [Fact]
    public async Task Given_pago_propio_When_obtiene_por_id_Then_devuelve_dto()
    {
        var propio = Datos.Pago("0012345678", 1);
        var repo = new RepositorioEnMemoria(new[] { propio });
        var handler = new ObtenerPagoHandler(repo, new ClienteFijo("0012345678"));

        var dto = await handler.HandleAsync(propio.Id);

        Assert.NotNull(dto);
        Assert.Equal(propio.Referencia, dto!.Referencia);
    }
}
