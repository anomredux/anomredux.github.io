import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LocaleProvider } from './components/locale-provider'
import { App } from './App'
import './styles/global.css'

// Register GSAP plugins once at the app root
gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </HashRouter>
  </StrictMode>,
)
