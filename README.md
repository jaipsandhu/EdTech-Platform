# EdTech Platform

An AI-enabled educational platform with role-based dashboards for admins, teachers, and students, built with Spring Boot and Angular. Features a RAG-powered chatbot that answers questions grounded strictly in uploaded course materials.

---

## Tech Stack

**Backend**
- Java 17, Spring Boot 4.0.6
- Spring Security (JWT, stateless sessions)
- Spring Data JPA + PostgreSQL
- LangChain4j (Easy RAG, Ollama, PGVector, Reactor streaming)
- AWS S3 (content storage)
- SendGrid (OTP email)
- Lombok

**Frontend**
- Angular 21
- TypeScript 5.9
- RxJS 7.8

 
---

## Features

### Auth
- Register / Sign in with JWT
- OTP-based password recovery via email (SendGrid)
- Role-based access: `ADMIN`, `TEACHER`, `STUDENT`

### Admin
- Manage students and teachers (view, edit, delete)
- Content management: upload, activate/deactivate, delete course materials
- Content stored in AWS S3

### Teacher
- Dashboard to view and manage uploaded content

### Student
- Browse and view active course content
- RAG chatbot: ask questions answered only from ingested course documents
  - Falls back gracefully if the topic isn't in the course materials
  - Streams responses token-by-token via SSE

### RAG Pipeline
- Documents uploaded → chunked (1000 tokens, 100 overlap) → embedded with `nomic-embed-text` via Ollama → stored in PGVector
- At query time: retrieves top-5 chunks (min score 0.75) → passed to `llama3.2:3b` for answer generation
- Greetings bypass retrieval; out-of-scope queries return a friendly fallback message

---

## Project Structure

```
EdTech-Platform-main/
├── backend/
│   └── EdTech/
│       ├── src/main/java/com/example/demo/
│       │   ├── admin/          # Admin controllers, services, DTOs
│       │   ├── chatbot/        # RAG pipeline, Ollama config, chat endpoints
│       │   ├── content/        # Content upload/management, S3 integration
│       │   ├── dashboard/      # Auth, JWT, security config, user service
│       │   ├── notes/          # Notes entity and service
│       │   ├── student/        # Student controller
│       │   └── teacher/        # Teacher controller
│       └── docker-compose.yml  # PGVector + PostgreSQL
└── frontend/
    └── edtech-frontend/        # Angular 21 app
        └── src/app/
            ├── core/           # Auth guard, auth service
            └── features/
                ├── admin/      # Dashboard, student/teacher/content management
                ├── auth/       # Sign in, register, forgot password
                ├── student/    # Student dashboard, content viewer
                └── teacher/    # Teacher dashboard
```

---

## Prerequisites

- Java 17+
- Node.js + npm 11+
- Docker (for PostgreSQL with PGVector)
- [Ollama](https://ollama.com/) running locally on port `11434`
- AWS S3 bucket + credentials
- SendGrid API key

---

## Setup

### 1. Start the database

```bash
cd backend/EdTech
docker compose up -d
```

This starts PostgreSQL 17 with the PGVector extension on port `5432`.

### 2. Pull Ollama models

```bash
ollama pull llama3.2:3b
ollama pull nomic-embed-text:latest
```

### 3. Configure the backend

Add an `application.properties` (or environment variables) under `backend/EdTech/src/main/resources/`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/
spring.datasource.username=postgres
spring.datasource.password=*******
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=<your-secret>

# AWS S3
aws.access-key=<your-access-key>
aws.secret-key=<your-secret-key>
aws.region=<your-region>
aws.bucket-name=<your-bucket>

# SendGrid
sendgrid.api-key=<your-sendgrid-key>
sendgrid.from-email=<your-from-email>
```

### 4. Run the backend

```bash
cd backend/EdTech
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 5. Run the frontend

```bash
cd frontend/edtech-frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

---

## API Overview

| Prefix | Role required | Description |
|---|---|---|
| `/auth/**` | Public | Login, register, OTP recovery |
| `/home/**` | Public | Landing / public content |
| `/admin/**` | `ADMIN` | User and content management |
| `/teacher/**` | `TEACHER` | Teacher operations |
| `/student/**` | `STUDENT` | Student content access |
| `/chat/**` | Authenticated | RAG chatbot (SSE streaming) |
| `/healthcheck` | Public | Health check |

---

## Notes

- Document uploads for RAG are capped at **3MB** per file.
- The chatbot only answers from ingested documents — it won't hallucinate outside course materials.
- CORS is configured for `http://localhost:4200`; update `SecurityConfig.java` for production.
- The `src/main/resources/docs/` directory stores uploaded documents locally before ingestion — consider moving to S3 or a volume in production.
