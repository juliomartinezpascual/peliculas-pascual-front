import Card from "./Card"

function Cards() {
    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <div className="col">
            <div className="card">
              <a href="https://cuevana3l.pro/pelicula/untold-mr-t-i-pity-the-fool" target="_blank">
                <img src="/src/assets/images/2.webp" className="card-img-top" alt="..." />
              </a>
              <div className="card-body">
                <h5 className="card-title">Untold Mr. T: I Pity the Fool</h5>
                <p className="card-text">Pelìcula de Mario B.</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img src="/src/assets/images/3.webp" className="card-img-top" alt="..." />

                <div className="card-body">
                  <h5 className="card-title">Moana II</h5>
                  <p className="card-text">Moana...</p>
                </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <svg aria-label="Placeholder: Image cap" className="bd-placeholder-img card-img-top" height="140"
                preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6"
                  dy=".3em">Image cap</text>
              </svg>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a longer card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer.</p>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Cards