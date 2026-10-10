import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './portal.css'

createRoot(document.getElementById('portal')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
