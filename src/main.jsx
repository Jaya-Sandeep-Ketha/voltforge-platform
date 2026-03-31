/**
 * Main application entry point for VoltForge
 * 
 * This file serves as the root of the React application, initializing
 * the app and mounting it to the DOM. VoltForge is a comprehensive
 * energy management platform for monitoring and controlling distributed
 * energy assets.
 * 
 * @author VoltForge Team
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from '@/app/Router';
import '@/styles/index.css';

/**
 * Create and render the React application root
 * 
 * Uses React 18's createRoot API for better performance and concurrent features.
 * The app is wrapped in React.StrictMode to highlight potential problems
 * during development.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
