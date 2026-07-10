import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

const App = lazy(() => import('./App.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy-client-id"}>
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
        {isAdmin ? <AdminApp /> : <App />}
      </Suspense>
    </GoogleOAuthProvider>
  </StrictMode>,
)
