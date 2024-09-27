# **Microservicio de Usuarios (ws-users)**

## Descripción

El microservicio **ws-users** se encarga de gestionar la lógica relacionada con los usuarios, incluyendo el registro, autenticación mediante JWT, y la validación de tokens. Está desarrollado con **NestJS** y sigue las mejores prácticas de **Clean Code** y **Arquitectura Hexagonal**.

Este README incluye la configuración necesaria para dockerizar el microservicio y ejecutarlo junto con una base de datos MongoDB dentro de contenedores Docker.

## **Arquitectura del Microservicio**

- **Controlador de Usuarios**: Maneja las solicitudes HTTP para el registro y autenticación de usuarios.
- **Servicio de Usuarios**: Contiene la lógica de negocio para la gestión de usuarios.
- **Repositorio de Usuarios**: Interactúa con MongoDB para realizar operaciones de CRUD.
- **Servicio de Autenticación**: Gestiona la generación y validación de tokens JWT.

### **Tecnologías Utilizadas**

- **NestJS**: Framework para la creación de aplicaciones escalables en Node.js.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar información de usuarios.
- **JWT**: Autenticación mediante JSON Web Tokens.
- **TypeScript**: Lenguaje de programación.
- **Jest**: Herramienta de pruebas unitarias.
- **Docker**: Para la creación de contenedores.
- **Docker Compose**: Orquestador de contenedores.

## **Instalación y Configuración con Docker**

### **Requisitos Previos**

- **Docker Desktop** instalado.
- **Node.js** (opcional, solo si quieres ejecutar localmente sin Docker).

### **Pasos para la Instalación y Ejecución con Docker**

1. Clona el repositorio del microservicio:

   ```bash
   git clone <URL_DEL_REPOSITORIO_WS_USERS>
   ```

2. Entra al directorio del microservicio:

   ```bash
   cd ws-users
   ```

3. Crea el archivo `.env` con las siguientes variables de entorno:

   ```bash
   DATABASE_CONNECTION=mongodb://admin:adminpass@mongo-container:27017/ws-users?authSource=admin
   JWT_SECRET=supersecreto
   ```

4. Asegúrate de tener el siguiente archivo `docker-compose.yml` en la raíz del proyecto:

   ```yaml
   version: '3'
   services:
     mongo:
       image: mongo
       container_name: mongo-container
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: adminpass

     ws-users:
       build: .
       container_name: ws-users
       ports:
         - "3000:3000"
       depends_on:
         - mongo
       environment:
         DATABASE_CONNECTION: mongodb://admin:adminpass@mongo-container:27017/ws-users?authSource=admin
         JWT_SECRET: supersecreto
   ```

5. Construye y ejecuta los contenedores:

   ```bash
   docker-compose up -d
   ```

6. Verifica que ambos contenedores estén corriendo:

   ```bash
   docker ps
   ```

7. Accede al microservicio en `http://localhost:3000`.

### **Parar los Contenedores**

Para detener los contenedores, ejecuta:

```bash
docker-compose down
```

## **Endpoints Disponibles**

### **1. Registro de Usuario**

- **Endpoint**: `POST /ms-users/user/register`
- **Descripción**: Registra un nuevo usuario en el sistema.
- **Parámetros**:
  - `document`: Número de documento del usuario (requerido).
  - `name`: Nombre del usuario (requerido).
  - `email`: Correo electrónico (requerido).
  - `phone`: Número de teléfono del usuario (requerido).
- **Ejemplo de Request**:
  ```json
  {
    "document": "1234567890",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "5551234567"
  }
  ```
- **Ejemplo de Response**:
  ```json
  {
    "status": true,
    "message": "El usuario fue creado correctamente",
    "data": {
      "uuid": "f48f78f8-d0c9-4d71-8654-dcf8a123f687",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "timestamp": "2024-09-26T15:00:00.000Z"
  }
  ```

### **2. Validación de Token**

- **Endpoint**: `POST /ms-users/auth/validate-token`
- **Descripción**: Valida la autenticidad de un JWT emitido para un usuario.
- **Parámetros**:
  - `token`: Token JWT a validar (requerido).
- **Ejemplo de Request**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Ejemplo de Response**:
  ```json
  {
    "status": true,
    "message": "Token válido",
    "data": {
      "decoded": {
        "email": "juan.perez@example.com",
        "sessionId": "d0c9-4d71-8654-dcf8a123f687"
      }
    },
    "timestamp": "2024-09-26T15:10:00.000Z"
  }
  ```

## **Pruebas**

El microservicio incluye pruebas unitarias y de integración que cubren todas las funcionalidades clave.

### **Ejecutar Pruebas Unitarias**

Para ejecutar las pruebas unitarias:

```bash
yarn test
```

### **Ejecutar Pruebas de Integración (E2E)**

Para ejecutar las pruebas de integración:

```bash
yarn test:e2e
```

### **Ver la Cobertura de las Pruebas**

Para generar un reporte de cobertura de pruebas:

```bash
yarn test:cov
```

## **Modelo de Datos**

El sistema utiliza **MongoDB** para almacenar la información relacionada con los usuarios.

### **Modelo de Usuario**

```json
{
  "uuid": "f48f78f8-d0c9-4d71-8654-dcf8a123f687",
  "document": "1234567890",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "5551234567"
}
```
