# RecruitApi Frontend - Consola de Administración

Este proyecto es la interfaz gráfica (Frontend) del sistema de reclutamiento **RecruitAPI**. Ha sido migrado de una arquitectura tradicional (HTML estático + jQuery) a una moderna **Single Page Application (SPA)** construida íntegramente con React y Material UI (MUI).

El sistema se conecta de forma asíncrona a un backend RESTful en Node.js, ofreciendo una experiencia fluida, rápida y segura para la gestión de procesos de selección de personal.

---

## 🛠️ Stack Tecnológico

* **Core:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/) (para un entorno de desarrollo ultrarrápido)
* **Librería de Componentes:** [Material UI (MUI) v5](https://mui.com/)
* **Enrutamiento:** [React Router DOM](https://reactrouter.com/)
* **Alertas y Feedback UX:** [SweetAlert2](https://sweetalert2.github.io/)

---

## ✨ Características Principales (Cumplimiento Técnico)

Este proyecto fue desarrollado siguiendo altos estándares técnicos y patrones de diseño de interfaces:

* 🔒 **Autenticación y Rutas Protegidas:** Acceso seguro mediante validación de credenciales. La sesión se mantiene en el `sessionStorage` y protege la navegación (React Router Protected Routes).
* ⚡ **Validaciones en Tiempo Real:** Formularios estrictos con feedback visual inmediato al usuario si los campos están vacíos, incompletos o tienen un formato incorrecto (ej. correos electrónicos).
* 🔄 **Ciclo de Vida y DOM Dinámico:** Uso avanzado de `useEffect` para la sincronización inicial de datos (incluyendo peticiones paralelas con `Promise.all` en el Dashboard) y actualizaciones del DOM sin recargar la página.
* 🎨 **UI/UX Consistente:** Diseño responsivo, jerarquía visual y uso de iconos descriptivos gracias a Material UI. Implementación de modales interactivos y alertas elegantes con SweetAlert2 para prevenir acciones destructivas.

---

## 🗂️ Estructura del Proyecto

El código está organizado siguiendo el principio de separación de responsabilidades:

```text
recruit-frontend/
├── src/
│   ├── components/      # Componentes reutilizables (ej. Layout principal, Sidebar, Topbar)
│   ├── pages/           # Vistas principales (Login, Dashboard, Cargos, Candidatos, etc.)
│   ├── services/        # Lógica de conexión a la API REST (Fetch API encapsulado)
│   ├── App.jsx          # Configuración del Enrutador (Routes) y protección de rutas
│   └── main.jsx         # Punto de entrada de la aplicación y configuración de Material UI
├── public/              # Archivos estáticos (favicon)
├── package.json         # Dependencias del proyecto
└── vite.config.js       # Configuración del empaquetador