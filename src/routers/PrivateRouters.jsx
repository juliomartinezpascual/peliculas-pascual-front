import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Generos from "../pages/Generos";
import Directores from "../pages/Directores";
import Productoras from "../pages/Productoras";
import Tipos from "../pages/Tipos";
import Media from "../pages/Media";

function Guard({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function PrivateRouters() {
    return (
        <>
            <Route path="/generos" element={<Guard><Generos /></Guard>} />
            <Route path="/directores" element={<Guard><Directores /></Guard>} />
            <Route path="/productoras" element={<Guard><Productoras /></Guard>} />
            <Route path="/tipos" element={<Guard><Tipos /></Guard>} />
            <Route path="/media" element={<Guard><Media /></Guard>} />
        </>
    );
}
