import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react"
import './App.css'
import App from './App.tsx'

// Setup Buffer polyfill for @react-pdf/renderer
if (typeof window !== 'undefined') {
  import('buffer').then((bufferModule) => {
    const Buffer = bufferModule.Buffer
      ; (window as any).Buffer = Buffer
      ; (globalThis as any).Buffer = Buffer
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
