# PriceCompare Global Frontend

This is the frontend application for PriceCompare Global, built with React and Vite.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Server

To start the development server:
```bash
pnpm run dev
```
The application will be available at `http://localhost:5173`.

### Build for Production

To build the application for production:
```bash
pnpm run build
```
The production-ready files will be generated in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── public/                   # Static assets
├── src/                      # Source code
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page components
│   ├── lib/                  # Utility functions and API client
│   ├── i18n/                 # Internationalization files
│   └── styles/               # Global styles
├── .env.example              # Example environment variables
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory based on `.env.example`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

- `VITE_API_BASE_URL`: The base URL for the backend API. Change this to your deployed backend URL in production.

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is located in `tailwind.config.js`.

## 🌍 Internationalization (i18n)

Multi-language support is implemented using `i18next` and `react-i18next`. Translation files are located in `src/i18n/`.

## 📞 Support

For any issues or questions, please refer to the main project README or contact support.


