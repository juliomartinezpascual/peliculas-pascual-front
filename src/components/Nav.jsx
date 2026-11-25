import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/images/logo.png"
import { useAuth } from "../context/AuthContext"

function Nav() {
  const { isAuthenticated, usuario, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="120" height="48" className="d-inline-block align-text-top" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Explorar
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/movies" className="dropdown-item">
                    Películas
                  </Link>
                </li>
                <li>
                  <Link to="/action" className="dropdown-item">
                    Acción
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/series" className="dropdown-item">
                    Series
                  </Link>
                </li>
              </ul>
            </li>
            {isAuthenticated && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <i className="bi bi-gear-fill me-1"></i> Administración
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/generos" className="dropdown-item">
                      <i className="bi bi-tags me-2"></i> Géneros
                    </Link>
                  </li>
                  <li>
                    <Link to="/directores" className="dropdown-item">
                      <i className="bi bi-person-video2 me-2"></i> Directores
                    </Link>
                  </li>
                  <li>
                    <Link to="/productoras" className="dropdown-item">
                      <i className="bi bi-building me-2"></i> Productoras
                    </Link>
                  </li>
                  <li>
                    <Link to="/tipos" className="dropdown-item">
                      <i className="bi bi-collection-play me-2"></i> Tipos
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link to="/media" className="dropdown-item">
                      <i className="bi bi-film me-2"></i> Media
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text small me-lg-2">
                    <i className="bi bi-person-circle me-1"></i>
                    {usuario?.nombre}
                    <span className={`badge ms-2 ${isAdmin ? "text-bg-danger" : "text-bg-secondary"}`}>
                      {usuario?.rol}
                    </span>
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-primary btn-sm me-lg-1">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <i className="bi bi-person-plus me-1"></i>
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav
