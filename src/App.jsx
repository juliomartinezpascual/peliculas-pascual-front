import Cards from "./components/Cards"
import Carrousel from "./components/Carrousel"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PublicRouters from "./routers/PublicRouters"
import PrivateRouters from "./routers/PrivateRouters"


function App() {
  return (
    <>
      <Nav />
      <Carrousel />
      <main className="container">
        <PublicRouters />
        <PrivateRouters />
        <Cards />
        <Footer />
      </main>
    </>
  )
}

export default App
