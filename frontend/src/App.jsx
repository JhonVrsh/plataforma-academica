import { useCallback, useEffect, useRef, useState } from 'react';
import {
  actualizarCalificacion,
  crearCalificacion,
  eliminarCalificacion,
  listarCalificaciones,
  obtenerCalificacion,
} from './api/calificacionesApi';
import Alerta from './components/Alerta';
import ConfirmarEliminacion from './components/ConfirmarEliminacion';
import ConsultaPorId from './components/ConsultaPorId';
import FormularioCalificacion from './components/FormularioCalificacion';
import Modal from './components/Modal';
import TablaCalificaciones from './components/TablaCalificaciones';
import TarjetasResumen from './components/TarjetasResumen';
import { formatoNota } from './utils/validaciones';

const TEXTO_ESTADO_API = {
  conectando: 'Conectando…',
  conectada: 'API conectada',
  error: 'API sin conexión',
};

export default function App() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [formulario, setFormulario] = useState(null); // { calificacion: null } crea, { calificacion } edita
  const [aEliminar, setAEliminar] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [idResaltado, setIdResaltado] = useState(null);
  const temporizadorResaltado = useRef(null);

  // GET /api/calificaciones: la tabla siempre muestra lo que hay en la base de datos.
  const cargarCalificaciones = useCallback(async () => {
    setCargando(true);
    try {
      const { datos } = await listarCalificaciones();
      setCalificaciones(datos);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCalificaciones();
    return () => clearTimeout(temporizadorResaltado.current);
  }, [cargarCalificaciones]);

  const cerrarAlerta = useCallback(() => setAlerta(null), []);
  const mostrarExito = (status, mensaje) => setAlerta({ tipo: 'exito', status, mensaje, id: Date.now() });
  const mostrarError = (error) =>
    setAlerta({ tipo: 'error', status: error.status, mensaje: error.message, detalles: error.detalles, id: Date.now() });

  function resaltar(id) {
    clearTimeout(temporizadorResaltado.current);
    setIdResaltado(id);
    temporizadorResaltado.current = setTimeout(() => setIdResaltado(null), 3000);
  }

  // POST (crear) o PUT (actualizar) según el modo del formulario.
  async function guardar(payload) {
    const editando = formulario.calificacion;
    setProcesando(true);
    try {
      const { status, datos } = editando
        ? await actualizarCalificacion(editando.id, payload)
        : await crearCalificacion(payload);

      mostrarExito(
        status,
        editando
          ? `Calificación #${datos.id} actualizada: promedio ${formatoNota(datos.promedio)} (${datos.estado}).`
          : `Calificación de ${datos.estudiante} en ${datos.curso} registrada con el ID #${datos.id}.`,
      );
      if (detalle?.id === datos.id) setDetalle(datos);
      setFormulario(null);
      resaltar(datos.id);
      await cargarCalificaciones();
    } catch (error) {
      mostrarError(error);
      // Si el registro ya no existe, se cierra el formulario y se refresca la tabla.
      if (error.status === 404) {
        setFormulario(null);
        await cargarCalificaciones();
      }
    } finally {
      setProcesando(false);
    }
  }

  // DELETE /api/calificaciones/:id (después de la confirmación).
  async function eliminar() {
    const calificacion = aEliminar;
    setProcesando(true);
    try {
      const { status } = await eliminarCalificacion(calificacion.id);
      mostrarExito(status, `Calificación #${calificacion.id} de ${calificacion.estudiante} eliminada.`);
      if (detalle?.id === calificacion.id) setDetalle(null);
    } catch (error) {
      mostrarError(error);
    } finally {
      setProcesando(false);
      setAEliminar(null);
      await cargarCalificaciones();
    }
  }

  // GET /api/calificaciones/:id
  async function consultar(id) {
    try {
      const { status, datos } = await obtenerCalificacion(id);
      setDetalle(datos);
      mostrarExito(status, `Se encontró la calificación #${datos.id}.`);
    } catch (error) {
      setDetalle(null);
      mostrarError(error);
    }
  }

  const cerrarFormulario = useCallback(() => {
    if (!procesando) setFormulario(null);
  }, [procesando]);

  const cerrarConfirmacion = useCallback(() => {
    if (!procesando) setAEliminar(null);
  }, [procesando]);

  let estadoApi = 'conectada';
  if (errorCarga) estadoApi = 'error';
  else if (cargando && calificaciones.length === 0) estadoApi = 'conectando';

  function renderizarContenido() {
    if (cargando && calificaciones.length === 0 && !errorCarga) {
      return <p className="estado">Cargando calificaciones…</p>;
    }
    if (errorCarga) {
      return (
        <div className="estado estado--error" role="alert">
          <p><strong>No se pudieron cargar las calificaciones.</strong></p>
          <p>{errorCarga.message}</p>
          <button type="button" className="boton boton--secundario" onClick={cargarCalificaciones}>
            Reintentar
          </button>
        </div>
      );
    }
    if (calificaciones.length === 0) {
      return (
        <div className="estado">
          <p>No hay calificaciones registradas.</p>
          <p className="texto-tenue">Usa el botón «Nueva calificación» para crear la primera.</p>
        </div>
      );
    }
    return (
      <TablaCalificaciones
        calificaciones={calificaciones}
        idResaltado={idResaltado}
        onEditar={(calificacion) => setFormulario({ calificacion })}
        onEliminar={setAEliminar}
      />
    );
  }

  return (
    <>
      <header className="encabezado">
        <div className="contenedor encabezado__contenido">
          <div>
            <h1>Plataforma Académica</h1>
            <p className="encabezado__subtitulo">Gestión de calificaciones · Ingeniería de Software III</p>
          </div>
          <span className={`estado-api estado-api--${estadoApi}`}>{TEXTO_ESTADO_API[estadoApi]}</span>
        </div>
      </header>

      <main className="contenedor principal">
        <TarjetasResumen calificaciones={calificaciones} />

        <section className="panel" aria-labelledby="titulo-calificaciones">
          <div className="panel__barra">
            <div>
              <h2 id="titulo-calificaciones">Calificaciones registradas</h2>
              <p className="texto-tenue panel__ayuda">
                Datos servidos por <code>GET /api/calificaciones</code>
                {cargando && calificaciones.length > 0 && ' · actualizando…'}
              </p>
            </div>
            <div className="panel__acciones">
              <ConsultaPorId onConsultar={consultar} />
              <button type="button" className="boton boton--secundario" onClick={cargarCalificaciones} disabled={cargando}>
                Recargar
              </button>
              <button type="button" className="boton boton--primario" onClick={() => setFormulario({ calificacion: null })}>
                + Nueva calificación
              </button>
            </div>
          </div>

          {detalle && (
            <article className="detalle" aria-label={`Detalle de la calificación ${detalle.id}`}>
              <div className="detalle__encabezado">
                <h3>Calificación #{detalle.id}</h3>
                <button type="button" className="modal__cerrar" onClick={() => setDetalle(null)} aria-label="Cerrar detalle">×</button>
              </div>
              <dl className="detalle__datos">
                <div><dt>Estudiante</dt><dd>{detalle.estudiante}</dd></div>
                <div><dt>Curso</dt><dd>{detalle.curso}</dd></div>
                <div>
                  <dt>Cortes</dt>
                  <dd>{formatoNota(detalle.corte1)} · {formatoNota(detalle.corte2)} · {formatoNota(detalle.corte3)}</dd>
                </div>
                <div>
                  <dt>Promedio</dt>
                  <dd>
                    {formatoNota(detalle.promedio)}{' '}
                    <span className={`insignia insignia--${detalle.estado.toLowerCase()}`}>{detalle.estado}</span>
                  </dd>
                </div>
                <div><dt>Registrada</dt><dd>{detalle.creado_en}</dd></div>
              </dl>
            </article>
          )}

          {renderizarContenido()}
        </section>
      </main>

      <footer className="pie">
        <p>Plataforma Académica Básica · Frontend React + Vite conectado a la API Express + SQLite</p>
      </footer>

      {formulario && (
        <Modal
          titulo={formulario.calificacion ? `Editar calificación #${formulario.calificacion.id}` : 'Nueva calificación'}
          onCerrar={cerrarFormulario}
        >
          <FormularioCalificacion
            calificacion={formulario.calificacion}
            procesando={procesando}
            onGuardar={guardar}
            onCancelar={cerrarFormulario}
          />
        </Modal>
      )}

      {aEliminar && (
        <Modal titulo="Eliminar calificación" onCerrar={cerrarConfirmacion}>
          <ConfirmarEliminacion
            calificacion={aEliminar}
            procesando={procesando}
            onConfirmar={eliminar}
            onCancelar={cerrarConfirmacion}
          />
        </Modal>
      )}

      <Alerta key={alerta?.id} alerta={alerta} onCerrar={cerrarAlerta} />
    </>
  );
}
