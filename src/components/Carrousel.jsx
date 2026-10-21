function Carrousel() {
    return (
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <svg aria-label="Placeholder: First slide"
              className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" height="400"
              preserveAspectRatio="xMidYMid slice" role="img" width="800" xmlns="http://www.w3.org/2000/svg">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#555"
                dy=".3em">First slide</text>
            </svg>
          </div>
          <div className="carousel-item">
            <svg aria-label="Placeholder: Second slide"
              className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" height="400"
              preserveAspectRatio="xMidYMid slice" role="img" width="800" xmlns="http://www.w3.org/2000/svg">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#666"></rect><text x="50%" y="50%" fill="#444"
                dy=".3em">Second slide</text>
            </svg>
          </div>
          <div className="carousel-item">
            <svg aria-label="Placeholder: Third slide"
              className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" height="400"
              preserveAspectRatio="xMidYMid slice" role="img" width="800" xmlns="http://www.w3.org/2000/svg">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#555"></rect><text x="50%" y="50%" fill="#333"
                dy=".3em">Third slide</text>
            </svg>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    )

}

export default Carrousel