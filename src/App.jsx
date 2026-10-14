import Cards from "./components/Cards"
import Carrousel from "./components/Carrousel"
import Footer from "./components/Footer"
import Nav from "./components/Nav"


function App() {

  return (
    <>
      <Nav />
      <Carrousel />
      <main class="container">
        <h3>Peliculas Pascual B</h3>
        <Cards />
        <Footer />
      </main>
    </>
  )
}

export default App
