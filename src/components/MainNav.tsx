import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UserNameMenu from "./UserNameMenu";
import { useNavigate } from "react-router-dom";

export default function MainNav() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    return (
        <span className="flex space-x-4 items-center">
            {isAuthenticated ? (
                <>
                    {/* Botón "Órdenes" para usuarios autenticados */}
                    <Button
                        variant="ghost"
                        className="font-bold hover:text-orange-500 hover:bg-white"
                        onClick={() => navigate("/orders")}
                    >
                        Órdenes
                    </Button>

                    {/* Menú del usuario */}
                    <UserNameMenu />
                </>
            ) : (
                <Button
                    variant="ghost"
                    className="font-bold hover:text-orange-500 hover:bg-white"
                    onClick={async () => await loginWithRedirect()}
                >
                    Log In
                </Button>
            )}
        </span>
    );
}