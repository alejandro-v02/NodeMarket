# Marketplace de Servicios

Plataforma web tipo marketplace donde **proveedores** publican servicios (oferta) y **clientes** los buscan, contratan y califican (demanda). Pensado como un proyecto escalable: arranca con un MVP funcional y va creciendo por fases (pagos, mensajería, notificaciones, panel de administración, etc.).

## 🎯 Objetivo del proyecto

Construir una plataforma completa de conexión entre personas que ofrecen servicios (ej: plomería, diseño gráfico, clases particulares, desarrollo web, etc.) y personas que los necesitan, con:

- Perfiles de proveedores y clientes
- Publicación y búsqueda de servicios por categoría
- Sistema de solicitudes/reservas de servicios
- Calificaciones y reseñas
- (Fases futuras) Pagos en línea, mensajería en tiempo real, notificaciones, suscripciones premium para proveedores

## 🧱 Stack tecnológico

### Backend
- **NestJS** con **Arquitectura Hexagonal** (Ports & Adapters)
- **PostgreSQL** como base de datos relacional
- **TypeORM** como ORM
- **JWT + Passport** para autenticación
- **class-validator / class-transformer** para validación de DTOs

### Frontend
- **React** (por definir: Vite + herramientas de estado/estilos)
- Consumo de la API REST del backend

## 🏛️ Arquitectura del backend (Hexagonal)

Cada módulo de negocio se organiza en tres capas:

```
modules/<nombre-modulo>/
├── domain/            # Entidades de negocio puras + interfaces de repositorio (puertos)
│   ├── entities/
│   └── repositories/
├── application/       # Casos de uso (lógica de negocio) + DTOs
│   ├── use-cases/
│   └── dtos/
└── infrastructure/    # Adaptadores: TypeORM, controladores HTTP, mapeadores
    ├── persistence/
    └── controllers/
```

**Principio clave:** el dominio no depende de NestJS ni de TypeORM. Los casos de uso dependen de interfaces (puertos), y la infraestructura implementa esos puertos. Esto permite testear la lógica de negocio de forma aislada y cambiar de tecnología (DB, framework) sin tocar el core del negocio.

## 📦 Módulos planeados (roadmap del MVP)

- [x] Setup del proyecto + estructura hexagonal
- [ ] **Usuarios**: registro, login, roles (cliente / proveedor / admin)
- [ ] **Categorías**: clasificación de los servicios
- [ ] **Servicios**: publicación de servicios por parte de proveedores
- [ ] **Solicitudes/Reservas**: un cliente contrata a un proveedor
- [ ] **Reseñas/Calificaciones**: feedback de clientes sobre servicios recibidos
- [ ] *(Fase futura)* Pagos
- [ ] *(Fase futura)* Mensajería entre cliente y proveedor
- [ ] *(Fase futura)* Notificaciones
- [ ] *(Fase futura)* Frontend en React consumiendo la API

## ⚙️ Variables de entorno

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=
DATABASE_NAME=marketplace_db
JWT_SECRET=
```

## 🚀 Instalación

```bash
npm install
npm run start:dev
```

Asegúrate de tener PostgreSQL corriendo y la base de datos `marketplace_db` creada antes de levantar el proyecto.

## 📌 Estado actual

Proyecto en desarrollo activo, construido de forma guiada, módulo por módulo y archivo por archivo, siguiendo buenas prácticas de arquitectura hexagonal.
