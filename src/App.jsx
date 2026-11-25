import { Routes, useLocation } from "react-router-dom"
import Cards from "./components/Cards"
import Carrousel from "./components/Carrousel"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PublicRouters from "./routers/PublicRouters"
import PrivateRouters from "./routers/PrivateRouters"

const AUTH_PATHS = ["/login", "/register"]
const ADMIN_PATHS = ["/generos", "/directores", "/productoras", "/tipos", "/media"]

function App() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_PATHS.includes(pathname)
  const isAdminPage = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  const showMarketing = !isAuthPage && !isAdminPage

  return (
    <>
      <Nav />
      {showMarketing && <Carrousel />}
      <main className="container">
        <Routes>
          {PublicRouters()}
          {PrivateRouters()}
        </Routes>
        {showMarketing && <Cards />}
        <Footer />
      </main>
    </>
  )
}

export default App
