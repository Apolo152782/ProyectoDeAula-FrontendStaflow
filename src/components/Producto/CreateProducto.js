import React, { useState } from 'react';
import axios from 'axios';

const VentaForm = () => {
    const [codigoCliente, setCodigoCliente] = useState('');
    const [nombreCliente, setNombreCliente] = useState('');
    const [codigoProducto, setCodigoProducto] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [precio, setPrecio] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const [stock, setStock] = useState(0);
    const [detalles, setDetalles] = useState([]);
    const [total, setTotal] = useState(0);

    const buscarClientePorDni = async () => {
        if (!codigoCliente) {
            alert('Por favor, ingrese un DNI.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/clientes/dni/nombre/${codigoCliente}`);
            if (response.status === 200 && response.data) {
                setNombreCliente(response.data);
            } else {
                setNombreCliente('Cliente no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setNombreCliente('Error al buscar cliente');
        }
    };

    const buscarProductoPorCodigo = async () => {
        if (!codigoProducto) {
            alert('Por favor, ingrese un código de producto.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/productos/codigo/detalles/${codigoProducto}`);
            if (response.status === 200) {
                const detallesArray = response.data.split(", ");
                const producto = {
                    nombre: detallesArray[0].split(": ")[1],
                    stock: parseInt(detallesArray[1].split(": ")[1], 10),
                    precio: parseFloat(detallesArray[2].split(": ")[1]),
                    codigo: codigoProducto,
                };
                setNombreProducto(producto.nombre);
                setPrecio(producto.precio);
                setStock(producto.stock);
            } else {
                setNombreProducto('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar producto:', error);
            setNombreProducto('Error al buscar producto');
        }
    };

    const agregarDetalle = () => {
        if (!nombreProducto) {
            alert('Por favor, busca un producto antes de agregarlo.');
            return;
        }

        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor que cero.');
            return;
        }

        if (cantidad > stock) {
            alert('No hay suficiente stock disponible.');
            return;
        }

        const subtotal = precio * cantidad;
        const nuevoDetalle = {
            codigoProducto,
            nombreProducto,
            precio,
            cantidad,
            subtotal,
        };

        setDetalles([...detalles, nuevoDetalle]);
        setTotal(total + subtotal);
        setCodigoProducto('');
        setCantidad(1);
        setNombreProducto('');
        setPrecio(0);
        setStock(0);
    };

    const eliminarDetalle = (index) => {
        const nuevoDetalles = detalles.filter((_, i) => i !== index);
        const subtotalEliminado = detalles[index].subtotal;
        setDetalles(nuevoDetalles);
        setTotal(total - subtotalEliminado);
    };

    const generarVenta = async () => {

        if (!nombreCliente || nombreCliente === 'Cliente no encontrado' || nombreCliente === 'Error al buscar cliente') {
            alert('Por favor, selecciona un cliente válido.');
            return;
        }

        if (detalles.length === 0) {
            alert('Por favor, agrega al menos un producto a la venta.');
            return;
        }

        const ventaData = {
            nomcliente: nombreCliente,
            codcliente: codigoCliente,
            codempleado: "EMP001",
            subtotal: total,
            fecha: new Date().toISOString().split("T")[0],
            detalles: detalles.map(detalle => ({
                cod_pro: detalle.codigoProducto,
                nompro: detalle.nombreProducto,
                cantidad: detalle.cantidad,
                precio: detalle.precio
            }))
        };

        try {
            const response = await axios.post('http://localhost:8080/ventas/guardar', ventaData);
            if (response.status === 200) {
                alert('Venta generada exitosamente');
                setDetalles([]);
                setTotal(0);
                setNombreCliente('');
                setCodigoCliente('');
            }
        } catch (error) {
            console.log('Error al generar la venta:', error);
        }
    };

    return (
        <div className="container">
            <h1>Registro de Ventas</h1>
            <div className="d-flex">
                <div className="col-sm-5">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group">
                                <h6>Datos del Cliente</h6>
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: '100px' }}
                                        placeholder="DNI"
                                        value={codigoCliente}
                                        onChange={(e) => setCodigoCliente(e.target.value)}
                                    />
                                    <button className="btn btn-primary ms-2" onClick={buscarClientePorDni}>Buscar</button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ width: '180px' }}
                                    value={nombreCliente}
                                    placeholder="Nombre del Cliente"
                                    readOnly
                                />
                            </div>
                            <br />
                            <h6>Datos del Producto</h6>
                            <div className="form-group">
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: '100px' }}
                                        placeholder="Código"
                                        value={codigoProducto}
                                        onChange={(e) => setCodigoProducto(e.target.value)}
                                    />
                                    <button className="btn btn-primary ms-2" onClick={buscarProductoPorCodigo}>Buscar</button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ width: '180px' }}
                                    value={nombreProducto}
                                    placeholder="Nombre del Producto"
                                    readOnly
                                />
                                <br />
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div>
                                        <h6>Precio</h6>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ width: '70px' }}
                                            value={precio}
                                            placeholder="Precio"
                                            readOnly
                                        />
                                    </div>
                                    <div className="ms-2">
                                        <h6>Cantidad</h6>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ width: '70px' }}
                                            value={cantidad}
                                            onChange={(e) => setCantidad(Number(e.target.value))}
                                            min="1"
                                        />
                                    </div>
                                    <div className="ms-2">
                                        <h6>Stock</h6>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ width: '70px' }}
                                            value={stock}
                                            placeholder="Stock"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-success mt-3" onClick={agregarDetalle}>Agregar Producto</button>
                        </div>
                    </div>
                </div>

                <div className="col-sm-7">
                    <div className="card">
                        <div className="card-body">
                            <table className="table table-secondary table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((detalle, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{detalle.codigoProducto}</td>
                                            <td>{detalle.nombreProducto}</td>
                                            <td>{detalle.precio.toFixed(2)}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>{detalle.subtotal.toFixed(2)}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => eliminarDetalle(index)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <h5>Total: {total.toFixed(2)}</h5>
                            <button className="btn btn-primary" onClick={generarVenta}>Generar Venta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VentaForm;
