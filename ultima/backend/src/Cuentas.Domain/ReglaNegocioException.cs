namespace Cuentas.Domain;

/// <summary>Violación de una regla de negocio; el código es estable para el cliente.</summary>
public sealed class ReglaNegocioException : Exception
{
    public ReglaNegocioException(string codigo, string mensaje) : base(mensaje)
    {
        Codigo = codigo;
    }

    public string Codigo { get; }
}
