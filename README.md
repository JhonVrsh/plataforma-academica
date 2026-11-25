# Plataforma Académica Básica

Proyecto del taller **"Gestión colaborativa de un proyecto con Git y GitHub"** de la asignatura
**Ingeniería de Software III** (Semana 3: Control de versiones con Git y GitHub).

Docente: Msc. Ing. Andrés Eduardo Rivera Gómez

## Descripción

La Plataforma Académica Básica es una página web sencilla que muestra la información principal de un
estudiante: sus cursos inscritos, sus calificaciones y los anuncios de la institución.

El objetivo del proyecto **no** es construir una aplicación completa, sino demostrar el flujo de trabajo
colaborativo con Git y GitHub: repositorio, ramas, commits, push, pull request, revisión de código y merge.

## Integrantes

| # | Nombre | Rol en el taller |
|---|--------|------------------|
| 1 | Carlos Acuña | README, estructura HTML inicial y apertura del flujo |
| 2 | Jhonathan Martinez Daza | Estilos del proyecto (`style.css`) |
| 3 | Jhon Jairo Bernal Ortega | Interactividad (`script.js`), pull request y revisión |

## Estructura del proyecto

```
plataforma-academica/
├── README.md     # Información del proyecto e integrantes
├── index.html    # Estructura de la página
├── style.css     # Estilos básicos
└── script.js     # Interactividad (opcional)
```

## Cómo ver el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JhonVrsh/plataforma-academica.git
   cd plataforma-academica
   ```
2. Abrir `index.html` en el navegador.

## Flujo de trabajo

- Rama principal: `main`
- Rama de trabajo: `feature/estructura-inicial`
- Los cambios llegan a `main` únicamente mediante un **pull request** aprobado por otro integrante.

---

## Avance Backend (Sesión 6): API REST por capas

Como parte del avance de **Ingeniería de Software III**, el proyecto incorpora un backend en Node.js
(Express + SQLite) dentro de la carpeta [`backend/`](backend/).

### Entidad elegida: Calificación

La Plataforma Académica muestra a cada estudiante sus cursos y notas. La entidad principal del backend es la
**calificación** de un estudiante en un curso: tres cortes (0.0 a 5.0) a partir de los cuales el servicio calcula
el **promedio** y el **estado** (`APROBADO` si el promedio es mayor o igual a 3.0, `REPROBADO` en caso contrario).

### Arquitectura por capas

```
backend/
├── src/
│   ├── app.js                                  # Express, middlewares y manejo de errores
│   ├── db/database.js                          # Conexión centralizada a SQLite y creación de tablas
│   ├── routes/calificacion.routes.js           # Endpoints expuestos al cliente
│   ├── controllers/calificacion.controller.js  # req/res y códigos de estado HTTP
│   ├── services/calificacion.service.js        # Reglas de negocio y validaciones
│   └── repositories/calificacion.repository.js # Consultas SQL parametrizadas
├── data/app.db                                 # Base de datos local (se crea al iniciar)
├── .env.example                                # Variables de entorno (PORT, DB_FILE)
└── package.json
```

### Configuración y ejecución local

```bash
cd backend
cp .env.example .env
npm install
npm run dev      # o: npm start
```

La API queda disponible en `http://localhost:3000`. La tabla `calificaciones` se crea automáticamente al iniciar.

### Endpoints

| Operación | Método | Endpoint | Respuestas |
|-----------|--------|----------|------------|
| Listar todas | GET | `/api/calificaciones` | 200 |
| Consultar por id | GET | `/api/calificaciones/:id` | 200 / 404 |
| Crear | POST | `/api/calificaciones` | 201 / 400 / 409 |
| Actualizar | PUT | `/api/calificaciones/:id` | 200 / 400 / 404 / 409 |
| Eliminar | DELETE | `/api/calificaciones/:id` | 204 / 404 |

### Evidencias de prueba (cURL)

**1. Camino feliz: creación exitosa (201 Created)**

```bash
curl -i -X POST http://localhost:3000/api/calificaciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Jhon Jairo Bernal","curso":"Ingeniería de Software III","corte1":4.2,"corte2":4.5,"corte3":4.0}'
```

```
HTTP/1.1 201 Created
{"id":1,"estudiante":"Jhon Jairo Bernal","curso":"Ingeniería de Software III","corte1":4.2,"corte2":4.5,"corte3":4,"promedio":4.2,"estado":"APROBADO","creado_en":"2026-10-23 17:30:20"}
```

**2. Error de validación: datos incompletos (400 Bad Request)**

```bash
curl -i -X POST http://localhost:3000/api/calificaciones \
  -H "Content-Type: application/json" \
  -d '{"curso":"Programación Web","corte1":6.5}'
```

```
HTTP/1.1 400 Bad Request
{"error":"Datos de la calificación inválidos","detalles":["estudiante es obligatorio (mínimo 3 caracteres)","corte1 debe estar entre 0.0 y 5.0","corte2 es obligatorio y debe ser numérico","corte3 es obligatorio y debe ser numérico"]}
```

**3. Recurso no encontrado (404 Not Found)**

```bash
curl -i http://localhost:3000/api/calificaciones/999
```

```
HTTP/1.1 404 Not Found
{"error":"No existe la calificación con id 999"}
```

---

## Avance Frontend (Sesión 11): conexión del frontend con la API

Para esta entrega hicimos el frontend de la entidad **Calificación** en React con Vite y lo conectamos con la API
de la entrega anterior. Desde la página se pueden listar, consultar por ID, crear, editar y eliminar calificaciones.
El frontend quedó en la carpeta [`frontend/`](frontend/) y el backend sigue en [`backend/`](backend/). Cada uno
tiene su propio `package.json` y su propio servidor, y solo se comunican por HTTP.

| Proyecto | Tecnología | Puerto |
|----------|------------|--------|
| `backend/` | Node.js + Express + SQLite | 3000 |
| `frontend/` | React + Vite | 5173 |

### Estructura del frontend

```
frontend/
├── index.html
├── vite.config.js              # Configuración de Vite (puerto 5173)
├── .env.example                # URL de la API
└── src/
    ├── main.jsx
    ├── App.jsx                 # Página principal: estado y llamadas a la API
    ├── styles.css
    ├── api/calificacionesApi.js        # Todas las peticiones fetch
    ├── utils/validaciones.js           # Validaciones del formulario
    └── components/
        ├── TarjetasResumen.jsx         # Tarjetas de resumen
        ├── TablaCalificaciones.jsx     # Tabla de registros
        ├── FormularioCalificacion.jsx  # Crear y editar
        ├── ConfirmarEliminacion.jsx    # Confirmar antes de eliminar
        ├── ConsultaPorId.jsx           # Buscar por ID
        ├── Modal.jsx
        └── Alerta.jsx                  # Avisos verde y rojo
```

### CORS

El backend ya usaba el paquete `cors`, pero con `app.use(cors())`, que acepta peticiones de cualquier origen.
Lo cambiamos en `backend/src/app.js` para que solo acepte el origen del frontend:

```js
const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors({
  origin: ORIGENES_PERMITIDOS,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
```

El origen se puede cambiar con la variable `CORS_ORIGIN` en `backend/.env`. Si no se define, se usa
`http://localhost:5173`.

### Cómo ejecutar el proyecto

Se necesita Node.js 20.19 o superior (lo pide Vite 8) y dos terminales abiertas, una para cada servidor.

**Terminal 1: backend**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Debe aparecer `API escuchando en http://localhost:3000`.

**Terminal 2: frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Después se abre `http://localhost:5173` en el navegador. Si arriba a la derecha dice **API conectada**, el frontend
se está comunicando con el backend.

Si ya tenían un `backend/.env` de la entrega anterior no hace falta cambiarlo, porque sin `CORS_ORIGIN` el backend
usa `http://localhost:5173`.

### Qué hace la página

- La tabla se llena con `GET /api/calificaciones` y se vuelve a cargar después de cada cambio.
- **+ Nueva calificación** abre el formulario para crear (POST). **Editar** abre el mismo formulario con los datos
  del registro (PUT).
- **Eliminar** pide confirmación antes de hacer el DELETE.
- **Buscar por ID** hace `GET /api/calificaciones/:id`.
- Antes de enviar, el formulario revisa campos vacíos, nombres con números, notas que no son números, notas fuera
  de 0 a 5 y notas con más de un decimal. Si hay errores, no se envía nada al servidor.

### Mensajes según el código HTTP

| Código | Cuándo pasa | Qué muestra la página |
|--------|-------------|-----------------------|
| `200 OK` | Al listar, consultar o editar | Aviso verde y la tabla actualizada |
| `201 Created` | Al crear | Aviso verde con el ID nuevo; la fila nueva queda resaltada |
| `204 No Content` | Al eliminar | Aviso verde y la fila desaparece |
| `400 Bad Request` | Cuando llegan datos inválidos al servidor | Aviso rojo con la lista de errores del backend |
| `404 Not Found` | Cuando el ID no existe | Aviso rojo con el mensaje del backend |
| `409 Conflict` | Cuando el estudiante ya tiene nota en ese curso | Aviso rojo; el formulario queda abierto |
| Sin conexión | Cuando el backend está apagado | Mensaje de error con botón para reintentar |

Como el formulario no deja enviar datos inválidos, agregamos la casilla **Modo prueba** para poder mostrar el
error 400 que responde el servidor.

### Pasos de la demostración

1. Levantar los dos servidores y abrir `http://localhost:5173`.
2. Abrir **+ Nueva calificación**, escribir `Jo3` como estudiante y `6.5` en un corte, y dar clic en
   **Crear calificación**. Los campos se marcan en rojo y no se envía nada.
3. Corregir los datos (por ejemplo `Carlos Acuña`, `Ingeniería de Software III`, `4.5`, `4.0`, `4.8`) y guardar.
   Sale el aviso verde `201 Created` y la fila nueva en la tabla.
4. Crear otra vez una calificación para el mismo estudiante y curso. Sale el aviso rojo `409 Conflict`.
5. Dar clic en **Editar**, cambiar un corte y guardar. Se recalculan el promedio y el estado (`200 OK`).
6. Escribir `999` en **Buscar por ID** y dar clic en **Consultar**. Sale `404 Not Found`.
7. Dar clic en **Eliminar**, confirmar y ver que la fila desaparece (`204 No Content`).
8. Revisar la base de datos después de cada paso:

   ```bash
   sqlite3 backend/data/app.db "SELECT id, estudiante, curso, promedio, estado FROM calificaciones;"
   ```

   En Windows se puede abrir `backend/data/app.db` con DB Browser for SQLite.
