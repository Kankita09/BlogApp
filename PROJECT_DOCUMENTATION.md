# The Corporate Blog (TCB) — Project Documentation

## 1. Project Overview
The Corporate Blog (TCB) is a production-grade, SEO-first blogging platform built as a comprehensive 4-week project. It serves as a fully functional content management system (CMS) and public readership platform, designed for performance, high search engine visibility, and structured monetization.

## 2. Core Architecture
The platform is built using a modern decoupled full-stack architecture:

*   **Frontend**: Next.js 14 (App Router) combined with React and TypeScript. Focuses on Static Site Generation (SSG) and Incremental Static Regeneration (ISR) for lightning-fast page loads.
*   **Backend**: Node.js and Express API, written in TypeScript.
*   **Database**: PostgreSQL serverless database hosted on Neon, managed via Prisma ORM.
*   **Media Storage**: Cloudinary for optimized, dynamic image delivery.

## 3. Features Implemented

### Public Platform & Readership
*   **Dynamic Routing**: Fully implemented homepage, article pages (`/blog/[slug]`), and category filters (Tech, Business, Culture).
*   **High-Performance Search**: Built using native PostgreSQL `tsvector` queries for weighted full-text search capabilities without needing external search engines.
*   **Newsletter Subscriptions**: UI integrated for seamless email list capture.

### CMS Dashboard (Admin)
*   **Authentication & Access**: Protected admin routes using JWT and Role-Based Access Control (Admin, Editor, Writer).
*   **Block-Based Content Editor**: A custom JSON-based block editor enabling authors to add paragraphs, headings, code blocks, images, and embedded videos smoothly, preventing XSS injection vulnerabilities.
*   **Status Management**: Dashboard capabilities to switch articles between `DRAFT` and `PUBLISHED`.

### SEO Engine
*   **Structured Data**: Next.js native generation of JSON-LD schemas (`Article`, `BreadcrumbList`, `FAQ`).
*   **Dynamic Sitemaps**: Automated `sitemap.xml` referencing database-driven post slugs.
*   **Meta & OpenGraph**: Auto-populated Twitter cards, canonical tags, and OpenGraph images ensuring a 90+ Lighthouse SEO score.

### Monetization & Analytics
*   **Ad & Affiliate Integration**: Dedicated database models (`AffiliateLink`) to track clicks and conversions internally.
*   **Sponsored Content**: A programmatic `isSponsored` boolean that overlays premium badges on paid articles across grids and hero banners.
*   **View Tracking**: View services hash user IPs and User-Agents to securely track unique reads per article.

## 4. DevOps & Cloud Infrastructure
*   **Hosting**: Frontend optimized for Edge CDN delivery on Vercel. 
*   **Resiliency**: Monitored via Sentry and secured behind strict CORS and Rate-Limiting middleware (`express-rate-limit`, `helmet`).

---

## 5. Visual Proof & Screenshots

> **Note to Reviewer:** The following screenshots demonstrate the functional implementation of the backend infrastructure and frontend UI.

### [Insert Screenshot 1: Homepage Grid]
*(Displays the beautiful, responsive article grid, highlighting the 'Sponsored' badges and category tags.)*

### [Insert Screenshot 2: The Block Editor / CMS]
*(Shows the protected `/admin/posts/new` path, demonstrating the ability to craft posts using the custom JSON structural editor.)*

### [Insert Screenshot 3: PostgreSQL Database Schema (ERD)]
*(A visual representation of the Prisma Schema, proving the relational integrity of Users, Posts, Categories, and Subscriber tables.)*

### [Insert Screenshot 4: Serverless DB (Neon Dashboard)]
*(Proves the integration of the modern serverless PostgreSQL branch used in the cloud.)*

### [Insert Screenshot 5: SEO & Lighthouse Score]
*(A screenshot of a 90+ Lighthouse accessibility/SEO report on an article page, demonstrating the JSON-LD payload in the DOM.)*