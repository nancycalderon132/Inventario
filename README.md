# Sistema de Gestión de Inventario para Útiles Escolares

Descripción
Aplicación web completa para la gestión de inventario de una empresa de útiles escolares, con funcionalidades CRUD, autenticación de usuarios, control de stock e historial de movimientos.

Características
- ✅ Autenticación de usuarios (login/registro) con roles (admin, usuario)
- ✅ CRUD completo para productos
- ✅ Gestión de stock (entradas, salidas, ajustes)
- ✅ Historial detallado de movimientos
- ✅ Dashboard con métricas y gráficos
- ✅ Diseño responsive para móviles y escritorio
- ✅ Filtros y búsqueda avanzada
- ✅ Paginación de resultados
- ✅ Confirmaciones y alertas con modales
- ✅ Protección de rutas según rol
- ✅ Generación de reportes

Tecnologías utilizadas
- HTML5, CSS3, JavaScript (ES6+)
- LocalStorage para persistencia de datos
- Chart.js para gráficos
- Font Awesome para iconos
- Diseño responsive con CSS Grid y Flexbox

Estructura del proyecto
inventario-utiles-escolares/
├── index.html # Página de login
├── register.html # Página de registro
├── dashboard.html # Panel principal
├── productos.html # Gestión de productos
├── historial.html # Historial de movimientos
├── css/
│ └── styles.css # Estilos principales
├── js/
│ ├── app.js # Funcionalidad principal
│ ├── auth.js # Autenticación
│ ├── productos.js # Gestión de productos
│ └── historial.js # Gestión de historial
└── README.md # Documentación

## Instalación y uso
1. Descargar o clonar el proyecto
2. Abrir `index.html` en un navegador web moderno
3. No se requiere servidor ni instalación adicional

## Credenciales de acceso
- **Administrador:** admin@inventario.com / admin123
- **Usuario:** usuario@inventario.com / user123

## Funcionalidades por rol
### Administrador
- Acceso completo a todas las funcionalidades
- Gestión completa de productos (CRUD)
- Registro de movimientos de stock
- Generación de reportes
- Visualización del historial completo

### Usuario
- Visualización de productos
- Consulta del historial
- Registro de movimientos básicos
- No puede eliminar productos ni usuarios

## Características técnicas
### Frontend
- Arquitectura modular con separación de responsabilidades
- Diseño responsive (mobile-first)
- Validación de formularios en cliente
- Manejo de errores y notificaciones

### Persistencia de datos
- Uso de localStorage para simular base de datos
- Estructura de datos JSON para productos, usuarios y movimientos
- Datos de ejemplo precargados

### API RESTful (simulada)
- Operaciones CRUD mediante funciones JavaScript
- Manejo de estados y actualización de la UI
- Validación de permisos por rol

## Limitaciones y mejoras futuras
### Limitaciones actuales
- Persistencia solo en localStorage (datos se pierden al limpiar caché)
- No hay backend real (simulado con JavaScript)
- Reportes PDF/Excel simplificados

### Mejoras posibles
- Implementar backend con Node.js/Express
- Base de datos real (MySQL, MongoDB)
- Autenticación JWT más segura
- Exportación de reportes más robusta
- Notificaciones en tiempo real
- Soporte para múltiples almacenes
- Integración con sistemas de punto de venta

Capturas de pantalla
1. **Login: Formulario de autenticación con validación
2. **Dashboard:** Panel con métricas y gráficos
3. **Productos:** Tabla con filtros y paginación
4. **Historial:** Registro completo de movimientos
5. **Modales:** Para confirmaciones y formularios

Compatibilidad
- Navegadores modernos (Chrome 80+, Firefox 75+, Safari 13+)
- Dispositivos móviles (iOS 12+, Android 8+)
- Tablets y escritorio

## Autor
Sistema desarrollado como proyecto educativo para gestión de inventario

## Licencia
Proyecto educativo - Uso libre para fines de aprendizaje
