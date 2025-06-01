import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Notificaciones

const PaymentPage: React.FC = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvc, setCVC] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handlePayment = (event: React.FormEvent) => {
        event.preventDefault();

        // Validaciones básicas
        if (!nameOnCard || !cardNumber || !expiration || !cvc) {
            toast.error("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (cardNumber.replace(/\s/g, "").length !== 16) {
            toast.error("El número de tarjeta debe tener 16 dígitos.");
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiration)) {
            toast.error("La fecha de expiración debe estar en el formato MM/YY.");
            return;
        }

        if (cvc.length !== 3) {
            toast.error("El CVC debe tener 3 dígitos.");
            return;
        }

        setIsProcessing(true);

        // Simular un retraso de procesamiento del pago
        setTimeout(() => {
            setIsProcessing(false);
            toast.success("Pago procesado exitosamente. Gracias por tu compra.");
            navigate("/order-confirmation"); // Redirigir a la página de confirmación
        }, 3000);
    };

    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Página de Pago</h1>
            <form onSubmit={handlePayment} className="space-y-6">
                {/* Nombre en la tarjeta */}
                <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
                        Nombre en la Tarjeta
                    </label>
                    <input
                        type="text"
                        id="nameOnCard"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        className="block w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
                        placeholder="Ej. Juan Pérez"
                        required
                    />
                </div>

                {/* Número de tarjeta */}
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Número de Tarjeta
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                            // Formato automático: XXXX XXXX XXXX XXXX
                            setCardNumber(
                                e.target.value.replace(/[^\d]/g, "").replace(/(\d{4})/g, "$1 ").trim()
                            );
                        }}
                        className="block w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>

                {/* Fecha de expiración y CVC */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                            Fecha de Expiración
                        </label>
                        <input
                            type="text"
                            id="expiration"
                            maxLength={5}
                            value={expiration}
                            onChange={(e) => {
                                // Formato automático: MM/YY
                                setExpiration(
                                    e.target.value
                                        .replace(/[^\d]/g, "")
                                        .replace(/(\d{2})(\d{2})/, "$1/$2")
                                );
                            }}
                            className="block w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                            CVC
                        </label>
                        <input
                            type="text"
                            id="cvc"
                            maxLength={3}
                            value={cvc}
                            onChange={(e) => setCVC(e.target.value)}
                            className="block w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
                            placeholder="123"
                            required
                        />
                    </div>
                </div>

                {/* Botón de pago */}
                <button
                    type="submit"
                    className={`w-full py-3 text-white font-semibold rounded-md shadow-md transition ${
                        isProcessing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Procesando Pago..." : "Pagar"}
                </button>
            </form>

            {/* Seguridad */}
            <div className="mt-6 text-center text-gray-600 text-sm">
                <p>
                    <strong>Transacción Segura:</strong> Los datos de tu tarjeta no serán almacenados.
                </p>
                <p className="mt-2">Simulación de pago elaborada para propósitos educativos.</p>
            </div>
        </div>
    );
};

export default PaymentPage;