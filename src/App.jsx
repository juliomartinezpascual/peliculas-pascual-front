import Cards from "./components/Cards"
import Carrousel from "./components/Carrousel"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PublicRouters from "./routers/PublicRouters"


function App() {
  return (
    <>
      <Nav />
      <Carrousel />
      <main className="container">
        <PublicRouters />
        <Cards />
        <Footer />
      </main>
    </>
  )
}

export default App
