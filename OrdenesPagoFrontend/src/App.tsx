import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import OrdersPage from "./pages/Orders/OrdersPage";
import OrderCreatePage from "./pages/Orders/OrderCreatePage";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";

import ClientsPage from "./pages/Clients/ClientsPage";
import ProductsPage from "./pages/Products/ProductsPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/ordenes" replace />} />

        <Route path="/ordenes" element={<OrdersPage />} />

        <Route path="/ordenes/nueva" element={<OrderCreatePage />} />

        <Route path="/ordenes/:id" element={<OrderDetailPage />} />

        <Route path="/clientes" element={<ClientsPage />} />

        <Route path="/productos" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
