# RecruitAPI — Frontend

Interfaz gráfica del sistema de reclutamiento RecruitAPI. SPA construida con React y Material UI (MUI), conectada de forma asíncrona a la API REST en Node.js.

## Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Core | React 19 |
| Build tool | Vite 8 |
| Componentes UI | Material UI (MUI) v9 |
| Enrutamiento | React Router DOM v7 |
| Alertas / feedback | SweetAlert2 |

## Requisitos previos

- Node.js 18 o superior
- El backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

---

## Características Principales

- **Autenticación y rutas protegidas:** Login con POST al backend, sesión en `sessionStorage`. `PrivateRoute` redirige a `/login` si no hay sesión activa.
- **Capa de servicios:** Un archivo de servicio por entidad (`candidatoService`, `cargoService`, etc.) que encapsula toda la lógica HTTP. Las páginas solo consumen servicios, nunca llaman a `fetch` directamente.
- **Carga paralela:** El Dashboard usa `Promise.all` para obtener los 4 recursos simultáneamente.
- **Skeleton loaders:** Estado de carga visual en todas las tablas y KPI cards mientras se obtienen datos de la API.
- **Tablas ordenables:** Todas las tablas permiten ordenar por cualquier columna (ascendente/descendente) mediante `TableSortLabel` de MUI.
- **Formato de fecha:** Las fechas de entrevistas incluyen día de la semana en español (`Lunes, 15/06/2026, 10:00`).
- **Validaciones en formularios:** Campos obligatorios, formato de email con regex y feedback visual inline antes de enviar al servidor.
- **Feedback de errores de API:** Los errores devueltos por el backend (ej: email duplicado) se muestran como `Alert` dentro del dialog, sin cerrar el formulario.
- **Responsividad:** Sidebar persistent en desktop, hamburguesa en mobile, Grid con breakpoints de MUI.

---

## Módulos

| Ruta | Descripción |
|---|---|
| `/login` | Autenticación |
| `/` | Dashboard con KPIs y tabla de próximas entrevistas |
| `/candidatos` | CRUD de candidatos |
| `/cargos` | CRUD de cargos (estado Activo/Inactivo) |
| `/entrevistadores` | CRUD de entrevistadores |
| `/agenda` | CRUD de entrevistas con selector de fecha/hora |

---

## Estructura del Proyecto

```
src/
├── components/     # Layout compartido (Drawer + AppBar + Outlet)
├── config/
│   └── api.js      # API_BASE_URL y enum ESTADOS_ENTREVISTA
├── pages/          # Login, Dashboard, Candidatos, Cargos, Entrevistadores, Agenda
├── services/       # candidatoService, cargoService, entrevistadorService, entrevistaService
├── App.jsx         # Router y PrivateRoute
└── main.jsx        # Punto de entrada
```

---

**Autor:** Camilo Lavado / Instituto Profesional San Sebastián  
**Fecha:** Mayo 2026
