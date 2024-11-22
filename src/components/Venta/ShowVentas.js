import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style.css';

const ShowVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [FilteredVentas, setFilteredVentas] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ventas/listar');
        setVentas(response.data);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    setFilteredVentas(
      ventas.filter(venta =>
        venta.codcliente.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.nomcliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.codempleado.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [ventas, searchTerm]);

  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = FilteredVentas.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid show-ventas-container mt-5">
      <div className="table-wrapper">
        <div className="table-title d-flex justify-content-start align-items-center">
          <h3 className="m-0">Tabla de Ventas</h3>
          <div className="mb-3 ms-1" style={{ flexGrow: 1 }}></div>
          <div className="input-group" style={{ width: '400px', marginLeft: '20px' }}>
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '25px',
                color: 'black',
                border: '1px solid #6c757d',
                paddingRight: '40px'
              }}
            />
            <span className="input-group-text" style={{ borderRadius: '25px', border: 'none', backgroundColor: 'white', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
        <div className="table-responsive custom-table">
          <table className="table mb-0">
            <thead>
              <tr className="table-header-row">
                <th>ID</th>
                <th>Código Cliente</th>
                <th>Nombre Cliente</th>
                <th>Código Empleado</th>
                <th>Subtotal</th>
                <th>Total con Iva</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((venta, i) => (
                <tr key={venta.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{venta.codcliente}</td>
                  <td>{venta.nomcliente}</td>
                  <td>{venta.codempleado}</td>
                  <td>{venta.subtotal}</td>
                  <td>{venta.total}</td>
                  <td>{venta.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center mt-2" style={{ paddingRight: '2cm', paddingBottom: '1cm' }}>
            <span className="me-2">Paginación</span>
            <button onClick={handlePrevPage} className="btn btn-outline-secondary btn-sm" style={{ width: '30px', height: '30px', padding: 0 }}>&lt;</button>
            <button onClick={handleNextPage} className="btn btn-outline-secondary btn-sm" style={{ width: '30px', height: '30px', padding: 0 }}>&gt;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowVentas;
