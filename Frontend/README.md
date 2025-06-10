# Task Management System - Frontend Dependencies

This document outlines all the necessary dependencies for the frontend of the Task Management System.

## Installation Guide

You can install dependencies either category by category or all at once.

### Complete Installation Command
```bash
npm install react react-dom @reduxjs/toolkit react-redux react-router-dom axios @mui/material @emotion/react @emotion/styled formik yup mdb-react-ui-kit react-bootstrap bootstrap @fortawesome/fontawesome-free lucide-react @mui/icons-material react-chartjs-2 chart.js file-saver xlsx html2canvas jspdf socket.io-client date-fns && npm install -D vite @vitejs/plugin-react @types/react @types/react-dom sass
```

### Category-wise Installation

#### 1. Core Dependencies
```bash
npm install react react-dom
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install @mui/material @emotion/react @emotion/styled
npm install formik yup
```

**Purpose**:
- React & React DOM: Core React library
- Redux Toolkit & React-Redux: State management
- React Router DOM: Application routing
- Axios: HTTP client for API requests
- MUI & Emotion: UI component library and styling
- Formik & Yup: Form handling and validation

#### 2. UI and Styling Libraries
```bash
npm install mdb-react-ui-kit
npm install react-bootstrap bootstrap
npm install @fortawesome/fontawesome-free
npm install lucide-react
npm install @mui/icons-material
```

**Purpose**:
- MDB React UI Kit: Material Design components
- React Bootstrap: Responsive UI components
- Font Awesome: Icon library
- Lucide React: Modern icon set
- MUI Icons: Material Design icons

#### 3. Data Visualization
```bash
npm install react-chartjs-2 chart.js
```

**Purpose**:
- Chart.js & React-Chartjs-2: Interactive charts and graphs

#### 4. File Operations and Export Features
```bash
npm install file-saver
npm install xlsx
npm install html2canvas
npm install jspdf
```

**Purpose**:
- File-Saver: File download functionality
- XLSX: Excel file handling
- HTML2Canvas: Screenshot functionality
- jsPDF: PDF generation

#### 5. Real-time Features and Date Handling
```bash
npm install socket.io-client
npm install date-fns
```

**Purpose**:
- Socket.io-client: Real-time communication
- Date-fns: Date manipulation and formatting

#### 6. Development Dependencies
```bash
npm install -D vite @vitejs/plugin-react
npm install -D @types/react @types/react-dom
npm install -D sass
```

**Purpose**:
- Vite: Build tool and development server
- React Types: TypeScript definitions
- Sass: Advanced CSS preprocessing

## Project Structure

The frontend is organized into the following main directories:
- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/store`: Redux store configuration and slices
- `src/services`: API service integrations
- `src/utils`: Utility functions and helpers
- `src/styles`: Global styles and theme configuration

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## Note

Make sure to run these installations in the Frontend directory of your project. If you encounter any issues with peer dependencies, you may need to use the `--force` flag or resolve the conflicts manually. 