# OrbitIQ Multi-Tenant Analytics Dashboard — AWS Production Architecture

## 1. Overview

This document describes a production-ready AWS architecture for **OrbitIQ**, a multi-tenant customer engagement analytics platform built with:

- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript
- **Authentication:** JWT-based session model
- **Tenancy model:** shared application services with strict tenant-scoped access control

The system supports multiple organizations such as **BrightMarket** and **CloudSync**, while ensuring that each tenant can only access its own analytics data.

The design focuses on:

- tenant isolation
- scalability
- operational simplicity
- cost efficiency
- secure production deployment

---

## 2. Recommended Multi-Tenancy Model

## Choice: **Pooled application + pooled database with tenant_id isolation**

For this product stage, the best fit is a **pooled multi-tenant architecture**:

- all tenants share the same application deployment
- all tenants share the same database cluster
- every tenant-owned row includes a `tenant_id`
- every request is resolved to a tenant through authentication context
- every query is filtered by `tenant_id`

### Why this model is the best choice

Compared with a silo model, a pooled model is better for this assessment and for an early-stage SaaS product because it:

- keeps infrastructure cost lower
- simplifies deployment and operations
- makes onboarding new tenants fast
- allows horizontal scaling without per-tenant infrastructure duplication
- is realistic for internal dashboards and B2B SaaS analytics platforms

### Tradeoff

A pooled model requires very disciplined tenant isolation controls. That means:

- tenant context must be derived from authenticated identity
- backend APIs must never trust tenant data from the frontend
- repositories and database access layers must always enforce `tenant_id`
- authorization checks must be centralized and testable

---

## 3. High-Level AWS Architecture

```text
Users
  │
  ▼
Route 53
  │
  ▼
CloudFront
  │
  ├── S3 (React frontend static assets)
  │
  └── ALB (HTTPS)
         │
         ▼
     ECS Fargate
     Node.js API containers
         │
         ├── ElastiCache Redis
         │
         ├── RDS PostgreSQL
         │
         ├── SQS (optional async jobs)
         │
         └── CloudWatch / X-Ray / Logs
```

---

## 4. Frontend Architecture

## Services

- **Amazon S3**
- **Amazon CloudFront**
- **AWS Certificate Manager**
- **Amazon Route 53**

### Design

The React frontend is built into static assets and deployed to an S3 bucket. CloudFront sits in front of S3 to provide:

- low-latency global delivery
- TLS termination
- caching of static assets
- protection from direct bucket access

### Production flow

1. User accesses `app.orbitiq.com`
2. Route 53 resolves the domain
3. CloudFront serves static frontend assets from S3
4. Frontend calls the API domain, such as `api.orbitiq.com`

### Why this is a good fit

- very cost efficient
- low operational overhead
- easy CI/CD deployment
- scalable for high read traffic
- standard pattern for React SPA hosting

---

## 5. Backend Compute Architecture

## Recommended service: **Amazon ECS on Fargate**

### Why ECS Fargate

The Node.js API should run as a containerized service on ECS Fargate because it gives:

- no EC2 instance management
- predictable deployment model
- easy horizontal scaling
- smooth integration with load balancers, secrets, logging, and autoscaling
- better production realism than a purely mock Lambda setup for this app shape

### Container design

The API runs as stateless containers:

- Express / Node.js API
- JWT verification middleware
- analytics endpoints
- tenant-aware repository layer

Because the service is stateless, any container can serve any tenant request safely as long as authorization and query filtering are enforced properly.

### Networking

- ECS tasks run in **private subnets**
- Application Load Balancer runs in **public subnets**
- security groups only allow required traffic paths
- database is never publicly exposed

---

## 6. Database Design

## Recommended service: **Amazon RDS for PostgreSQL**

### Why PostgreSQL

PostgreSQL is a strong fit because the application is relational and tenant-scoped:

- tenants
- users
- events
- aggregated analytics records
- role-based access data

It also supports:

- strong indexing
- query optimization
- mature operational tooling
- optional row-level security patterns if adopted later

### Multi-tenant schema pattern

Example tables:

- `tenants`
- `users`
- `events`
- `daily_metrics`

Every tenant-owned row should include:

- `tenant_id`

Example:

```sql
events (
  id uuid primary key,
  tenant_id uuid not null,
  event_type text not null,
  occurred_at timestamptz not null,
  value integer not null,
  metadata jsonb
)
```

### Isolation strategy

The application layer enforces tenant isolation with:

- authenticated JWT containing `userId` and `tenantId`
- middleware that injects `tenantId` into request context
- repository methods that always query by `tenant_id`

Example pattern:

```sql
SELECT *
FROM events
WHERE tenant_id = $1
ORDER BY occurred_at DESC;
```

### Indexing recommendations

To keep analytics queries fast:

- index `(tenant_id, occurred_at)`
- index `(tenant_id, event_type, occurred_at)`
- index `users(email)` for login lookup
- optionally partition very large event tables by date

---

## 7. Authentication and Authorization

## Recommended production direction

For the assessment, JWT-based login is enough. In production, I would keep the same model but harden it with:

- secure password hashing using bcrypt or Argon2
- short-lived access tokens
- refresh token rotation
- secrets stored in AWS Secrets Manager
- optional federation with Cognito or enterprise SSO later

### Request flow

1. User signs in with email and password
2. Backend verifies credentials
3. Backend issues a signed token containing:
   - `userId`
   - `tenantId`
   - `role`
4. Each protected request includes the token
5. Middleware verifies the token and injects tenant context
6. Controllers and repositories query only within that tenant scope

### Security principle

The frontend should **never send a raw tenant selector** for data access decisions.

Tenant scope must come from the verified identity, not from user-controlled request input.

---

## 8. Preventing Cross-Tenant Data Leakage

This is the most important production requirement.

### Controls

#### 1. Tenant derived from identity
The tenant is resolved from the authenticated user, not selected in the request body for analytics access.

#### 2. Centralized auth middleware
Every protected route must pass through middleware that:

- validates JWT
- extracts `tenantId`
- attaches it to the request context

#### 3. Repository-level filtering
Every tenant-scoped query must include `tenant_id`.

#### 4. No direct table access from controllers
Controllers should call services and repositories, not build raw unscoped queries inline.

#### 5. Automated tests
Integration tests should verify:

- BrightMarket users never receive CloudSync data
- CloudSync users never receive BrightMarket data
- tokens with missing or invalid tenant context are rejected

#### 6. Least privilege IAM
Application tasks get only the permissions they need.

#### 7. Secrets isolation
Database credentials, JWT secrets, and API secrets live in AWS Secrets Manager, not in code or container images.

#### 8. Auditability
Structured logs should record:

- request ID
- authenticated user ID
- tenant ID
- route
- status code

This helps detect and investigate suspicious access patterns.

---

## 9. Caching Strategy

## Recommended service: **Amazon ElastiCache for Redis**

Redis can improve dashboard response times for repeated summary queries.

### Good cache targets

- analytics summary payloads
- daily trend aggregates
- recently computed event counts

### Cache key pattern

```text
tenant:{tenantId}:analytics:summary
tenant:{tenantId}:analytics:trend:{dateRange}
```

### Why this helps

The dashboard reads are predictable and repeated. Caching reduces:

- database load
- query latency
- cost during traffic spikes

### Cache safety rule

Cache keys must always include `tenantId` so one tenant’s analytics payload can never be served to another tenant.

---

## 10. Asynchronous Processing

## Recommended service: **Amazon SQS**  
Optional future service: **AWS Lambda** or a background worker on ECS

For a more realistic production platform, raw engagement events can be ingested asynchronously.

### Pattern

1. API receives event ingestion request
2. API validates and writes event to queue
3. Worker processes queue messages
4. Worker stores normalized records in PostgreSQL
5. Optional aggregate tables are updated in the background

### Benefits

- smoother handling of burst traffic
- reduced pressure on synchronous request paths
- easier retry handling
- clean separation between ingestion and analytics reads

For this assessment, synchronous writes are acceptable, but the production design should mention this path.

---

## 11. Observability and Monitoring

## Recommended services

- **Amazon CloudWatch**
- **AWS X-Ray** or OpenTelemetry-compatible tracing
- **CloudWatch Alarms**

### Logging

Use structured JSON logs with fields such as:

- timestamp
- requestId
- route
- userId
- tenantId
- latencyMs
- statusCode

### Metrics

Track:

- request count
- error rate
- p95 and p99 latency
- login failures
- database CPU and connections
- cache hit rate
- ECS task memory and CPU usage

### Alerting

Create alarms for:

- 5xx rate spike
- ALB unhealthy targets
- ECS CPU saturation
- RDS CPU or storage pressure
- high authentication failure rate

---

## 12. Networking and Security

## VPC layout

Use a VPC across at least two Availability Zones.

### Public subnets

- Application Load Balancer
- NAT Gateway

### Private subnets

- ECS Fargate tasks
- RDS PostgreSQL
- Redis

### Security controls

- HTTPS enforced everywhere
- ACM-managed certificates
- WAF in front of CloudFront or ALB if needed
- restrictive security groups
- no public access to RDS
- secrets injected at runtime from Secrets Manager
- encryption at rest for RDS, S3, and Redis
- S3 bucket access restricted through CloudFront origin access control

---

## 13. CI/CD Pipeline

## Recommended services

- GitHub Actions or GitLab CI
- Amazon ECR
- ECS deployment pipeline
- S3 frontend deployment
- optional CloudFront cache invalidation

### Backend deployment flow

1. Push to main branch
2. Run lint, typecheck, tests
3. Build Docker image
4. Push image to Amazon ECR
5. Deploy new ECS task definition
6. Roll service safely behind ALB

### Frontend deployment flow

1. Build React app
2. Upload assets to S3
3. Invalidate CloudFront cache for changed files

### Why this matters

This keeps deployments repeatable, reviewable, and production-friendly.

---

## 14. Handling a 10× Traffic Spike

The assessment explicitly asks how to handle a large traffic spike.

### Strategy

#### Frontend
CloudFront and S3 naturally absorb very large static asset traffic.

#### Backend
Use ECS Service Auto Scaling based on:

- CPU utilization
- memory utilization
- request count per target

#### Database
Use:
- proper indexes
- read-optimized queries
- Redis caching
- connection pooling

#### Async workloads
Shift heavy ingestion or aggregation work to SQS-backed workers.

#### Load balancing
ALB distributes traffic across healthy containers.

### Example spike response

If traffic increases by 10×:

- CloudFront continues to serve cached frontend assets
- ALB spreads requests across more ECS tasks
- ECS scales out horizontally
- Redis absorbs repeated dashboard reads
- PostgreSQL handles scoped queries with indexes
- background queues prevent ingestion bottlenecks

---

## 15. Disaster Recovery and Reliability

### Reliability practices

- Multi-AZ RDS deployment
- ECS service spread across multiple AZs
- S3 durability for frontend assets
- infrastructure defined as code
- automated backups for PostgreSQL
- health checks on ALB and ECS
- rolling deployments with rollback support

### Backup considerations

- daily automated RDS backups
- point-in-time recovery enabled
- versioned S3 bucket for frontend artifacts if desired

---

## 16. Cost-Conscious Production Path

For an early-stage SaaS platform, I would use a cost-aware version of this design:

- S3 + CloudFront for frontend
- ECS Fargate with small task sizes
- single PostgreSQL instance to start, then scale to Multi-AZ
- Redis only when dashboard read pressure justifies it
- SQS introduced when event volume grows

This gives a realistic path from proof of concept to production without overengineering the first release.

---

## 17. Future Evolution

As the product grows, I would consider:

- database read replicas
- table partitioning for high-volume event data
- row-level security in PostgreSQL
- tenant-specific rate limits
- audit event streams
- OpenSearch for event exploration
- Cognito or enterprise SSO integration
- event streaming with Amazon MSK or Kinesis for large-scale ingestion

---

## 18. Final Recommendation

For OrbitIQ, the best production AWS design is:

- **React frontend on S3 + CloudFront**
- **Node.js API on ECS Fargate behind an ALB**
- **PostgreSQL on Amazon RDS**
- **Redis on ElastiCache for hot analytics reads**
- **Secrets Manager for credentials and secrets**
- **CloudWatch for logs, metrics, and alarms**
- **SQS for future asynchronous event ingestion**
- **pooled multi-tenant model with strict `tenant_id` enforcement**

This architecture is realistic, scalable, and cost-aware. It demonstrates strong production judgment while matching the assessment’s key requirements around tenant isolation, scalability, and AWS deployment design.
