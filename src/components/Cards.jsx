import Card from "./Card"

function Cards() {
    return (
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <div class="col">
            <div class="card">
              <a href="https://cuevana3l.pro/pelicula/untold-mr-t-i-pity-the-fool" target="_blank">
                <img src="/src/assets/images/2.webp" class="card-img-top" alt="..." />
              </a>
              <div class="card-body">
                <h5 class="card-title">Untold Mr. T: I Pity the Fool</h5>
                <p class="card-text">Pelìcula de Mario B.</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <img src="/src/assets/images/3.webp" class="card-img-top" alt="..." />

                <div class="card-body">
                  <h5 class="card-title">Moana II</h5>
                  <p class="card-text">Moana...</p>
                </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="140"
                preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6"
                  dy=".3em">Image cap</text>
              </svg>
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer.</p>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Cards