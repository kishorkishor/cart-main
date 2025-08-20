# 🚀 Quick Start Guide - China Wholesale Ecommerce Platform

## 📋 **Pre-requisites**
- [ ] Node.js 18.17 or later
- [ ] npm or yarn package manager
- [ ] Git for version control
- [ ] Code editor (VS Code recommended)

## ⚡ **Quick Setup (5 minutes)**

### 1. Install Dependencies
```bash
cd "C:\Users\GigaByte\Desktop\china-wholesale-website-main\cart"
npm install
```

### 2. Initialize Next.js Project
```bash
# If starting fresh, run this:
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false

# Answer the prompts:
# ✔ Would you like to use TypeScript? ... Yes
# ✔ Would you like to use ESLint? ... Yes  
# ✔ Would you like to use Tailwind CSS? ... Yes
# ✔ Would you like to use `src/` directory? ... No
# ✔ Would you like to use App Router? ... Yes
# ✔ Would you like to customize the default import alias (@/*)? ... Yes
```

### 3. Install Additional Dependencies
```bash
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod zustand clsx react-hot-toast date-fns recharts axios
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio prettier eslint-config-prettier
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

---

## 📁 **Project Structure Setup**

### Create Directory Structure
```bash
# Main directories
mkdir -p app/(admin) app/(customer) app/(auth) app/api
mkdir -p components/admin components/customer components/ui components/forms
mkdir -p lib hooks types public/images docs

# Admin panel subdirectories
mkdir -p app/(admin)/dashboard app/(admin)/products app/(admin)/orders app/(admin)/customers app/(admin)/analytics app/(admin)/settings

# Customer panel subdirectories  
mkdir -p app/(customer)/dashboard app/(customer)/cart app/(customer)/wishlist app/(customer)/orders app/(customer)/account app/(customer)/checkout

# Auth subdirectories
mkdir -p app/(auth)/login app/(auth)/register app/(auth)/forgot-password

# API subdirectories
mkdir -p app/api/auth app/api/products app/api/orders app/api/customers app/api/admin
```

---

## 🎨 **Configure China Wholesale Theme**

### 1. Update tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E3431F',     // China Wholesale Orange
          secondary: '#000000',   // Deep Black  
          accent: '#F2F2F2',      // Neutral Gray
          background: '#FFFFFF',  // Clean White
        },
        // Add more colors as needed
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'), 
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### 2. Update app/globals.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';  
@import 'tailwindcss/utilities';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

@layer base {
  body {
    @apply bg-brand-background text-brand-secondary font-sans antialiased;
  }
  h1,h2,h3,h4,h5,h6 {
    @apply font-heading font-bold text-brand-secondary;
  }
}

@layer components {
  .btn-primary {
    @apply bg-brand-primary text-white hover:bg-opacity-90 px-6 py-3 rounded-lg font-medium transition-all;
  }
  .card {
    @apply bg-white rounded-xl shadow-lg border border-gray-100 p-6;
  }
}
```

---

## 🔧 **Environment Setup**

### 1. Create .env.local
```env
# Database
DATABASE_URL="your-database-url"

# Authentication  
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Payment Gateways
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587" 
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"  
CLOUDINARY_API_SECRET="your-api-secret"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 2. Create .env.example
```env
# Copy .env.local and remove sensitive values
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
# ... etc
```

---

## 📋 **Development Workflow**

### Daily Development Checklist
- [ ] Pull latest changes: `git pull origin main`
- [ ] Install new dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Check for TypeScript errors: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Test functionality manually
- [ ] Commit changes: `git add . && git commit -m "feature: description"`
- [ ] Push changes: `git push origin feature-branch`

### Weekly Progress Review
- [ ] Review completed tasks in PROJECT_ROADMAP.md
- [ ] Update task status (mark completed items)
- [ ] Plan next week's priorities
- [ ] Test deployed features
- [ ] Update documentation

---

## 🧪 **Testing Your Progress**

### Feature Testing Checklist

#### ✅ **Phase 1: Foundation** 
- [ ] Project runs without errors
- [ ] Theme colors display correctly
- [ ] Navigation works
- [ ] Basic layout renders

#### ✅ **Phase 2: Customer Features**
- [ ] User can register/login
- [ ] Product catalog loads
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Order history displays

#### ✅ **Phase 3: Admin Features**  
- [ ] Admin login works
- [ ] Dashboard analytics display
- [ ] Product management functions
- [ ] Order management works
- [ ] Customer data shows

#### ✅ **Phase 4: Advanced Features**
- [ ] Search functionality works
- [ ] Recommendations display
- [ ] Mobile responsive
- [ ] Performance is good
- [ ] Security measures active

---

## 🚀 **Deployment Options**

### Quick Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and your app will be live!
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Drag and drop the .next folder to Netlify
# Or connect your Git repository
```

### Deploy to DigitalOcean App Platform
- Connect your GitHub repository
- Configure build settings
- Deploy with one click

---

## 📞 **Need Help?**

### Common Issues & Solutions

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

#### TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Fix common issues by updating types
npm install @types/react @types/node --save-dev
```

#### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run dev

# Check if Tailwind config is correct
```

### Resources
- **Documentation**: See PROJECT_ROADMAP.md for detailed features
- **Issues**: Create GitHub issues for bugs
- **Questions**: Email dev@chinawholesale.com
- **Updates**: Check repository for latest changes

---

## 🎯 **Next Steps**

After setup, start with:

1. **✅ Week 1**: Basic project structure and theme setup
2. **✅ Week 2**: User authentication and basic routing  
3. **✅ Week 3**: Product catalog and cart functionality
4. **✅ Week 4**: Customer dashboard and order management
5. **✅ Week 5**: Admin panel and basic management features

**Happy coding! 🎉**
