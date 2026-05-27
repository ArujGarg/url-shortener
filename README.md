# ShortLink

A production-style URL shortener built with Next.js, Express.js, PostgreSQL, Redis, and Docker featuring Redis caching, batched analytics flushing, structured logging, and Redis-backed rate limiting.

## Live Demo

- Frontend: https://url-shortener-eight-coral.vercel.app
- Backend: https://url-shortener-67bf.onrender.com

## Architecture
<img width="1151" height="575" alt="Screenshot 2026-05-27 at 8 44 32 PM" src="https://github.com/user-attachments/assets/f6685b96-7f89-460c-a71c-898df5db8175" />

## Features

- URL shortening
- Fast redirects using Redis cache
- Redis-backed click analytics tracking
- Batched click count flushing to PostgreSQL every 60 seconds
- Cache-aside pattern implementation
- Redis-backed API rate limiting using Upstash
- Structured logging using Pino
- Dockerized backend
- PostgreSQL persistence with Prisma ORM
- Background worker for analytics synchronization
- REST API architecture
- Cache hit/miss logging

## Tech Stack

### Frontend

- Next.js
- TypeScript
- TailwindCSS

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis

### DevOps / Infrastructure

- Docker
- Docker Compose
- Upstash Redis
- Pino Logger
- Render
- Vercel

# System Design

## URL Creation Flow

1. User submits a URL from frontend
2. Request passes through rate limiter
3. Backend generates a shortCode
4. URL mapping is stored in PostgreSQL
5. Shortened URL is returned to user

## Redirect Flow

1. User visits short URL
2. Backend checks Redis cache
3. On cache hit:
   - Original URL is returned immediately
4. On cache miss:
   - Backend queries PostgreSQL
   - Stores result in Redis cache
   - Returns redirect response
5. Click count is incremented in Redis

## Caching Strategy

### URL Cache

Redis stores:

url:<shortCode> -> originalUrl

with a TTL of 24 hours.

### Click Counter Cache

Redis stores:

clicks:<shortCode> -> count

Background worker periodically flushes these counts into PostgreSQL every 60 seconds.

## Rate Limiting

API requests are protected using Upstash Redis rate limiting.

### Limits

- POST requests: 10 requests/minute
- GET redirect requests: 1000 requests/minute

Returns HTTP 429 when limit is exceeded.

## API Endpoints

### Create Short URL

POST /api/v1/urls

Request:
{
"url": "https://google.com"
}

Response:
{
"shortCode": "abc123"
}

### Redirect URL

GET /:shortCode

Returns HTTP 302 redirect response.
