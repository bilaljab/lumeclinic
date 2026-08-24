# LUMÉ — Lightweight Demo Tech Stack

## 1. Architecture Goal

LUMÉ is a **premium frontend-heavy landing page template**, not a real clinic platform.

The architecture should therefore optimize for:

- Visual quality
- Creative freedom
- Fast development
- Reusable components
- Easy client customization
- Excellent responsive behavior
- Simple deployment
- Minimal infrastructure

Avoid unnecessary backend complexity.

## 2. Recommended Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js | Main web application |
| UI | React | Component architecture |
| Language | TypeScript | Type safety and maintainability |
| Styling | Tailwind CSS | Rapid responsive styling |
| Animation | GSAP + ScrollTrigger | Premium motion and scroll interactions |
| Smooth Scroll | Lenis | Optional smooth scrolling |
| 3D | React Three Fiber / Three.js | Optional hero/brand 3D |
| Icons | Lucide React | Lightweight interface icons |
| i18n | next-intl | English/Arabic routing and translations |
| Forms | React Hook Form | Booking form state |
| Validation | Zod | Form validation |
| Data | Local TypeScript data | Mock content |
| Backend | None initially | Keep demo lightweight |
| Database | None | Not required for demo |
| Auth | None | Not required for demo |
| Storage | Local / public assets | Demo images and media |
| Deployment | Vercel | Fast Next.js deployment |
| Repository | GitHub | Version control |

## 3. Frontend — Next.js + React + TypeScript

Use Next.js as the main application framework.

Why:

- Excellent support for modern React
- Good SEO foundations
- Easy routing
- Static/server rendering when useful
- Easy deployment to Vercel
- Strong reusable component architecture
- Suitable for converting the demo into a real client site later

Do not create a separate frontend and backend application for the demo.

## 4. Styling — Tailwind CSS

Use Tailwind CSS with a small custom design system.

Define reusable tokens for:

- Colors
- Typography
- Spacing
- Breakpoints
- Border radius
- Shadows
- Motion

The goal is to avoid hard-coded styles being scattered across components.

Example conceptual tokens:

```text
colors
fonts
spacing
radii
motion
```

## 5. Animation — GSAP

GSAP is a core part of the visual implementation.

Use:

- GSAP timelines
- ScrollTrigger
- Scroll-based reveals
- Image clipping
- Text animations
- Pinned sections
- Horizontal movement
- CTA micro-interactions

The animation system should be reusable so the same visual language can be applied to future clinic templates.

## 6. Smooth Scrolling — Lenis

Lenis is optional.

Use it only if the final design benefits from smooth scrolling. It should not be introduced just because it is popular.

If used, integrate it carefully with GSAP/ScrollTrigger.

## 7. 3D — React Three Fiber

3D is optional and should be isolated from the rest of the site.

Recommended approach:

- Lazy-load the 3D scene
- Keep geometry/materials lightweight
- Avoid large textures
- Provide a fallback for mobile or reduced-motion users

The site must remain impressive without depending entirely on WebGL.

## 8. Internationalization — next-intl

Use next-intl for English/Arabic.

Suggested routing:

```text
/en
/ar
```

The system should support:

- Translations
- RTL direction
- Locale-aware layouts
- Locale-specific metadata where useful

Arabic layout must be intentionally designed rather than automatically mirrored without review.

## 9. Mock Data Architecture

Do not introduce a database for the demo.

Store reusable content in TypeScript files.

Suggested structure:

```text
src/
├── data/
│   ├── treatments.ts
│   ├── doctors.ts
│   ├── packages.ts
│   ├── results.ts
│   └── testimonials.ts
│
├── config/
│   ├── site.ts
│   └── theme.ts
```

Example conceptual model:

```ts
Treatment {
  slug
  name
  category
  description
  image
  duration
  recovery
}
```

This makes the template easy to adapt.

## 10. Recommended Component Structure

```text
src/
├── app/
│   └── [locale]/
│       ├── page.tsx
│       ├── treatments/
│       ├── doctors/
│       ├── packages/
│       └── book/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── sections/
│   ├── treatments/
│   ├── doctors/
│   ├── results/
│   ├── booking/
│   └── motion/
│
├── data/
├── config/
├── lib/
└── styles/
```

The exact structure can evolve, but components should be organized by reusable domain/section rather than by arbitrary file type.

## 11. Booking Flow

The booking flow is a demo interaction only.

Suggested flow:

```text
Treatment
   ↓
Doctor
   ↓
Date
   ↓
User Details
   ↓
Confirmation
```

The submission can simply produce a successful confirmation state.

No real appointment engine is required.

## 12. WhatsApp

Use a WhatsApp deep link rather than the WhatsApp Business API.

Example behavior:

- Global WhatsApp button
- Treatment-specific prefilled message
- Doctor-specific prefilled message

This is enough for a portfolio/demo experience and can later be replaced with a real integration.

## 13. Assets

For the demo, keep visual assets in the project:

```text
public/
├── images/
├── videos/
├── doctors/
├── treatments/
└── results/
```

Optimize images and avoid unnecessarily large assets.

Use modern formats where practical.

## 14. Performance

The design is animation-heavy, so performance is important.

Requirements:

- Optimize hero images
- Lazy-load non-critical media
- Lazy-load 3D
- Avoid excessive client-side JavaScript
- Use Server Components where appropriate
- Keep animation calculations efficient
- Respect `prefers-reduced-motion`
- Test mobile performance

## 15. SEO

Even though this is a demo, maintain basic production-quality SEO foundations:

- Metadata
- Semantic HTML
- Proper heading hierarchy
- Open Graph metadata
- Good page titles/descriptions
- Localized metadata for Arabic/English where applicable

Do not spend time building a large SEO system for the demo.

## 16. Accessibility

Minimum requirements:

- Semantic HTML
- Keyboard-accessible interactions
- Visible focus states
- Sufficient contrast
- Meaningful alt text
- Proper form labels
- Reduced-motion support

## 17. Deployment

### Vercel

Recommended because it provides:

- Simple Next.js deployment
- Preview deployments
- Automatic Git integration
- CDN delivery
- Environment variables
- Easy rollback

Deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
Preview / Production
```

## 18. What We Explicitly Do NOT Need

For the demo, do not add:

- PostgreSQL
- Supabase
- Firebase
- Authentication
- User accounts
- Admin dashboard
- CMS
- Real appointment scheduling
- Payment gateway
- CRM
- Microservices
- Separate backend server
- Complex cloud infrastructure

These can be introduced later when converting the template into a real client project.

## 19. Reusable Template Strategy

The most important technical decision is to separate **content, theme, and components**.

Conceptually:

```text
                TEMPLATE
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     CONTENT     THEME     COMPONENTS
        │          │          │
        ↓          ↓          ↓
   Treatments   Colors      Hero
   Doctors      Fonts       Explorer
   Packages     Spacing     Results
   Results      Logo        Booking
```

For a new clinic, ideally change:

```text
Brand name
Logo
Colors
Fonts
Images
Content
Doctors
Treatments
Contact information
```

while keeping most components and interaction patterns unchanged.

## 20. Architecture Principle

> **Build the first version like a reusable design system, not like a one-off website.**

The stack should remain intentionally lightweight so most engineering effort can go into what actually differentiates this project:

**Art direction + frontend quality + interactions + motion + conversion UX.**
