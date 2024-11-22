import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Inicio from "./components/Inicio"; // Importando el componente Inicio
import Login from "./components/Usuario/Login"; // Importa el componente Login
import HomePage from "./components/HomePage"; // Importa el componente para la página de Home
import ShowCliente from "./components/Cliente/ShowCliente";
import CreateClientes from "./components/Cliente/CreateClientes";
import EditClientes from "./components/Cliente/EditClientes";
import ShowProveedor from "./components/Proveedor/ShowProveedor";
import CreateProveedor from "./components/Proveedor/CreateProveedor";
import ShowProducto from "./components/Producto/ShowProducto";
import VentaForm from "./components/Venta/VentaForm";
import ShowVentas from "./components/Venta/ShowVentas";
import CreateUser from "./components/Usuario/CreateUser";
import ShowDetalleVenta from "./components/Venta/ShowDetalleVenta";
import Dashboard from "./components/Dashboard ";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"; // Cargar desde el Local Storage
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const Layout = () => (
    <>
      <Inicio onLogout={handleLogout} />
      <Outlet />
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Layout /> : <Login onLoginSuccess={handleLoginSuccess} />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Cliente/ShowCliente" element={<ShowCliente />} />
          <Route path="/create" element={<CreateClientes />} />
          <Route path="/edit/:id" element={<EditClientes />} />
          <Route path="/proveedor/ShowProveedor" element={<ShowProveedor />} />
          <Route path="/proveedor/CreateProveedor" element={<CreateProveedor />} />
          <Route path="/Producto/ShowProducto" element={<ShowProducto />} />
          <Route path="/Venta/VentaForm" element={<VentaForm />} />
          <Route path="/Venta/ShowVentas" element={<ShowVentas />} />
          <Route path="/Venta/ShowDetalleVenta" element={<ShowDetalleVenta />} />
          <Route path="/Dashboard" element={<Dashboard />} />

        </Route>

        <Route path="/Usuario/CreateUser" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

