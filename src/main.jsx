import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import './assets/bootstrap-5.3.8-dist/css/bootstrap.min.css'
import './assets/bootstrap-icons-1.13.1/bootstrap-icons.css'
import * as bootstrap from './assets/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js'

window.bootstrap = bootstrap

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
