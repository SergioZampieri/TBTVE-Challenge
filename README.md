# TBTVE-Challenge

Desafío de código Full Stack JavaScript que implementa una API REST con Express.js y un frontend React para obtener, procesar y mostrar datos CSV de una API externa.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Primeros Pasos](#primeros-pasos)
  - [Requisitos Previos](#requisitos-previos)
  - [Ejecución Local](#ejecución-local)
  - [Ejecución con Docker](#ejecución-con-docker)
- [Testing](#testing)
- [Características Implementadas](#características-implementadas)
- [Arquitectura y Decisiones de Diseño](#arquitectura-y-decisiones-de-diseño)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Requisitos del Challenge](#requisitos-del-challenge)

## Descripción General

Este proyecto consta de dos aplicaciones:

- **API (Backend):** Servidor Node.js Express que obtiene archivos CSV de una API externa, procesa y valida los datos, y los sirve en formato JSON.
- **Client (Frontend):** Aplicación React que consume la API y muestra los datos formateados en una tabla con funcionalidad de búsqueda.

El sistema obtiene archivos CSV de una API remota, filtra las filas inválidas según reglas de validación estrictas, y presenta los datos a través de una interfaz de usuario limpia con funcionalidad de búsqueda.

## Stack Tecnológico

**API:**
- Node.js 14
- Express.js
- Axios para peticiones HTTP
- Mocha + Chai para testing
- StandardJS code style

**Client:**
- Node.js 16+
- React 18 (componentes funcionales con hooks)
- Redux Toolkit para manejo de estado
- React Bootstrap para componentes UI
- Webpack para bundling
- Jest + React Testing Library para testing
- ESLint + Prettier para calidad de código

**DevOps:**
- Docker
- Docker Compose

## Primeros Pasos

### Requisitos Previos

- Node.js 14.x (para API)
- Node.js 16.10+ (para Client)
- npm 6+ o yarn
- Docker y Docker Compose (opcional, para despliegue containerizado)

### Ejecución Local

#### API (Backend)

```bash
cd api
npm install
npm start
```

La API estará disponible en `http://localhost:3000`

**Endpoints disponibles:**
- `GET /files/data` - Retorna datos CSV formateados de todos los archivos
- `GET /files/data?fileName=<name>` - Retorna datos filtrados por nombre de archivo
- `GET /files/list` - Retorna lista de archivos disponibles

#### Client (Frontend)

```bash
cd client
npm install
npm start
```

La aplicación client estará disponible en `http://localhost:8080`

### Ejecución con Docker

El stack completo de la aplicación puede ejecutarse usando Docker Compose, que orquesta ambos contenedores API y Client.

**Requisitos previos:**
- Docker Engine 20.10+
- Docker Compose V2+

**Iniciar la aplicación:**

```bash
docker-compose up --build
```

El flag `--build` asegura que los contenedores se reconstruyan con los últimos cambios de código.

**Los servicios estarán disponibles en:**
- API: `http://localhost:3000`
- Client: `http://localhost:8080`

**Detener los contenedores:**

```bash
# Detener y remover contenedores
docker-compose down

# Detener, remover contenedores y remover volúmenes
docker-compose down -v
```

**Reconstruir después de cambios en el código:**

```bash
docker-compose up --build
```

**Configuración de Contenedores:**
- El contenedor API ejecuta Node.js 14 y escucha en `0.0.0.0:3000` para acceso externo
- El contenedor Client ejecuta Node.js 16+ en `0.0.0.0:8080`

## Testing

### Tests de API

La API incluye tests unitarios usando Mocha y Chai:

```bash
cd api
npm test
```

La cobertura de tests incluye:
- Lógica de parsing y validación de CSV
- Integración del servicio de archivos
- Comportamiento de endpoints del controlador
- Utilidades de matching de strings

### Tests de Client

El frontend incluye tests unitarios usando Jest y React Testing Library:

```bash
cd client
npm test
```

La cobertura de tests incluye:
- Slices de Redux y manejo de estado
- Renderizado y comportamiento de componentes React
- Interacciones de usuario
- Integración con API

## Características Implementadas

### Características Requeridas

**API:**
- API REST con Express.js sirviendo datos JSON
- Integración con API externa (https://echo-serv.tbxnet.com)
- Parsing de CSV con reglas de validación estrictas
- Filtrado de filas inválidas (campos faltantes, números inválidos, hex inválido)
- Manejo de errores para fallos en descarga de archivos
- Suite de tests con Mocha + Chai
- JavaScript ES6+ sin Babel ni TypeScript

**Frontend:**
- React 18 con componentes funcionales y hooks
- Componentes UI de React Bootstrap
- Bundler Webpack
- Obtención de datos y visualización en formato tabla
- JavaScript ES6+ sin TypeScript

### Características Opcionales

**API:**
- Endpoint `GET /files/list` para archivos disponibles
- Filtrado por query parameter fileName
- Aplicación de estilo de código StandardJS
- Sistema de caché para respuestas de API

**Frontend:**
- Redux Toolkit para manejo de estado
- Tests unitarios con Jest y React Testing Library
- Funcionalidad de búsqueda/filtro por nombre de archivo
- Notificaciones toast para feedback de usuario
- Estados de carga y manejo de errores

**Global:**
- Configuración de Docker y Docker Compose

## Arquitectura y Decisiones de Diseño

### Arquitectura de API

La API sigue un patrón de arquitectura por capas:

- **Routes:** Definen rutas de endpoints y métodos HTTP
- **Controllers:** Manejan la lógica de request/response y coordinan llamadas a servicios
- **Services:** Encapsulan lógica de negocio y comunicación con API externa
- **Utils:** Utilidades reutilizables para parsing de CSV, matching de strings y caché

**Decisiones clave:**

- **Caché:** Se implementó un caché en memoria para reducir llamadas redundantes a la API externa y mejorar el rendimiento
- **Procesamiento Paralelo:** Los archivos se obtienen en paralelo usando Promise.all para minimizar el tiempo de respuesta
- **Resiliencia ante Errores:** Los errores individuales de archivos no fallan toda la petición; los archivos con errores se excluyen de los resultados
- **Validación:** La validación estricta de CSV asegura la integridad de datos (4 columnas requeridas, number debe ser numérico, hex debe ser exactamente 32 caracteres hexadecimal)

### Arquitectura de Client

El frontend utiliza una arquitectura React moderna:

- **Redux Toolkit:** Manejo de estado centralizado con slices para archivos y notificaciones
- **Estructura de Componentes:** Separación de responsabilidades con componentes contenedores y presentacionales
- **Async Thunks:** Manejan llamadas asíncronas a la API con estados de carga y error
- **Debouncing:** El input de búsqueda tiene debounce para reducir llamadas innecesarias a la API

**Decisiones clave:**

- **Componentes Funcionales:** Patrones de React con hooks
- **Redux para Estado:** Manejo de estado centralizado para gestionar operaciones asíncronas y estado UI global
- **Integración con Bootstrap:** Desarrollo rápido de UI con sistema de diseño consistente
- **Configuración de Entorno:** El archivo de configuración soporta variables de entorno para despliegue flexible (Docker vs local)

## Capturas de Pantalla

![app-screenshot](https://i.ibb.co/LDT7bt8f/Captura1.png)

---
