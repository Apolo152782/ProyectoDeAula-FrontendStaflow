import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Inicio = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <style>
        {`
          .navega {
            display: flex;
            align-items: center;
            padding: 1rem;
          }

          .nav-masthead {
            margin-left: 20px;
            flex-grow: 1;
          }

          .nav-masthead .nav-link {
            color: rgba(255, 255, 255, .8);
            border-bottom: .25rem solid transparent;
            margin: 0 1rem;
            position: relative;
            transition: color 0.2s ease, border-color 0.2s ease;
          }

          .nav-masthead .nav-link:hover {
            color: #fff;
          }

          .nav-masthead .nav-link:hover::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: white;
            animation: barraDeslizar 0.4s forwards ease;
          }

          .nav-masthead .active {
            color: #fff;
            border-bottom-color: #fff;
          }

          /* Efecto de transición para el subrayado */
          @keyframes barraDeslizar {
            0% {
              width: 0;
              left: 0;
            }
            100% {
              width: 100%;
              left: 0;
            }
          }

          header {
            background-color: #908dc7;
          }

          /* Botón de Cerrar sesión */
          .logout-button {
            background: none;
            border: none;
            color: white;
            padding: 8px 18px;
            font-size: 14px;
            border: 2px solid #4a235a;
            border-radius: 18px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .logout-button:hover {
            background-color: #ff5e5e;
          }

          .logo {
            color:#4a235a;
            font-size: 1.5rem;
            font-weight: bold;
            white-space: nowrap;
        }
        `}
      </style>

      <header className="mb-auto">
        <div className="navega">
          <div className="logo">StackFlow</div>
          <nav className="nav nav-masthead">
            <NavLink className="nav-link fw-bold py-1 px-0" to="/Homepage" end>Inicio</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/cliente/ShowCliente">Cliente</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/proveedor/ShowProveedor">Proveedor</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/producto/ShowProducto">Productos</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/Venta/VentaForm">Agregar Venta</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/Venta/ShowVentas">Historial Ventas</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/Venta/ShowDetalleVenta">Detalles Ventas</NavLink>
            <NavLink className="nav-link fw-bold py-1 px-0" to="/Dashboard">Dashboard</NavLink>

          </nav>

          <button
            className="logout-button ms-5"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    </>
  );
};

export default Inicio;