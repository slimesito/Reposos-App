# Sistema Nacional de Gestión de Reposos Médicos - API (Laravel) 🩺🏥

![Laravel 10](https://img.shields.io/badge/Laravel-10-red.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791.svg)

> Esta solución es una API centralizada para el **registro y consulta de reposos médicos** en la red hospitalaria venezolana.
> Esta solución proporciona servicios RESTful que permiten a instituciones médicas de Venezuela:

- **Registrar digitalmente** reposos médicos con validez nacional
- **Consultar historiales médicos** de ciudadanos en tiempo real
- **Gestionar recursos hospitalarios** (personal médico, especialidades, patologías)
- **Generar documentos médicos** con firmas y sellos digitales

---

## 📁 Estructura del Proyecto

```bash
Reposos-App/
└── Reposos-API/    # Backend Laravel 10
   ├── app/              # Lógica de Aplicación
   ├── config/           # Configuración
   └── routes/           # Rutas API definidas
```

---

## ⚙️ Tecnologías Usadas

- **Laravel 10** – Backend API con autenticación JWT Sanctum, control de sesiones y lógica de registro y consulta de Reposos y Pacientes Médicos.
- **PostgreSQL** – Base de datos con triggers para actualización automática de historiales médicos.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🧑‍💻 Funcionalidades

### 👨‍⚕️ Gestión de Usuarios Médicos

- Registro de médicos con imágenes de perfil, firma y sello (solo administradores)
- Autenticación JWT con Sanctum y control de sesiones
- Perfiles de usuario con actualización de contraseña y fotos
- Roles diferenciados (administrador/médico) con permisos granularizados

### 📋 Gestión de Reposos Médicos

- Registro completo de reposos con:
  - Validación de ciudadanos en base de datos nacional
  - Especialidades médicas y patologías certificadas
  - Periodos de reposo con validación de fechas
- Consulta de historial médico por ciudadano
- Listado completo de reposos registrados

### 🏗️ Gestión de Recursos Hospitalarios

- CRUD completo para:
  - Hospitales y centros médicos
  - Especialidades médicas
  - Patologías y diagnósticos
- Relaciones entre médicos, especialidades y hospitales

---

## 🚀 Instalación y Ejecución

### 🔧 Backend (Laravel)

#### 1. Clonar repositorio

```bash
git clone https://github.com/slimesito/Reposos-App
```

#### 2. Instalar dependencias

```bash
cd Reposos-App/Reposos-API
composer install
```

#### 3. Configurar .env con credenciales de DB, ejecutar migraciones e iniciar servidor

```bash
cp .env.example .env
php artisan migrate --seed
php artisan serve
```

---

## 📡 API Endpoints

| Method | Route                | Description                       | Middleware    |
|--------|----------------------|-----------------------------------| ------------- |
| POST   | /api/login           | Inicio de Sesión con Token Bearer | No Auth       |
| POST   | /api/logout          | Cierre de Sesión                  | Auth          |
| POST   | /api/reposos         | Registro de Reposos               | Auth          |
| GET    | /api/patients        | Listado completo de Pacientes     | Admin         |
| GET    | /patients/{id}       | Consulta de Paciente              | Admin         |
| POST   | /api/register        | Registro de Pacientes             | Admin         |
| GET    | /api/users           | Listado de Usuarios               | Admin         |
| PUT    | /api/users/{user}    | Editar Usuarios                   | Admin         |
| DELETE | /api/users/{user}    | Eliminar Usuarios                 | Admin         |

---

## 📄 Licencia

Este proyecto es una réplica de demostración, creada exclusivamente para:

- Pruebas técnicas
- Propósitos de portafolio

Queda prohibido cualquier uso comercial sin autorización expresa por escrito.

---

## 🙋‍♂️ Desarrollador

Desarrollado por [William Villegas](https://www.linkedin.com/in/william-villegas-ab3b94215/)
