interface BotonProps {
  texto: string;
  onClick: () => void;
}

export function Boton({ texto, onClick }: BotonProps) {
  return (
    <button type="button" className="boton" onClick={onClick}>
      {texto}
    </button>
  );
}
