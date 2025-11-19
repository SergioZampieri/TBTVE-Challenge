# Client - Aplicación Frontend

Aplicación React para visualizar y filtrar datos CSV obtenidos de la API backend. Construida con patrones modernos de React, Redux Toolkit para manejo de estado, y React Bootstrap para componentes UI.

## Descripción General

Esta aplicación de página única proporciona una interfaz limpia para visualizar datos CSV formateados. Los usuarios pueden buscar/filtrar archivos por nombre y ver los datos en formato de tabla responsive con feedback en tiempo real mediante notificaciones toast.

## Estructura del Proyecto

```
client/
├── src/
│   ├── index.js                          # Punto de entrada de la aplicación
│   ├── App.jsx                           # Componente principal de la aplicación
│   ├── components/
│   │   ├── Header.jsx                    # Header de la aplicación
│   │   ├── SearchInput.jsx               # Input de filtro por nombre de archivo
│   │   ├── Table.jsx                     # Componente de tabla de datos
│   │   └── ToastNotification.jsx         # Sistema de notificaciones toast
│   ├── redux/
│   │   ├── store.js                      # Configuración del store Redux
│   │   └── slices/
│   │       ├── filesSlice.js             # Estado de archivos y async thunks
│   │       └── notificationsSlice.js     # Estado de notificaciones
│   ├── services/
│   │   ├── api.js                        # Configuración de instancia Axios
│   │   └── fileService.js                # Métodos del servicio API
│   ├── utils/
│   │   └── debounce.js                   # Utilidad de debounce
│   └── __tests__/                        # Tests Jest + React Testing Library
├── config/
│   └── config.js                         # Configuración de entorno
├── public/
│   ├── index.html                        # Template HTML
│   └── toolboxtve_logo.jpg              # Favicon
├── webpack.config.js                     # Configuración Webpack
├── babel.config.js                       # Configuración Babel
└── package.json
```

## Instalación y Uso

### Requisitos Previos

- Node.js 16.10+
- npm 6+

### Configuración

```bash
npm install
```

### Ejecutar el Servidor de Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:8080` con hot module replacement habilitado.

### Construir para Producción

```bash
npm run build
```

Esto crea un build de producción optimizado en el directorio `build/`.

### Ejecutar Tests

```bash
npm test
```

Esto ejecuta la suite de tests Jest cubriendo:
- Renderizado y comportamiento de componentes
- Slices de Redux y manejo de estado
- Interacciones de usuario
- Integración con API

### Ejecutar con Docker

El client puede ejecutarse en un contenedor Docker:

```bash
# Construir la imagen
docker build -t tbtve-client .

# Ejecutar el contenedor
docker run -p 8080:8080 tbtve-client
```

Para el stack completo con ambos API y Client, usar Docker Compose desde la raíz del proyecto:

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:8080`

## Arquitectura de Componentes

### App.jsx

Componente principal de la aplicación que:
- Despacha obtención inicial de datos al montarse
- Orquesta el layout con el sistema de grilla Bootstrap
- Maneja el estado general de la aplicación

### Header.jsx

Componente de header estático que muestra el título de la aplicación.

### SearchInput.jsx

Componente de input controlado para filtrar archivos:
- Conectado al store Redux
- Input con debounce para reducir llamadas a API
- Actualiza el estado de filtro y dispara re-fetch de datos

### Table.jsx

Componente de tabla de datos que:
- Muestra datos CSV formateados en tabla Bootstrap
- Muestra spinner de carga durante fetch de datos
- Maneja estados vacíos
- Formatea números con separadores específicos del locale

### ToastNotification.jsx

Sistema de notificaciones toast:
- Muestra mensajes de feedback al usuario
- Auto-descarta después de delay configurable
- Soporta múltiples tipos de notificación (info, success, error, warning)
- Posicionado en esquina superior derecha

## Estructura del Store Redux

### Files Slice

**Estado:**
```javascript
{
  items: [],        // Array de objetos de archivo con datos CSV
  isLoading: false, // Estado de carga para operaciones asíncronas
  hasError: false,  // Estado de error
  filterName: ''    // String de filtro actual
}
```

**Acciones:**
- `fetchFilesData(fileName)` - Async thunk para obtener datos de API
- `setFilterName(name)` - Acción síncrona para actualizar filtro

**Selectores:**
- `selectFilesData` - Retorna array de items
- `selectIsLoadingFiles` - Retorna estado de carga
- `selectFilterName` - Retorna filtro actual

### Notifications Slice

**Estado:**
```javascript
{
  items: [] // Array de objetos de notificación con id, type, message, delay
}
```

**Acciones:**
- `showNotification(payload)` - Agregar notificación a la cola
- `dismissNotification(id)` - Remover notificación por ID

**Selectores:**
- `selectAllNotifications` - Retorna todas las notificaciones activas

## Capa de Servicios

### fileService.js

Métodos de servicio para comunicación con API:
- `getFilesData(fileName)` - Obtiene datos CSV formateados con filtrado opcional

### api.js

Configuración de instancia Axios:
- Base URL desde archivo de configuración
- Timeout de 10 segundos
- Headers de content-type JSON

## Utilidades

### debounce.js

Implementación custom de debounce para retrasar la ejecución de funciones. Usado en SearchInput para prevenir llamadas excesivas a la API mientras se escribe.

## Configuración

La configuración se maneja en `config/config.js` y soporta variables de entorno:

```javascript
{
  env: {
    mode: process.env.NODE_ENV || "development",
    apiUrl: process.env.API_URL || "http://localhost:3000"
  },
  htmlMetadata: {
    icon: "public/toolboxtve_logo.jpg",
    title: "Toolbox Challenge"
  }
}
```

**Variables de Entorno:**
- `NODE_ENV` - Modo de aplicación (development/production)
- `API_URL` - URL de la API Backend (por defecto http://localhost:3000)

## Configuración Webpack

La aplicación usa Webpack 5 con las siguientes características clave:

- **Entry:** `./src/index.js`
- **Output:** `./build/main.js`
- **Dev Server:** Hot reload en puerto 8080
- **Loaders:**
  - Babel para transpilación JS/JSX
  - CSS loader con inyección de estilos (dev) o extracción (prod)
  - Asset/resource loader para imágenes
- **Plugins:**
  - HtmlWebpackPlugin para generación de HTML
  - MiniCssExtractPlugin para extracción de CSS en producción

## Estilos

- **React Bootstrap** - Componentes UI pre-construidos
- **Bootstrap 5** - Framework CSS base
- CSS custom para notificaciones toast y ajustes de layout

## Patrón de Manejo de Estado

La aplicación sigue las mejores prácticas de Redux Toolkit:

1. **Slices:** Organización de estado basada en features
2. **Async Thunks:** Manejan operaciones asíncronas con estados de carga/error
3. **Selectores:** Encapsulan lógica de acceso al estado
4. **Immer:** Actualizaciones inmutables integradas
5. **DevTools:** Integración con Redux DevTools para debugging

## Manejo de Errores

- Los errores de API disparan notificaciones para informar a los usuarios
- Los estados de carga previenen confusión del usuario durante fetch de datos
- Los estados vacíos proveen feedback claro cuando no hay datos disponibles
- Las peticiones fallidas se loguean y se muestran mediante notificaciones toast

## Consideraciones de Performance

- **Debouncing:** El input de búsqueda tiene debounce (300ms) para reducir peticiones a la API
- **Code Splitting:** La configuración de Webpack soporta code splitting futuro
- **Build de Producción:** Minificación y optimización para despliegue en producción

## Dependencias

### Producción
- **react** / **react-dom** - Librería UI
- **redux** / **@reduxjs/toolkit** - Manejo de estado
- **react-redux** - Bindings de React para Redux
- **axios** - Cliente HTTP
- **bootstrap** / **react-bootstrap** - Componentes UI

### Desarrollo
- **webpack** / **webpack-cli** / **webpack-dev-server** - Bundler
- **babel** - Transpilador JavaScript
- **jest** / **@testing-library/react** - Framework de testing
- **eslint** / **prettier** - Herramientas de calidad de código

## Soporte de Navegadores

La aplicación está orientada a navegadores modernos que soporten características ES6+. Para compatibilidad más amplia, pueden requerirse polyfills adicionales.
