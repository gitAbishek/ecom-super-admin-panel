# Room Rental Admin Panel

A modern, responsive admin panel for managing room rental properties, specifically designed for house owners and property managers.

## Features

- **📊 Dashboard**: Comprehensive overview with analytics and key metrics
- **🏠 Property Management**: Add, edit, and manage property listings
- **👥 Tenant Management**: Track tenant information and lease details
- **📅 Booking System**: Manage bookings and reservations
- **💰 Financial Tracking**: Revenue analytics and payment management
- **📱 Responsive Design**: Mobile-first approach for all devices
- **🌙 Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router DOM** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── Dashboard.tsx   # Dashboard page component
│   └── Products.tsx  # Products page component
├── lib/                # Utility functions
│   └── utils.ts       # Common utilities (cn function)
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind directives
```

## Design System

The application uses a custom design system built on top of Tailwind CSS with CSS custom properties for theming. The color palette supports both light and dark modes.

## Responsive Design

The admin panel is built with a mobile-first approach:
- **Mobile**: Collapsible sidebar, touch-friendly interactions
- **Tablet**: Optimized layouts for medium screens
- **Desktop**: Full sidebar navigation and multi-column layouts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
