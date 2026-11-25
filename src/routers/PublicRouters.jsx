import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Action from "../pages/Action";
import Series from "../pages/Series";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function PublicRouters() {
    return (
        <>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/action" element={<Action />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </>
    );
}
