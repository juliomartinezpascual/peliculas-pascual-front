import { Link } from "react-router-dom"

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src="/src/assets/images/logo.png" alt="Logo" width="120" height="48" class="d-inline-block align-text-top" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <Link to="/" className="nav-item nav-link">
              Inicio
            </Link>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Explorar
              </a>
              <ul className="dropdown-menu">
                <Link to="/movies" className="nav-item nav-link">
                   Peliculas
                </Link>
                <Link to="/action" className="nav-item nav-link">
                   Acciòn
                </Link>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <Link to="/series" className="nav-item nav-link">
                   Series
                </Link>
    
              </ul>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default Nav