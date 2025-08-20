# 🏗️ China Wholesale Ecommerce - Architecture Overview

## 📖 **Table of Contents**
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [API-Ready Structure](#api-ready-structure)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [API Switching Guide](#api-switching-guide)
- [Development Workflow](#development-workflow)

---

## 🎯 **Project Overview**

This is a comprehensive ecommerce platform built for China Wholesale with:

- **Customer Panel**: Product browsing, cart, orders, queries, quotations
- **Admin Panel**: Product management, order processing, analytics
- **API-Ready Architecture**: Seamless switching between mock and real APIs
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Brand Consistency**: Uses China Wholesale theme and styling

---

## 🏗️ **Architecture**

### **Core Principles**
1. **API Abstraction**: Single client layer handles all API calls
2. **Environment Switching**: Toggle between mock and external APIs
3. **Adapter Pattern**: Transform external data to internal format
4. **Type Safety**: Full TypeScript coverage
5. **Testing Ready**: Comprehensive testing strategy

### **Data Flow**
```
Components → Adapters → API Client → Mock/External API
     ↑                                      ↓
Type Safety ←─── Transformations ←── Raw Data
```

---

## 🧩 **API-Ready Structure**

### **Environment-Based Switching**
```typescript
// .env.local
NEXT_PUBLIC_USE_EXTERNAL_API=false  // Use mock data
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=  // Set when ready

// When ready for real API:
NEXT_PUBLIC_USE_EXTERNAL_API=true
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=https://api.chinawholesale.com
```

### **Single API Client**
All API calls go through `lib/apiClient.ts`:
- Automatic retry with exponential backoff
- Timeout handling
- Error standardization  
- Authentication token management
- File upload support

### **Centralized Endpoints**
All API routes defined in `lib/endpoints.ts`:
- No hard-coded URLs in components
- Easy to update when API changes
- Consistent naming conventions
- Query parameter helpers

### **Domain Adapters**
Transform external API responses in `lib/adapters/`:
- `products.ts` - Product catalog management
- `orders.ts` - Order lifecycle and tracking
- `auth.ts` - Authentication and user management
- `payments.ts` - Payment processing

---

## 📁 **Directory Structure**

```
cart/
├── app/                          # Next.js 14 App Router
│   ├── (customer)/              # Customer routes (/products, /cart, /account)
│   ├── (admin)/                 # Admin routes (/admin/...)
│   ├── (auth)/                  # Auth routes (/login, /register)
│   ├── api/                     # Mock API route handlers
│   ├── globals.css              # Global styles with China Wholesale theme
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (Button, Card, etc.)
│   ├── forms/                   # Form components
│   ├── admin/                   # Admin-specific components
│   └── customer/                # Customer-specific components
├── lib/                         # Core utilities
│   ├── apiClient.ts             # Single API client (THE MAIN API LAYER)
│   ├── endpoints.ts             # Centralized endpoint mapping
│   ├── adapters/                # Domain-specific data adapters
│   │   ├── products.ts          # Product API adapter
│   │   ├── orders.ts            # Order API adapter
│   │   ├── auth.ts              # Auth API adapter
│   │   └── payments.ts          # Payment API adapter
│   ├── validators/              # Zod schemas for data validation
│   └── utils.ts                 # Helper utilities
├── mocks/                       # Mock data and handlers
│   ├── data/                    # Static JSON data files
│   │   ├── products.json        # Sample products
│   │   ├── users.json           # Sample users  
│   │   ├── orders.json          # Sample orders
│   │   └── queries.json         # Sample queries
│   └── handlers/                # MSW handlers (optional)
├── prisma/                      # Database schema and seeds
│   ├── schema.prisma            # Database schema
│   └── seed/                    # Seed data files
├── tests/                       # Testing
│   ├── e2e/                     # Playwright E2E tests
│   └── unit/                    # Unit tests
├── stories/                     # Storybook component stories
├── docs/                        # Documentation
│   ├── README.md                # This file
│   ├── api.md                   # API documentation
│   ├── testing.md               # Testing guide
│   └── deploy.md                # Deployment guide
└── public/                      # Static assets
```

---

## 🚀 **Getting Started**

### **1. Setup Project**
```bash
cd "C:\Users\GigaByte\Desktop\china-wholesale-website-main\cart"
npm install
```

### **2. Initialize Next.js**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app
```

### **3. Install Dependencies**
```bash
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod zustand clsx react-hot-toast axios
```

### **4. Set Environment Variables**
Create `.env.local`:
```bash
NEXT_PUBLIC_USE_EXTERNAL_API=false
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-secret"
```

### **5. Start Development**
```bash
npm run dev
```

---

## 🔄 **API Switching Guide**

### **Phase 1: Mock Development**
```typescript
// .env.local
NEXT_PUBLIC_USE_EXTERNAL_API=false
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=

// API calls go to: /api/* (Next.js route handlers)
// Data comes from: mocks/data/*.json
```

### **Phase 2: External API**
```typescript
// .env.local  
NEXT_PUBLIC_USE_EXTERNAL_API=true
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=https://api.chinawholesale.com

// API calls go to: https://api.chinawholesale.com/*
// Data comes from: Your real API
```

### **Zero Code Changes Required**
The adapter pattern ensures components don't need to change:
```typescript
// This works with both mock and real APIs
import { getProducts } from '@/lib/adapters/products';

const products = await getProducts({ category: 'tea' });
```

---

## 🛠️ **Development Workflow**

### **Daily Development**
1. ✅ Check `TASK_TRACKER.md` for today's tasks
2. ✅ Write tests first (TDD approach)
3. ✅ Implement features using adapters
4. ✅ Test with mock data
5. ✅ Update documentation
6. ✅ Mark tasks complete

### **API Integration**
1. ✅ Develop with mocks first
2. ✅ Document expected API contract
3. ✅ Create adapter transformations
4. ✅ Test adapter with mock data
5. ✅ Switch to external API when ready
6. ✅ Verify adapter handles real data correctly

### **Testing Strategy**
```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Storybook (component testing)
npm run storybook

# Type checking
npm run typecheck

# Full test suite
npm run test:all
```

---

## 📚 **Key Files to Understand**

### **1. `lib/apiClient.ts`**
The heart of the system. All API calls go through here.
- Handles environment switching
- Provides retry logic
- Manages authentication
- Standardizes errors

### **2. `lib/endpoints.ts`**
Centralized API route definitions.
- No hard-coded URLs in components
- Easy to update when API changes
- Consistent parameter handling

### **3. `lib/adapters/*.ts`**
Domain-specific data transformation.
- Normalizes external API responses
- Provides consistent internal interfaces
- Handles business logic

### **4. `mocks/data/*.json`**
Realistic sample data for development.
- Mirrors real API structure
- Enables fast development
- Supports comprehensive testing

---

## 🧪 **Testing Your Progress**

### **Phase Checkpoints**
```bash
# Phase 1: Foundation ✅
npm run dev                    # App boots
npm run storybook             # Components render  
npm run test:unit             # Tests pass

# Phase 2: Customer Features ✅
# Test: Browse → Add to Cart → Checkout → Order History

# Phase 3: Admin Features ✅  
# Test: Admin Login → Manage Products → Process Orders

# Phase 4: Production Ready ✅
npm run build                 # Builds successfully
npm run test:e2e             # E2E tests pass
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**API Not Working?**
```typescript
// Check environment variables
console.log('Using external API:', process.env.NEXT_PUBLIC_USE_EXTERNAL_API);
console.log('API base URL:', process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL);
```

**Mock Data Not Loading?**
```bash
# Verify mock files exist
ls mocks/data/
cat mocks/data/products.json
```

**TypeScript Errors?**
```bash
# Check types
npm run typecheck

# Update dependencies
npm install @types/react @types/node --save-dev
```

---

## 📞 **Need Help?**

- **Architecture Questions**: See this README
- **API Documentation**: See `docs/api.md`  
- **Testing Help**: See `docs/testing.md`
- **Deployment Guide**: See `docs/deploy.md`
- **Component Stories**: Run `npm run storybook`

---

**🎯 Happy Coding! This architecture makes it easy to build, test, and deploy your ecommerce platform.** 🚀
