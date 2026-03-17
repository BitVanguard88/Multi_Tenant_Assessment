# OrbitIQ Multi-Tenant Analytics Dashboard

A proof-of-concept multi-tenant SaaS analytics platform built with React, Node.js, and TypeScript.

## Features

- Email/password authentication
- Tenant inferred from authenticated user
- JWT-based tenant context
- Strict tenant-scoped analytics APIs
- Dashboard with summary metrics and engagement trend visualization

## Demo users

- sarah@brightmarket.com / Password123!
- mike@cloudsync.io / Password123!

## Run locally

### Backend

cd backend
cp .env.example .env
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev