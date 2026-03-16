# LTI - Talent Tracking System  | EN

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is initiated with Create React App, and the backend is written in TypeScript.

## Directory and File Explanation

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`:  The entry point for the backend server.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
  - `.env`: Contains the environment variables.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files such as the HTML file and images.
  - `build/`: Contains the production-ready build of the frontend.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend

The frontend is a React application, and its main files are located in the `src` directory. The `public` directory contains static assets, and the build directory contains the production `build` of the application.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- The `src` directory contains the source code
- The `prisma` directory contains the Prisma schema.

## First steps

To get started with this project, follow these steps:

1. Clone the repo
2. Install dependencies for frontend and backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Start the PostgreSQL database:
```sh
docker compose up -d
```
4. Apply database migrations and load seed data *(first time only)*:
```sh
cd backend
npx prisma migrate deploy
npx prisma db seed
```
> To wipe the database and re-seed at any point: `npx prisma migrate reset`

5. Run the backend server:
```sh
cd backend
npm run dev
```
6. In a new terminal window, start the frontend:
```sh
cd frontend
npm start
```

The backend server will be running at http://localhost:3010, and the frontend will be available at http://localhost:3000.

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

1. Install Docker on your machine if you haven't done so already.
2. Navigate to the root directory of the project in your terminal.
3. Start the PostgreSQL container:
```sh
docker compose up -d
```
This runs the database in the background. To stop it: `docker compose down`

To access the database directly with any PostgreSQL client, use the connection details defined in `docker-compose.yml` and `backend/.env`:
- **Host:** localhost
- **Port:** 5432
- **User / Password / Database:** see `docker-compose.yml`

### Database initialization (first time)

Once the container is running, initialize the schema and populate it with seed data from `backend/`:

```sh
# Applies all existing migrations from the repository
npx prisma migrate deploy

# Insert synthetic test data
npx prisma db seed
```

The seed script (`backend/prisma/seed.ts`) is idempotent — running it multiple times produces the same result without errors.

To reset the database and re-seed from scratch:
```sh
npx prisma migrate reset
```

# LTI - Sistema de Seguimiento de Talento  | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- El directorio `src` contiene el código fuente
- El directorio `prisma` contiene el esquema de Prisma.

## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias para el frontend y el backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Levanta la base de datos PostgreSQL:
```sh
docker compose up -d
```
4. Aplica las migraciones de la base de datos y carga los datos de prueba *(solo la primera vez)*:
```sh
cd backend
npx prisma migrate deploy
npx prisma db seed
```
> Para borrar la base de datos y volver a poblarla en cualquier momento: `npx prisma migrate reset`

5. Inicia el servidor backend:
```sh
cd backend
npm run dev
```
6. En una nueva ventana de terminal, inicia el frontend:
```sh
cd frontend
npm start
```

El servidor backend estará corriendo en http://localhost:3010 y el frontend estará disponible en http://localhost:3000.

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

1. Instala Docker en tu máquina si aún no lo has hecho.
2. Navega al directorio raíz del proyecto en tu terminal.
3. Levanta el contenedor de PostgreSQL:
```sh
docker compose up -d
```
Esto inicia la base de datos en segundo plano. Para detenerla: `docker compose down`

Para conectarte directamente con cualquier cliente PostgreSQL, usa los datos de conexión definidos en `docker-compose.yml` y `backend/.env`:
- **Host:** localhost
- **Puerto:** 5432
- **Usuario / Contraseña / Base de datos:** ver `docker-compose.yml`

### Inicialización de la base de datos (primera vez)

Con el contenedor en marcha, inicializa el esquema y carga los datos sintéticos desde `backend/`:

```sh
# Aplica todas las migraciones existentes del repositorio
npx prisma migrate deploy

# Inserta datos de prueba
npx prisma db seed
```

El script de seed (`backend/prisma/seed.ts`) es idempotente: ejecutarlo varias veces produce el mismo resultado sin errores.

Para resetear la base de datos y volver a poblarla desde cero:
```sh
npx prisma migrate reset
```
