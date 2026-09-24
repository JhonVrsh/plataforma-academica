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
| 2 | Jhon Jairo Bernal Ortega | Estilos del proyecto (`style.css`) |
| 3 | _Nombre integrante 3_ | Interactividad (`script.js`), pull request y revisión |

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
