import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProducto from './EditProducto';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../Style.css';

const url = 'http://localhost:8080/api/productos';

const ShowProducto = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [producto, setProducto] = useState(null);
    const [FilteredProductos, setFilteredProductos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Alertas
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Estado para la severidad

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        getProductos();
        getProveedores();
    }, []);

    useEffect(() => {
        setFilteredProductos(
            productos.filter(producto =>
                (producto.codigo && producto.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.stock && producto.stock.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.precio && producto.precio.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.proveedor && producto.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [productos, searchTerm]);

    const getProductos = async () => {
        const respuesta = await axios.get(url);
        setProductos(respuesta.data);
    };

    const getProveedores = async () => {
        const respuesta = await axios.get('http://localhost:8080/api/proveedores');
        setProveedores(respuesta.data);
    };

    const openModal = (producto = { codigo: '', nombre: '', stock: 0, precio: 0.0, proveedor: { id: null } }, editMode = false) => {
        setProducto(producto);
        setIsEditMode(editMode);
        setIsModalOpen(true);
        setErrorMessage("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'proveedorId') {
            const selectedProveedor = proveedores.find(p => p.id === parseInt(value, 10));
            setProducto({ ...producto, proveedor: selectedProveedor });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    const saveChanges = async () => {
        if (!producto.codigo || !producto.nombre || producto.stock <= 0 || producto.precio <= 0 || !producto.proveedor) {
            setErrorMessage('Por favor, complete todos los campos correctamente.');
            return;
        }

        setErrorMessage("");
        try {
            if (isEditMode) {
                await axios.put(`${url}/${producto.id}`, producto);
                setSnackbarMessage('Producto editado exitosamente!');
                setSnackbarSeverity('info');
            } else {
                await axios.post(url, producto);
                setSnackbarMessage('Producto creado exitosamente!');
                setSnackbarSeverity('success');
            }
            setOpenSnackbar(true);
            getProductos();
            closeModal();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            setErrorMessage("Ocurrió un error al intentar guardar el producto.");
        }
    };

    const deleteProducto = async (id) => {
        try {
            await axios.delete(`${url}/${id}`);
            setSnackbarMessage('Producto eliminado exitosamente!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            getProductos();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            setSnackbarMessage("Ocurrió un error al intentar eliminar el producto.");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Paginacion
    const totalPages = Math.ceil(productos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = FilteredProductos.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="container-fluid show-proveedor-container mt-5">
            <div className="table-wrapper">
                <div className="table-title d-flex justify-content-start align-items-center">
                    <h3 className="m-0">Tabla de Productos</h3>
                    <button
                        className="btn btn-create ms-5"
                        onClick={() => openModal()}
                        style={{
                            backgroundColor: '#908dc7',
                            color: 'white',
                            padding: '8px 18px',
                            fontSize: '14px',
                            border: '1px solid #6c63ff',
                            borderRadius: '22px',
                            marginRight: '10px'
                        }}>
                        Añadir Producto
                    </button>
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
                                <th>Numero</th>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Stock disponible</th>
                                <th>Precio</th>
                                <th>Proveedor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((producto, i) => (
                                <tr key={producto.id}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{producto.codigo}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.proveedor ? producto.proveedor.nombre : 'Sin proveedor'}</td>
                                    <td>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(producto, true)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        &nbsp;
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProducto(producto.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="d-flex justify-content-end align-items-center mt-2" style={{ paddingRight: '2cm', paddingBottom: '1cm' }}>
                        <tr style={{ height: '0rem' }}>
                            <td>
                                <span className="me-2">Paginación</span>
                                <button onClick={handlePrevPage} className="btn btn-outline-secondary btn-sm" style={{ width: '30px', height: '30px', padding: 0 }}>&lt;</button>
                                <button onClick={handleNextPage} className="btn btn-outline-secondary btn-sm" style={{ width: '30px', height: '30px', padding: 0 }}>&gt;</button>
                            </td>
                        </tr>
                    </div>
                )}
                {isModalOpen && (
                    <EditProducto
                        producto={producto}
                        handleInputChange={handleInputChange}
                        closeModal={closeModal}
                        saveChanges={saveChanges}
                        isEditMode={isEditMode}
                        errorMessage={errorMessage}
                        proveedores={proveedores} // Pasar proveedores al modal
                    />
                )}

                <Snackbar open={openSnackbar} autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{
                        marginTop: '5%',
                    }} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ marginTop: '5%' }}>
                        {snackbarMessage}

                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default ShowProducto;
