import React, { useState } from "react";
import { useGetRestaurantById } from "@/api/RestaurantApi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

interface Order {
    name: string;
    price: number;
    quantity: number;
}

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { restaurant, isLoading } = useGetRestaurantById(id || "");
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0(); // Usar Auth0 hook para el token JWT
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        city: "",
        address: "",
        phone: "",
    });

    if (isLoading) {
        return <p className="text-center">Cargando detalles del restaurante...</p>;
    }

    if (!restaurant) {
        return <p className="text-center">No se encontraron los detalles del restaurante.</p>;
    }

    const handleAddOrder = (item: { name: string; price: number }) => {
        setSelectedOrders((prevOrders) => {
            const existingOrderIndex = prevOrders.findIndex((order) => order.name === item.name);

            if (existingOrderIndex >= 0) {
                const updatedOrders = [...prevOrders];
                updatedOrders[existingOrderIndex].quantity += 1;
                return updatedOrders;
            }

            return [...prevOrders, { ...item, quantity: 1 }];
        });
    };

    const handleRemoveOrder = (indexToRemove: number) => {
        setSelectedOrders((prevOrders) =>
            prevOrders
                .map((order, index) =>
                    index === indexToRemove
                        ? order.quantity > 1
                            ? { ...order, quantity: order.quantity - 1 }
                            : null
                        : order
                )
                .filter((order) => order !== null) as Order[]
        );
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Función para enviar la orden al backend y redirigir al flujo de pago
    const handleSubmitOrder = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedOrders.length === 0) {
            toast.error("No hay órdenes para confirmar.");
            return;
        }

        const emptyFields = Object.entries(formData).filter(([, value]) => !value);
        if (emptyFields.length > 0) {
            toast.error("Por favor, completa todos los campos del formulario.");
            return;
        }

        try {
            const token = await getAccessTokenSilently();

            const requestBody = {
                restaurantId: id,
                orders: selectedOrders.map((order) => ({
                    name: order.name,
                    price: Number(order.price),
                    quantity: order.quantity,
                })),
                details: formData,
                totalPrice: selectedOrders.reduce(
                    (total, order) => total + Number(order.price) * order.quantity,
                    0
                ),
            };

            await axios.post("http://localhost:3000/api/order", requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Orden creada exitosamente.");
            setShowForm(false);
            setSelectedOrders([]);
            navigate(`/stripe-payment`); // Redirigir a la pagina de pago
        } catch (error) {
            console.error("Error al enviar la orden:", error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || "Hubo un error al crear la orden. Inténtalo de nuevo.";
            toast.error(errorMessage); // Notificación de error
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{restaurant.restauranteName}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <img
                    className="w-full max-w-lg mx-auto mb-4 rounded-lg shadow-md"
                    src={restaurant.imageUrl || "https://via.placeholder.com/500"}
                    alt={restaurant.restauranteName}
                />
                <div>
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-2">Detalles del Restaurante</h2>
                        <p className="text-lg font-bold">{restaurant.restauranteName}</p>
                        <p className="text-gray-700"><strong>Ubicación:</strong> {"Sin ubicación"}</p>
                        <ul className="list-disc ml-5 text-gray-700">
                            {restaurant.cuisines.map((cuisine, index) => (
                                <li key={index}>{cuisine}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 md:mb-6">
                        <h2 className="text-xl font-semibold mb-2">Menú</h2>
                        <ul>
                            {restaurant.menuItems.map((item) => (
                                <li
                                    key={item._id}
                                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                    onClick={() => handleAddOrder({ name: item.name, price: item.price })}
                                >
                                    <span>{item.name}</span>
                                    <span className="font-bold">${item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-2">Órdenes Seleccionadas</h2>
                        {selectedOrders.length === 0 ? (
                            <p className="text-gray-500">No hay órdenes seleccionadas</p>
                        ) : (
                            <ul>
                                {selectedOrders.map((order, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-gray-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span>{order.name}</span>
                                            <span className="text-gray-500">x{order.quantity}</span>
                                            <span className="font-bold">${order.price * order.quantity}</span>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700 transition"
                                            onClick={() => handleRemoveOrder(index)}
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            className={`mt-4 w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md transition ${
                                selectedOrders.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                            }`}
                            disabled={selectedOrders.length === 0}
                            onClick={() => setShowForm(true)}
                        >
                            Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-semibold mb-4">Detalles del Comprador</h2>
                        <form onSubmit={handleSubmitOrder}>
                            {["email", "name", "city", "address", "phone"].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label
                                        className="block text-gray-700 font-semibold mb-2"
                                        htmlFor={field}
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type={field === "email" ? "email" : "text"}
                                        id={field}
                                        name={field}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                                        value={formData[field as keyof typeof formData]}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPage;