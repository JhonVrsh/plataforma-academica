import { useEffect, useRef, useState } from 'react';
import {
  CORTES,
  calcularPromedio,
  construirPayload,
  construirPayloadSinValidar,
  formatoNota,
  validarCalificacion,
} from '../utils/validaciones';

const CURSOS_SUGERIDOS = ['Ingeniería de Software III', 'Bases de Datos', 'Programación Web'];
const ETIQUETA_CORTE = { corte1: 'Corte 1', corte2: 'Corte 2', corte3: 'Corte 3' };

function valoresIniciales(calificacion) {
  if (!calificacion) return { estudiante: '', curso: '', corte1: '', corte2: '', corte3: '' };
  return {
    estudiante: calificacion.estudiante,
    curso: calificacion.curso,
    ...Object.fromEntries(CORTES.map((campo) => [campo, formatoNota(calificacion[campo])])),
  };
}

function Campo({ id, etiqueta, error, children }) {
  return (
    <div className={`campo${error ? ' campo--error' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error && <span id={`error-${id}`} className="campo__error">{error}</span>}
    </div>
  );
}

// Formulario para crear (POST) o actualizar (PUT) una calificación.
// Valida en el cliente antes de llamar a onGuardar, que es quien hace la petición.
export default function FormularioCalificacion({ calificacion, procesando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => valoresIniciales(calificacion));
  const [errores, setErrores] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [modoPrueba, setModoPrueba] = useState(false);
  const primerCampo = useRef(null);

  useEffect(() => {
    primerCampo.current?.focus();
  }, []);

  function cambiar(evento) {
    const { name, value } = evento.target;
    const nuevos = { ...valores, [name]: value };
    setValores(nuevos);
    // Después del primer intento de envío, los errores se actualizan mientras se escribe.
    if (intentoEnvio) setErrores(validarCalificacion(nuevos));
  }

  function enviar(evento) {
    evento.preventDefault();
    setIntentoEnvio(true);

    if (modoPrueba) {
      setErrores({});
      onGuardar(construirPayloadSinValidar(valores));
      return;
    }

    const encontrados = validarCalificacion(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return; // No se envía la petición.
    onGuardar(construirPayload(valores));
  }

  const atributosError = (campo) => ({
    'aria-invalid': Boolean(errores[campo]),
    'aria-describedby': errores[campo] ? `error-${campo}` : undefined,
  });

  const vistaPrevia = calcularPromedio(valores);
  const hayErrores = Object.keys(errores).length > 0;

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      {hayErrores && (
        <p className="formulario__aviso" role="alert">
          Revisa los campos marcados en rojo. La petición no se envió al servidor.
        </p>
      )}

      <Campo id="estudiante" etiqueta="Estudiante" error={errores.estudiante}>
        <input
          ref={primerCampo}
          id="estudiante"
          name="estudiante"
          type="text"
          value={valores.estudiante}
          onChange={cambiar}
          placeholder="Ej. Jhon Jairo Bernal"
          maxLength={80}
          autoComplete="off"
          {...atributosError('estudiante')}
        />
      </Campo>

      <Campo id="curso" etiqueta="Curso" error={errores.curso}>
        <input
          id="curso"
          name="curso"
          type="text"
          list="cursos-sugeridos"
          value={valores.curso}
          onChange={cambiar}
          placeholder="Ej. Ingeniería de Software III"
          maxLength={80}
          autoComplete="off"
          {...atributosError('curso')}
        />
        <datalist id="cursos-sugeridos">
          {CURSOS_SUGERIDOS.map((curso) => <option key={curso} value={curso} />)}
        </datalist>
      </Campo>

      <div className="formulario__cortes">
        {CORTES.map((campo) => (
          <Campo key={campo} id={campo} etiqueta={ETIQUETA_CORTE[campo]} error={errores[campo]}>
            <input
              id={campo}
              name={campo}
              type="text"
              inputMode="decimal"
              value={valores[campo]}
              onChange={cambiar}
              placeholder="0.0 – 5.0"
              maxLength={4}
              autoComplete="off"
              {...atributosError(campo)}
            />
          </Campo>
        ))}
      </div>

      <p className="formulario__vista-previa">
        Promedio estimado:{' '}
        {vistaPrevia ? (
          <>
            <strong>{formatoNota(vistaPrevia.promedio)}</strong>{' '}
            <span className={`insignia insignia--${vistaPrevia.estado.toLowerCase()}`}>{vistaPrevia.estado}</span>
          </>
        ) : (
          <span className="texto-tenue">completa los tres cortes</span>
        )}
      </p>

      <label className="formulario__modo-prueba">
        <input type="checkbox" checked={modoPrueba} onChange={(e) => setModoPrueba(e.target.checked)} />
        <span>
          Modo prueba: enviar sin validar en el cliente, para ver la respuesta <code>400</code> del servidor.
        </span>
      </label>

      <div className="acciones">
        <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={procesando}>
          Cancelar
        </button>
        <button type="submit" className="boton boton--primario" disabled={procesando}>
          {procesando ? 'Guardando…' : calificacion ? 'Guardar cambios' : 'Crear calificación'}
        </button>
      </div>
    </form>
  );
}
