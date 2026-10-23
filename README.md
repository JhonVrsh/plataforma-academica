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
