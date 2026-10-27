import { Route, Routes } from "react-router-dom";
import Generos from "../pages/Generos";
import Directores from "../pages/Directores";
import Productoras from "../pages/Productoras";
import Tipos from "../pages/Tipos";
import Media from "../pages/Media";

export default function PrivateRouters() {
    return (
        <Routes>
            <Route path="/generos" element={<Generos />} />
            <Route path="/directores" element={<Directores />} />
            <Route path="/productoras" element={<Productoras />} />
            <Route path="/tipos" element={<Tipos />} />
            <Route path="/media" element={<Media />} />
        </Routes>
    );
}
