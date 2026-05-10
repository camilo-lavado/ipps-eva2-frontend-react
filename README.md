# RecruitApi Frontend

Este proyecto es la interfaz gráfica (Frontend) del sistema de reclutamiento RecruitAPI. Ha sido migrado de una arquitectura tradicional (HTML estático + jQuery) a una Single Page Application (SPA) construida con React y Material UI (MUI).

El sistema se conecta de forma asíncrona a un backend RESTful en Node.js, ofreciendo una experiencia fluida y segura para la gestión de procesos de selección de personal.

---

## Stack Tecnológico

- **Core:** React 19
- **Build Tool:** Vite
- **Librería de Componentes:** Material UI (MUI) v9
- **Enrutamiento:** React Router DOM v7
- **Alertas y Feedback UX:** SweetAlert2

---

## Requisitos previos

- Node.js 18 o superior
- El servidor backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Vista previa del build de producción
npm run preview

# Ejecutar linter
npm run lint
```

---

## Características Principales

- **Autenticación y Rutas Protegidas:** Validación de credenciales con sesión en `sessionStorage` y protección de rutas mediante React Router.
- **Validaciones en Tiempo Real:** Formularios controlados con feedback visual inmediato bajo cada campo, incluyendo validación de formato de correo electrónico mediante expresiones regulares.
- **Ciclo de Vida y DOM Dinámico:** Uso de `useEffect` para sincronización de datos al montar cada módulo, con peticiones paralelas mediante `Promise.all` en el Dashboard.
- **Responsividad:** Interfaz adaptada a dispositivos móviles, tablet y escritorio mediante el sistema de Grid y breakpoints de MUI. Sidebar con variante temporal y menú hamburguesa en resoluciones móviles.
- **UI/UX Consistente:** Diseño con jerarquía visual, colores semánticos en estados de registros (`Chip`) y notificaciones mediante SweetAlert2.

---

## Estructura del Proyecto

```
recruit-frontend/
├── src/
│   ├── components/      # Componentes reutilizables (Layout, Sidebar, Topbar)
│   ├── config/          # Constantes compartidas (URL base de API, estados de entidades)
│   ├── pages/           # Vistas principales (Login, Dashboard, Cargos, Candidatos, Entrevistadores, Agenda)
│   ├── services/        # Capa de acceso a la API REST (Fetch encapsulado por entidad)
│   ├── App.jsx          # Configuración del enrutador y protección de rutas
│   └── main.jsx         # Punto de entrada de la aplicación
├── public/
├── package.json
└── vite.config.js
```
