import { useState } from 'react';

// Consulta un registro con GET /api/calificaciones/:id (permite ver la respuesta 404 del servidor).
export default function ConsultaPorId({ onConsultar }) {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [consultando, setConsultando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    const texto = id.trim();
    if (!texto) return setError('Escribe un ID.');
    if (!/^\d+$/.test(texto) || Number(texto) <= 0) return setError('El ID debe ser un entero positivo.');

    setError('');
    setConsultando(true);
    await onConsultar(Number(texto));
    setConsultando(false);
  }

  return (
    <form className="consulta" onSubmit={enviar} noValidate>
      <label htmlFor="consulta-id" className="solo-lector">Consultar calificación por ID</label>
      <input
        id="consulta-id"
        type="text"
        inputMode="numeric"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Buscar por ID"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'error-consulta' : undefined}
        autoComplete="off"
      />
      <button type="submit" className="boton boton--secundario" disabled={consultando}>
        {consultando ? 'Consultando…' : 'Consultar'}
      </button>
      {error && <span id="error-consulta" className="campo__error consulta__error">{error}</span>}
    </form>
  );
}
