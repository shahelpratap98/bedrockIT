import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

export default function App() {
  // BASE_URL is "/" unless a subpath build set it (see build:pages).
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}
