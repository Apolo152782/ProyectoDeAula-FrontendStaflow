import React, { useEffect, useState } from "react";
import axios from "axios";
import EditClientes from './EditClientes';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../Style.css';

const url = 'http://localhost:8080/api/clientes';

const ShowCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Alertas
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Numero de filas 

    useEffect(() => {
        getClientes();
    }, []);

    useEffect(() => {
        setFilteredClientes(
            clientes.filter(cliente =>
                (cliente.dni && cliente.dni.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cliente.nombre && cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cliente.telefono && cliente.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cliente.direccion && cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cliente.razon && cliente.razon.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [clientes, searchTerm]);

    const getClientes = async () => {
        const respuesta = await axios.get(url);
        setClientes(respuesta.data);
        setFilteredClientes(respuesta.data);
    };

    const openModal = (cliente = { dni: '', nombre: '', telefono: '', direccion: '', razon: '' }, editMode = false) => {
        setCliente(cliente);
        setIsEditMode(editMode);
        setIsModalOpen(true);
        setErrorMessage("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const saveChanges = async () => {
        if (!cliente.dni || !cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.razon) {
            setErrorMessage('Por favor, complete todos los campos.');
            return;
        }

        setErrorMessage("");

        try {
            if (isEditMode) {
                // Edición
                await axios.put(`${url}/${cliente.id}`, cliente);
                setSnackbarMessage('Cliente editado exitosamente!');
                setSnackbarSeverity('info');
            } else {
                // Creación
                await axios.post(url, cliente);
                setSnackbarMessage('Cliente creado exitosamente!');
                setSnackbarSeverity('success');
            }
            setOpenSnackbar(true);
            getClientes();
            closeModal();
        } catch (error) {
            setErrorMessage("Hubo un error al guardar el cliente.");
        }
    };

    const deleteCliente = async (id) => {
        await axios.delete(`${url}/${id}`);
        setSnackbarMessage('Cliente eliminado exitosamente!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        getClientes();
    };

    // Funciones de paginacion
    const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="container-fluid show-cliente-container mt-5">
            <div className="table-wrapper">
                <div className="table-title d-flex justify-content-start align-items-center">
                    <h3 className="m-0">Tabla de Clientes</h3>
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
                        }}>
                        Añadir Cliente
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
                            {currentItems.map((cliente, i) => (
                                <tr key={cliente.id}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{cliente.dni}</td>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>{cliente.razon}</td>
                                    <td>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(cliente, true)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        &nbsp;
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCliente(cliente.id)}>
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
                    <EditClientes
                        cliente={cliente}
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
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    marginTop: '5%',
                }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ShowCliente;
