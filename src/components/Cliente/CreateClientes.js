import { Button } from 'bootstrap';
import React from 'react';

const CreateClientes = ({ cliente, handleInputChange, closeModal, saveChanges, existingClients }) => {
    const handleSaveChanges = () => {
        saveChanges();
    };

    return (
        <div
            className="modal show"
            style={{
                display: "block",
                zIndex: 11,
                position: 'absolute',
                top: '50%',
                left: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                transform: 'translate(-50%, -50%)'
            }}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Crear Cliente</h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Cerrar" style={{ position: 'absolute', right: '15px', top: '15px' }}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <label>Cédula:</label>
                            <input type="text" className="form-control" name="dni" value={cliente.dni || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Nombre:</label>
                            <input type="text" className="form-control" name="nombre" value={cliente.nombre || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Teléfono:</label>
                            <input type="text" className="form-control" name="telefono" value={cliente.telefono || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Dirección:</label>
                            <input type="text" className="form-control" name="direccion" value={cliente.direccion || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Razón:</label>
                            <input type="text" className="form-control" name="razon" value={cliente.razon || ''} onChange={handleInputChange} required />
                        </form>
                    </div>
                    <div className="modal-footer">
                        <Button className="btn btn-success" variant="contained" onClick={handleSaveChanges}>Crear Cliente</Button>
                        <button className="btn btn-info" onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CreateClientes;