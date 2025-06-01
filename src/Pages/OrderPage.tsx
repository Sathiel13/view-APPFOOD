import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

interface Order {
    _id: string;
    totalPrice: number;
    details: {
        email: string;
        name: string;
        city: string;
        address: string;
        phone: string;
    };
    orders: {
        name: string;
        price: number;
        quantity: number;
    }[];
    createdAt: string;
    restaurant: {
        restauranteName: string;
        city: string;
        country: string;
        imageUrl: string;
        deliveryPrice: number;
    };
    status?: string;
}

const OrdersPage: React.FC = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [orders, setOrders] = useState<Order[] | null>(null); // Manejar null como estado inicial
    const [isLoading, setIsLoading] = useState(false);

    // Estados posibles
    const statuses = ["preparando", "en camino", "entregado"];

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) {
                toast.error("Por favor, inicia sesión para ver tus órdenes.");
                return;
            }

            try {
                setIsLoading(true);

                const token = await getAccessTokenSilently();

                const response = await axios.get("http://localhost:3000/api/order", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                if (Array.isArray(response.data)) {
                    const ordersWithStatus = response.data.map((order) => ({
                        ...order,
                        status: "preparando", // Estado inicial para el frontend
                    }));
                    setOrders(ordersWithStatus);
                } else {
                    toast.error("Error inesperado al cargar las órdenes.");
                    console.error("La respuesta proporcionada no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener las órdenes:", error);
                toast.error(
                    "No pudimos cargar tus órdenes. Por favor, intenta nuevamente más tarde."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [getAccessTokenSilently, isAuthenticated]);

    useEffect(() => {
        // Cambiar automáticamente el estado cada 10 minutos
        const interval = setInterval(() => {
            setOrders((currentOrders) =>
                currentOrders?.map((order) => {
                    const currentIndex = statuses.indexOf(order.status || "preparando");
                    const nextStatus =
                        currentIndex < statuses.length - 1
                            ? statuses[currentIndex + 1]
                            : "entregado";

                    return { ...order, status: nextStatus };
                }) || []
            );
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, [statuses]);

    if (isLoading) {
        return <p className="text-center mt-10">Cargando tus órdenes...</p>;
    }

    if (!isAuthenticated) {
        return (
            <p className="text-center mt-10 text-red-500">
                Debes iniciar sesión para ver tus órdenes.
            </p>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <p className="text-center mt-10 text-gray-500">
                No tienes órdenes registradas.
            </p>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Tus Órdenes</h1>
            <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
                    >
                        {/* Información del restaurante */}
                        <div className="mb-4 flex items-center">
                            <img
                                src={order.restaurant?.imageUrl || "https://via.placeholder.com/150"}
                                alt={order.restaurant?.restauranteName || "Restaurante"}
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <div>
                                <h2 className="text-lg font-bold">{order.restaurant?.restauranteName || "N/A"}</h2>
                                <p className="text-gray-500">
                                    {order.restaurant?.city || "N/A"}, {order.restaurant?.country || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Mostrar estado del pedido */}
                        <p className="text-sm text-blue-500 font-semibold">
                            Estado: {order.status}
                        </p>



                        <div className="mb-4">
                            <p className="font-bold text-lg">Detalles de Envío:</p>
                            <p>
                                <strong>Nombre:</strong> {order.details.name}
                            </p>
                            <p>
                                <strong>Correo:</strong> {order.details.email}
                            </p>
                            <p>
                                <strong>Dirección:</strong> {order.details.city},{" "}
                                {order.details.address}
                            </p>
                            <p>
                                <strong>Teléfono:</strong> {order.details.phone}
                            </p>
                        </div>

                        <p className="text-lg font-bold">Total: ${order.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                            Costo de envío: ${order.restaurant.deliveryPrice.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;