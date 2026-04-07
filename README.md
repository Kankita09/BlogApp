# The Corporate Blog (TCB)

The Corporate Blog (TCB) is a production-ready, SEO-optimized blogging platform designed to simulate a real-world enterprise publishing system. The platform combines a high-performance public readership experience with a secure administrative CMS dashboard, enabling structured content creation, analytics tracking, and monetization workflows.

## System Architecture

TCB follows a decoupled full-stack architecture optimized for scalability, performance, and maintainability.

### 1. Frontend Layer
- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Rendering**: Static Site Generation (SSG) & Incremental Static Regeneration (ISR)
- **Delivery**: Optimized Edge CDN delivery via Vercel
- **Features**: Dynamic routing, metadata automation for SEO, robust Core Web Vitals performance.

### 2. Backend Layer
- **Runtime & Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Security**: Helmet, CORS protection, Express rate limiting, JWT + Refresh Token Auth, Role-Based Access Control (RBAC).
- **Features**: REST API services, content lifecycle management, tracking analytics, newsletter routing.

### 3. Database Layer
- **Database**: PostgreSQL (Serverless) hosted on Neon
- **ORM**: Prisma
- **Features**: Structured relational schema, native PostgreSQL full-text search engine, relational tracking infrastructure.

### 4. Media & Cloud Infrastructure
- **Media Provider**: Cloudinary (Image optimization, dynamic resizing, CDN-backed delivery)
- **Hosting & Edge**: Vercel Edge Network
- **Monitoring**: Sentry (Error monitoring, runtime exception tracking)

## Core Features
1. **CMS Dashboard (Admin)**: Secure interface with a block-based JSON-driven content editor and workflow states (Draft/Published).
2. **SEO Optimization Engine**: Built-in automated structured data (JSON-LD), dynamic metadata generation, and automatic `sitemap.xml`.
3. **Monetization & Analytics**: Custom affiliate link tracking, sponsored content labeling, and privacy-conscious viewership analytics.
4. **Search & Discovery**: High-performance full-text search using Postgres `tsvector` indexing without relying on external services.

---
*Developed by Ankita Kakade*
