# Copilot Instructions for E-commerce Admin Panel

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern, responsive admin panel for an e-commerce platform designed specifically for store managers and administrators. The application is built using:

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library for consistent UI components
- **React Router DOM** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## Architecture and Patterns

### Component Structure
- Use functional components with React hooks
- Follow the component/page separation pattern
- Implement responsive design with mobile-first approach
- Use TypeScript interfaces for all props and data structures

### Styling Guidelines
- Use Tailwind CSS utility classes for styling
- Follow the design system defined in `src/index.css` with CSS custom properties
- Implement responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Use the `cn()` utility function from `src/lib/utils.ts` for conditional classes

### UI Components
- Utilize shadcn/ui components from `src/components/ui/`
- Follow the established component API patterns
- Maintain consistent spacing and typography scales
- Implement proper accessibility attributes

### Data Management
- Use mock data for demonstrations
- Structure data to reflect real e-commerce scenarios
- Include product management, customer information, orders, and financial data
- Implement proper TypeScript interfaces for all data structures

## Feature Focus Areas

### Product Management
- Product listings with detailed information
- Stock tracking (In Stock, Low Stock, Out of Stock)
- Product categories (Electronics, Clothing, Books, etc.)
- Image placeholders and media management

### Dashboard Analytics
- Revenue tracking and visualization
- Product performance metrics
- Customer and order statistics
- Interactive charts using Recharts

### Responsive Design
- Mobile-first approach for all components
- Collapsible sidebar for mobile devices
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Store Manager Workflow
- Focus on e-commerce admin use cases
- Customer management and communication
- Order and inventory management
- Financial tracking and reporting

## Code Quality Standards
- Use proper TypeScript typing
- Implement error boundaries where appropriate
- Follow React best practices for performance
- Use semantic HTML elements
- Implement proper loading states and error handling

## Design System
- Follow the color scheme defined in CSS custom properties
- Use consistent spacing scale (Tailwind's spacing system)
- Implement proper contrast ratios for accessibility
- Use the established icon set from Lucide React
