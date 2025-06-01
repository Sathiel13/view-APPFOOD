import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './Pages/HomePage';
import AuthCallBackPage from './Pages/AuthCallBackPage';
import UserProfilePage from './Pages/UserProfilePage';
import ProtectedRoute from './auth/ProtectedRoute';
import ManageRestaurantPage from './Pages/ManageRestaurantPage';
import SearchPage from './Pages/SearchPage';
import DetailPage from './Pages/DetailPage';
import PaymentPage from "./Pages/PaymentPage";

import OrderPage from "./Pages/OrderPage"; // Importación de la página de órdenes

const AppRoutes = () => {
    return (
        <Routes>
            {/* Página de inicio */}
            <Route
                path='/'
                element={
                    <Layout showHero={true}>
                        <HomePage />
                    </Layout>
                }
            />

            {/* Ruta de autenticación */}
            <Route path='/auth-callback' element={<AuthCallBackPage />} />

            {/* Página de búsqueda */}
            <Route
                path="/search/:city"
                element={
                    <Layout showHero={false}>
                        <SearchPage />
                    </Layout>
                }
            />

            {/* Página de detalles del restaurante */}
            <Route
                path="/restaurantes/:id"
                element={
                    <Layout>
                        <DetailPage />
                    </Layout>
                }
            />

            {/* Página de pago */}
            <Route
                path="/stripe-payment"
                element={
                    <Layout>
                        <PaymentPage />
                    </Layout>
                }
            />

            {/* Nueva Ruta: Órdenes */}
            <Route
                path="/orders"
                element={
                    <Layout>
                        <OrderPage />
                    </Layout>
                }
            />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path='/user-profile'
                    element={
                        <Layout>
                            <UserProfilePage />
                        </Layout>
                    }
                />
                <Route
                    path='/manage-restaurant'
                    element={
                        <Layout>
                            <ManageRestaurantPage />
                        </Layout>
                    }
                />
            </Route>

            {/* Ruta para manejar páginas no encontradas */}
            <Route path='*' element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;