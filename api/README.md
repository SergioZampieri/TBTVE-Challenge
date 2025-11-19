# API - Servicio Backend

API REST con Express.js que obtiene, procesa y sirve datos CSV de una API externa con validación estricta y manejo de errores.

## Descripción General

Esta API actúa como proxy y formateador de datos entre un servicio externo de archivos CSV y aplicaciones cliente. Obtiene archivos CSV, valida cada fila según reglas estrictas, y sirve los datos limpios en formato JSON.

## Estructura del Proyecto

```
api/
├── src/
│   ├── app.js                      # Configuración de aplicación Express
│   ├── index.js                    # Punto de entrada del servidor
│   ├── controllers/
│   │   └── file.controller.js      # Manejadores de request para endpoints de archivos
│   ├── services/
│   │   └── file.service.js         # Lógica de negocio para integración con API externa
│   ├── routes/
│   │   └── file.routes.js          # Definiciones de rutas
│   ├── middlewares/
│   │   ├── corsMiddleware.js       # Configuración CORS
│   │   ├── errorHandler.js         # Manejo centralizado de errores
│   │   └── notFound.js             # Manejador 404
│   └── utils/
│       ├── csvParser.js            # Lógica de parsing y validación de CSV
│       ├── stringPartialMatcher.js # Utilidad de filtrado de strings
│       └── cache.js                # Sistema de caché en memoria
├── test/                           # Suite de tests Mocha + Chai
└── package.json
```

## Endpoints de la API

### GET /files/data

Retorna datos CSV formateados de todos los archivos disponibles o filtrados por nombre de archivo.

**Query Parameters:**
- `fileName` (opcional) - Filtra resultados por coincidencia parcial de nombre de archivo (case-insensitive)

**Response:** `200 OK`
```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

**Ejemplos de Peticiones:**
```bash
# Obtener datos de todos los archivos
curl http://localhost:3000/files/data

# Filtrar por nombre de archivo
curl http://localhost:3000/files/data?fileName=test1
```

### GET /files/list

Retorna una lista de nombres de archivos disponibles de la API externa.

**Response:** `200 OK`
```json
["file1.csv", "file2.csv", "file3.csv"]
```

**Ejemplo de Petición:**
```bash
curl http://localhost:3000/files/list
```

## Instalación y Uso

### Requisitos Previos

- Node.js 14.x
- npm 6+

### Configuración

```bash
npm install
```

### Ejecutar el Servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

### Ejecutar Tests

```bash
npm test
```

Esto ejecutará la suite de tests Mocha cubriendo:
- Parsing y validación de CSV
- Lógica de capa de servicio
- Comportamiento de controladores
- Funciones utilitarias

### Ejecutar con Docker

La API puede ejecutarse en un contenedor Docker:

```bash
# Construir la imagen
docker build -t tbtve-api .

# Ejecutar el contenedor
docker run -p 3000:3000 -e HOST=0.0.0.0 tbtve-api
```

**Nota:** La variable de entorno `HOST=0.0.0.0` es requerida para que la API acepte conexiones desde fuera del contenedor.

Para el stack completo con ambos API y Client, usar Docker Compose desde la raíz del proyecto:

```bash
docker-compose up --build
```

## Integración con API Externa

El servicio se integra con la API externa en:
- Base URL: `https://echo-serv.tbxnet.com/v1/secret`
- Authorization: `Bearer aSuperSecretKey`

### Endpoints Utilizados

- `GET /files` - Listar archivos disponibles
- `GET /file/{filename}` - Descargar contenido de archivo CSV

## Reglas de Validación CSV

Cada fila CSV es validada según requisitos estrictos:

1. **Cuatro columnas requeridas:** file, text, number, hex
2. **Todos los campos deben ser no vacíos** después de eliminar espacios en blanco
3. **Campo number:** Debe ser un valor numérico válido
4. **Campo hex:** Debe ser exactamente 32 caracteres alfanuméricos (0-9, a-f, A-F)

Las filas inválidas se descartan silenciosamente del output.

## Componentes Clave

### csvParser.js

Procesa contenido CSV y valida cada fila. Retorna un objeto conteniendo el nombre de archivo y un array de líneas válidas.

**Lógica de Validación:**
- Elimina espacios en blanco de todos los campos
- Convierte strings de números a tipo numérico
- Valida formato hex usando regex: `/^[a-fA-F0-9]{32}$/`
- Filtra filas incompletas o inválidas

### file.service.js

Maneja la comunicación con la API externa:
- Obtiene lista de archivos disponibles
- Descarga contenidos de archivos individuales
- Implementa caché para reducir llamadas redundantes a la API
- Maneja errores gracefully (retorna objetos de error en lugar de lanzar excepciones)

### cache.js

Sistema simple de caché en memoria:
- Reduce llamadas a API externa
- Mejora tiempos de respuesta para peticiones repetidas
- Las entradas de caché expiran después del timeout configurado

### stringPartialMatcher.js

Utilidad de matching parcial de strings case-insensitive usada para filtrado de nombres de archivo.

## Manejo de Errores

La API implementa manejo robusto de errores:

- **Errores de descarga de archivos:** Errores individuales de archivos no fallan toda la petición; archivos con errores se excluyen de los resultados
- **Archivos vacíos:** Tratados como respuestas válidas con array de líneas vacío
- **Filas CSV inválidas:** Descartadas silenciosamente durante el parsing
- **Fallos de API externa:** Logueados y retornados como resultados vacíos con status HTTP apropiado

## Optimizaciones de Performance

- **Procesamiento Paralelo:** Los archivos se obtienen concurrentemente usando `Promise.all`
- **Caché:** Peticiones repetidas para los mismos datos retornan resultados cacheados
- **Configuración de Timeout:** Timeout de 4 segundos para peticiones a API externa para prevenir cuelgues

## Dependencias

- **express** - Framework web
- **axios** - Cliente HTTP para llamadas a API externa
- **cors** - Middleware de cross-origin resource sharing

### Dependencias de Desarrollo

- **mocha** - Framework de testing
- **chai** - Librería de assertions
- **standard** - Linter de estilo de código JavaScript

## Estilo de Código

Este proyecto sigue las convenciones de estilo de código de StandardJS. Aunque el linting no se aplica en el script de test por conveniencia, el código se adhiere a las guías de estilo standard.
