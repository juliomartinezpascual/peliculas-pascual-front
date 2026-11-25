import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    clearSession,
    getStoredUser,
    getToken,
    setSession
} from "../services/api";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => getToken());
    const [usuario, setUsuario] = useState(() => getStoredUser());
    const [booting, setBooting] = useState(Boolean(getToken()));

    const applySession = useCallback((nextToken, nextUsuario) => {
        setSession(nextToken, nextUsuario);
        setToken(nextToken);
        setUsuario(nextUsuario);
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setToken(null);
        setUsuario(null);
    }, []);

    // Validar sesión al cargar si hay token
    useEffect(() => {
        let cancelled = false;

        async function hydrate() {
            if (!getToken()) {
                setBooting(false);
                return;
            }
            try {
                const me = await authService.getMe();
                if (!cancelled) {
                    setUsuario(me);
                    setSession(getToken(), me);
                }
            } catch {
                if (!cancelled) {
                    logout();
                }
            } finally {
                if (!cancelled) setBooting(false);
            }
        }

        hydrate();
        return () => {
            cancelled = true;
        };
    }, [logout]);

    // 401 global → cerrar sesión y mandar a login
    useEffect(() => {
        function onUnauthorized() {
            logout();
            navigate("/login", { replace: true, state: { from: "expired" } });
        }
        window.addEventListener("auth:unauthorized", onUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
    }, [logout, navigate]);

    const login = useCallback(
        async (email, password) => {
            const data = await authService.login(email, password);
            applySession(data.token, data.usuario);
            return data;
        },
        [applySession]
    );

    const register = useCallback(
        async (payload) => {
            const data = await authService.register(payload, { asAdmin: false });
            applySession(data.token, data.usuario);
            return data;
        },
        [applySession]
    );

    const value = useMemo(
        () => ({
            token,
            usuario,
            booting,
            isAuthenticated: Boolean(token && usuario),
            isAdmin: usuario?.rol === "admin",
            isOperario: usuario?.rol === "operario",
            // Permisos géneros (alineados al API)
            canCreateGenero: usuario?.rol === "admin" || usuario?.rol === "operario",
            canUpdateGenero: usuario?.rol === "admin",
            canToggleGenero: usuario?.rol === "admin",
            canDeleteGenero: usuario?.rol === "admin",
            login,
            register,
            logout
        }),
        [token, usuario, booting, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return ctx;
}
