# Frontend - Sistema de Órdenes de Pago

Frontend desarrollado en React + TypeScript para la gestión de órdenes de pago.

La aplicación consume la API del Backend y permite consultar clientes, productos y órdenes, además de registrar nuevas órdenes y actualizar su estado.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Axios
- React Router
- Lucide React

## Funcionalidades

- Listado de órdenes.
- Búsqueda de órdenes.
- Consulta del detalle de una orden.
- Registro de nuevas órdenes.
- Selección de cliente.
- Selección de productos.
- Control de cantidad por producto.
- Cálculo automático de subtotales.
- Cálculo automático del total de la orden.
- Actualización del estado de la orden.
- Listado y búsqueda de clientes.
- Listado y búsqueda de productos.
- Visualización de precio y stock.
- Productos sin stock deshabilitados para selección.
- Manejo de errores mediante alertas.

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js
- npm
- Backend de la aplicación en ejecución

## Instalación

Abrir una terminal dentro de la carpeta:

```bash
cd OrdenesPagoFrontend
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

Ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

Por ejemplo:

```text
http://localhost:5173
```

## Conexión con el Backend

El Frontend consume la API mediante los archivos ubicados en:

```text
src/services
```

La URL utilizada para conectarse al Backend debe coincidir con la dirección en la que se está ejecutando la API.

Si el Backend se ejecuta en otra dirección o puerto, se debe actualizar la configuración correspondiente en los servicios del Frontend.

## Generar versión de producción

Para generar la aplicación para producción:

```bash
npm run build
```

Vite generará la carpeta:

```text
dist
```

Esta carpeta contiene los archivos listos para publicar en un servidor web.

## Estructura principal

```text
src/
├── components/
├── models/
├── pages/
├── services/
├── App.tsx
├── App.css
└── main.tsx
```

## Carpetas principales

- `components`: componentes reutilizables.
- `models`: modelos e interfaces de TypeScript.
- `pages`: pantallas de la aplicación.
- `services`: archivos encargados de consumir la API.
- `App.tsx`: configuración principal de la aplicación.
- `App.css`: estilos principales.
- `main.tsx`: punto de entrada del proyecto.

## Notas
Los clientes y productos ya se encuentran registrados en la base de datos.