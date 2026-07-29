import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')!

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Prerendered pages ship with markup already in #root, so hydrate those and
// only mount from scratch in dev or on the client-only 404 shell.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
