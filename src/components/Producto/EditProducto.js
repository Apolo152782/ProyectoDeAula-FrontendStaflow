import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProducto = ({ producto, handleInputChange, closeModal, saveChanges, isEditMode, errorMessage }) => {
    const [proveedores, setProveedores] = useState([]);
    useEffect(() => {
        const fetchProveedores = async () => {
            const respuesta = await axios.get('http://localhost:8080/api/proveedores');
            setProveedores(respuesta.data);
        };

        fetchProveedores();
    }, []);

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
                        <h5 className="modal-title">{isEditMode ? "Editar Producto" : "Crear Producto"}</h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Cerrar" style={{ position: 'absolute', right: '15px', top: '15px' }}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form autoComplete="off">
                            <label>Código:</label>
                            <input type="text" className="form-control" name="codigo" value={producto.codigo || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Nombre:</label>
                            <input type="text" className="form-control" name="nombre" value={producto.nombre || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Stock:</label>
                            <input type="number" className="form-control" name="stock" value={producto.stock || 0} onChange={handleInputChange} required />

                            <label className="mt-3">Precio:</label>
                            <input type="number" className="form-control" name="precio" value={producto.precio || 0.0} onChange={handleInputChange} required />

                            <label className="mt-3">Proveedor:</label>
                            <select
                                className="form-control"
                                name="proveedorId"
                                value={producto.proveedor ? producto.proveedor.id : ''}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre}
                                    </option>
                                ))}
                            </select>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-success" onClick={saveChanges}>{isEditMode ? "Guardar Cambios" : "Crear Producto"}</button>
                        <button className="btn btn-info" onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProducto;

