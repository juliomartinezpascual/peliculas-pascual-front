import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Action from "../pages/Action";
import Series from "../pages/Series";

export default function PublicRouters(){
    return (
        <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Movies />} path="/movies" />
            <Route element={<Series />} path="/series" />
            <Route element={<Action />} path="/action" />
        </Routes>
    )
}