import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProveedores from './EditProveedores';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../Style.css';

const url = 'http://localhost:8080/api/proveedores';

const ShowProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [proveedor, setProveedor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [proveedorToDelete, setProveedorToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        getProveedores();
    }, []);

    useEffect(() => {
        setFilteredProveedores(
            proveedores.filter(proveedor =>
                (proveedor.ruc && proveedor.ruc.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (proveedor.nombre && proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (proveedor.telefono && proveedor.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (proveedor.direccion && proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (proveedor.razon && proveedor.razon.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [proveedores, searchTerm]);

    const getProveedores = async () => {
        const respuesta = await axios.get(url);
        setProveedores(respuesta.data);
        setFilteredProveedores(respuesta.data);
    };

    const openModal = (proveedor = { ruc: '', nombre: '', telefono: '', direccion: '', razon: '' }, editMode = false) => {
        setProveedor(proveedor);
        setIsEditMode(editMode);
        setIsModalOpen(true);
        setErrorMessage("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProveedor({ ...proveedor, [name]: value });
    };

    const saveChanges = async () => {
        if (!proveedor.ruc || !proveedor.nombre || !proveedor.telefono || !proveedor.direccion || !proveedor.razon) {
            setErrorMessage('Por favor, complete todos los campos.');
            return;
        }

        setErrorMessage("");

        try {
            if (isEditMode) {
                await axios.put(`${url}/${proveedor.id}`, proveedor);
                setSnackbarMessage('Proveedor editado exitosamente!');
                setSnackbarSeverity('info');
            } else {
                await axios.post(url, proveedor);
                setSnackbarMessage('Proveedor creado exitosamente!');
                setSnackbarSeverity('success');
            }
            setOpenSnackbar(true);
            getProveedores();
            closeModal();
        } catch (error) {
            setErrorMessage("Hubo un error al guardar el proveedor.");
        }
    };

    const deleteProveedor = (proveedorId) => {
        setProveedorToDelete(proveedorId);
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirmation = async () => {
        await axios.delete(`${url}/${proveedorToDelete}`);
        setSnackbarMessage('Proveedor eliminado exitosamente!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        getProveedores();
        setShowConfirmDelete(false);
    };

    const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h3 className="m-0">Tabla de Proveedores</h3>
                    <button
                        className="btn btn-create ms-5"
                        onClick={() => openModal()}
                        style={{
                            backgroundColor: '#908dc7',
                            color: 'white',
                            padding: '8px 18px',
                            fontSize: '14px',
                            border: '2px solid #6c63ff',
                            borderRadius: '22px',
                            marginRight: '10px'
                        }} >
                        Añadir Proveedor
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
                                <th>Cédula</th>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Razón</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((proveedor, i) => (
                                <tr key={proveedor.id}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{proveedor.ruc}</td>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.direccion}</td>
                                    <td>{proveedor.razon}</td>
                                    <td>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(proveedor, true)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        &nbsp;
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProveedor(proveedor.id)}>
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
                    <EditProveedores
                        proveedor={proveedor}
                        handleInputChange={handleInputChange}
                        closeModal={closeModal}
                        saveChanges={saveChanges}
                        isEditMode={isEditMode}
                        errorMessage={errorMessage}
                    />
                )}
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    marginTop: '100px',
                }}
            >
                <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showConfirmDelete}
                autoHideDuration={null}  // Alerta abierta hasta que se confirmar o cancelar
                onClose={() => setShowConfirmDelete(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    marginTop: '300px',
                }}
            >
                <Alert
                    severity="warning"
                    action={
                        <>
                            <button onClick={handleDeleteConfirmation} className="btn btn-outline-danger btn-sm">Eliminar</button>
                            <button onClick={() => setShowConfirmDelete(false)} className="btn btn-outline-secondary btn-sm ms-2">Cancelar</button>
                        </>
                    }
                >
                    ¿Estás seguro de eliminar este proveedor? Puede estar asociado a un producto.
                </Alert>
            </Snackbar>

        </div>
    );
};

export default ShowProveedores;
