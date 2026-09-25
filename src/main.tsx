import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import { store } from '@/lib/store'
import { ThemeSync } from '@/lib/theme'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeSync />
        {/* Lifted above the mobile action bar (MobileActionBar); harmless spacing on desktop. */}
        <Toaster offset={{ bottom: 88 }} mobileOffset={{ bottom: 88 }} />
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
