import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './components/NewApp'
import 'bootstrap/dist/css/bootstrap.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>,
)