# To run 

```bash
npm create vite@latest text-simplifier -- --template react-ts
cd text-simplifier
# Install base dependencies
npm install

# Install shadcn/ui and its dependencies
npm install @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-slider lucide-react class-variance-authority clsx tailwind-merge @hookform/resolvers

# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


# Initialize shadcn/ui
npx shadcn@latest init

# Add required components
npx shadcn@latest add button card select alert slider

npm run dev
```