import { useEffect } from 'react';

// Ventana modal reutilizable: se cierra con Escape, con la X o haciendo clic fuera del cuadro.
export default function Modal({ titulo, onCerrar, children }) {
  useEffect(() => {
    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alPresionarTecla);
    document.body.classList.add('sin-scroll');
    return () => {
      document.removeEventListener('keydown', alPresionarTecla);
      document.body.classList.remove('sin-scroll');
    };
  }, [onCerrar]);

  return (
    <div
      className="modal-fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <header className="modal__encabezado">
          <h2 id="modal-titulo">{titulo}</h2>
          <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar ventana">×</button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}
