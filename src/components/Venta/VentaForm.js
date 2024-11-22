import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../Style.css';

const VentaForm = () => {
  const [codigoCliente, setCodigoCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [stock, setStock] = useState(0);
  const [detallesVenta, setdetallesVenta] = useState([]);
  const [total, setTotal] = useState(0);


  const IVA_RATE = 0.19;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');



  const buscarClientePorDni = async () => {
    if (!codigoCliente) {
      alert("Por favor, ingrese un DNI.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/dni/nombre/${codigoCliente}`);
      if (response.status === 200) {
        const data = await response.text();
        setNombreCliente(data);
      } else {
        setNombreCliente("Cliente no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setNombreCliente("Error al buscar cliente");
    }
  };

  const buscarProductoPorCodigo = async () => {
    if (!codigoProducto) {
      alert("Por favor, ingrese un código de producto.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/productos/codigo/detalles/${codigoProducto}`);
      if (response.status === 200) {
        const data = await response.text();
        const detallesArray = data.split(", ");
        const producto = {
          nombre: detallesArray[0].split(": ")[1],
          stock: parseInt(detallesArray[1].split(": ")[1], 10),
          precio: parseFloat(detallesArray[2].split(": ")[1]),
          codigo: codigoProducto,
        };

        // Verifica si el producto ya está en Detalles Venta y ajusta el stock
        let stockDisponible = producto.stock;

        // Suma las cantidades de productos ya agregados a Detalles Venta
        for (let i = 0; i < detallesVenta.length; i++) {
          if (detallesVenta[i].codigoProducto === codigoProducto) {
            stockDisponible -= detallesVenta[i].cantidad;
          }
        }

        if (stockDisponible < 0) {
          setStock(0);
        } else {
          setStock(stockDisponible);
        }

        setNombreProducto(producto.nombre);
        setPrecio(producto.precio);
      } else {
        setNombreProducto("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      setNombreProducto("Error al buscar producto");
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

    // Actualiza el stock restante
    const nuevoStock = stock - cantidad;

    setdetallesVenta([...detallesVenta, nuevoDetalle]);
    setTotal(total + subtotal);
    setStock(nuevoStock); // Actualiza el stock mostrado
    setCodigoProducto('');
    setCantidad(1);
    setNombreProducto('');
    setPrecio(0);
  };

  const eliminarDetalle = (index) => {
    const nuevoDetalles = detallesVenta.filter((_, i) => i !== index);
    const subtotalEliminado = detallesVenta[index].subtotal;
    setdetallesVenta(nuevoDetalles);
    setTotal(total - subtotalEliminado);
  };

  const generarPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200],
    });

    doc.setFont('Courier');
    const leftMargin = 5;
    let yPos = 10;

    doc.setFontSize(16);
    const companyName = "StackFlow";
    const companyNameWidth = doc.getStringUnitWidth(companyName) * 16 / doc.internal.scaleFactor;
    const companyNameX = (80 - companyNameWidth) / 2;
    doc.text(companyName, companyNameX, yPos);
    yPos += 10;

    doc.setFontSize(8);
    const address = "131113 Cartagena - Bolivar - Colombia";
    const addressWidth = doc.getStringUnitWidth(address) * 8 / doc.internal.scaleFactor;
    const addressX = (80 - addressWidth) / 2;
    doc.text(address, addressX, yPos);
    yPos += 5;

    const receiptNum = `#${Math.floor(Math.random() * 100000000)}`;
    const receiptWidth = doc.getStringUnitWidth(receiptNum) * 8 / doc.internal.scaleFactor;
    const receiptX = (80 - receiptWidth) / 2;
    doc.text(receiptNum, receiptX, yPos);
    yPos += 7;

    doc.setLineWidth(0.1);
    doc.line(leftMargin, yPos, 75, yPos);
    yPos += 5;

    // Informacion de la compra
    doc.setFontSize(8);
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, leftMargin, yPos);
    yPos += 4;
    doc.text(`HORA: ${new Date().toLocaleTimeString()}`, leftMargin, yPos);
    yPos += 4;
    doc.text(`EMPLEADO: EMP01`, leftMargin, yPos);
    yPos += 4;
    doc.text(`CLIENTE: ${nombreCliente}`, leftMargin, yPos);
    yPos += 6;

    doc.line(leftMargin, yPos, 75, yPos);
    yPos += 6;

    doc.setFontSize(10);
    const saleText = "VENTA";
    const saleWidth = doc.getStringUnitWidth(saleText) * 10 / doc.internal.scaleFactor;
    const saleX = (80 - saleWidth) / 2;
    doc.text(saleText, saleX, yPos);
    yPos += 6;

    doc.setFontSize(8);
    doc.text("CANT.", leftMargin, yPos);
    doc.text("DESCRIPCION", 18, yPos);
    doc.text("P.U.", 43, yPos);
    doc.text("TOTAL", 62, yPos);
    yPos += 4;

    detallesVenta.forEach(detalle => {

      const cantidadTexto = `${detalle.cantidad}`;
      doc.text(cantidadTexto, leftMargin, yPos);

      const descripcionTexto = detalle.nombreProducto.length > 20
        ? detalle.nombreProducto.substring(0, 20) + "..."
        : detalle.nombreProducto;
      doc.text(descripcionTexto, 18, yPos);

      const precioUnitarioTexto = `$${detalle.precio.toFixed(2)}`;
      doc.text(precioUnitarioTexto, 43, yPos);

      const precioTotalTexto = `$${(detalle.cantidad * detalle.precio).toFixed(2)}`;
      doc.text(precioTotalTexto, 62, yPos);

      yPos += 5;
    });

    doc.line(leftMargin, yPos, 75, yPos);
    yPos += 5;

    // Totales
    const iva = total * IVA_RATE;
    doc.text("SUBTOTAL:", leftMargin, yPos);
    doc.text(`$${total.toFixed(2)}`, 55, yPos);
    yPos += 4;

    doc.text("IVA (19%):", leftMargin, yPos);
    doc.text(`$${iva.toFixed(2)}`, 55, yPos);
    yPos += 4;

    doc.setFontSize(10);
    doc.text("TOTAL:", leftMargin, yPos);
    doc.text(`$${(total + iva).toFixed(2)}`, 55, yPos);
    yPos += 8;

    doc.setFontSize(8);
    const thankYouMsg = "¡Gracias por su compra!";
    const thankYouWidth = doc.getStringUnitWidth(thankYouMsg) * 8 / doc.internal.scaleFactor;
    const thankYouX = (80 - thankYouWidth) / 2;
    doc.text(thankYouMsg, thankYouX, yPos);

    // guardar PDF
    doc.save(`Recibo_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const mostrarAlerta = (mensaje, severidad = 'success') => {
    setAlertMessage(mensaje);
    setAlertSeverity(severidad);
    setAlertOpen(true);
  };

  const generarVenta = async () => {
    if (!nombreCliente || nombreCliente === 'Cliente no encontrado' || nombreCliente === 'Error al buscar cliente') {
      mostrarAlerta('Por favor, selecciona un cliente válido.', 'error');
      return;
    }
    if (detallesVenta.length === 0) {
      mostrarAlerta('Por favor, agrega al menos un producto a la venta.', 'error');
      return;
    }

    const ventaData = {
      nomcliente: nombreCliente,
      codcliente: codigoCliente,
      codempleado: "EMP001",
      subtotal: total,
      iva: total * IVA_RATE,
      total: total * (1 + IVA_RATE),
      fecha: new Date().toLocaleDateString('en-CA'),
      detallesVenta: detallesVenta.map(detalle => ({
        cod_pro: detalle.codigoProducto,
        nompro: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        fecha: new Date().toLocaleDateString('en-CA'),

      }))
    };

    try {
      const response = await fetch('http://localhost:8080/ventas/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });

      if (response.status === 200 || response.status === 201) {
        mostrarAlerta('Venta generada exitosamente.');
        generarPDF();
        setdetallesVenta([]);
        setTotal(0);
        setNombreCliente('');
        setCodigoCliente('');
      } else {
        mostrarAlerta('Error al generar la venta.', 'error');
      }
    } catch (error) {
      console.log('Error al generar la venta:', error);
      mostrarAlerta('Error al generar la venta.', 'error');
    }
  };

  // Calcular IVA y total final
  const iva = total * IVA_RATE;
  const totalConIVA = total + iva;

  return (
    <div className="container">
      <br />
      <h3>Registro de Ventas</h3>
      <br />
      <div className="d-flex gap-x">

        <div className="col-sm-5">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <h6>Datos del Cliente</h6>
                <div className="d-flex flex-column align-items-start">
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control me-2 input-dni"
                      placeholder="DNI"
                      value={codigoCliente}
                      onChange={(e) => setCodigoCliente(e.target.value)}
                    />
                    <button
                      className="btn btn-buscar ms-2"
                      onClick={() => buscarClientePorDni()}
                      style={{
                        backgroundColor: '#908dc7',
                        color: 'white',
                        padding: '8px 18px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        marginRight: '10px',
                        outline: 'none'
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control mt-2 input-nombre"
                    value={nombreCliente}
                    placeholder="Nombre del Cliente"
                    readOnly
                  />
                </div>
              </div>

              <br />
              <h6>Datos del Producto</h6>
              <div className="form-group">
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2 input-codigo "
                    placeholder="Código"
                    value={codigoProducto}
                    onChange={(e) => setCodigoProducto(e.target.value)}
                  />
                  <button
                    className="btn btn-buscar ms-2"
                    onClick={() => buscarProductoPorCodigo()}
                    style={{
                      backgroundColor: '#908dc7',
                      color: 'white',
                      padding: '8px 18px',
                      fontSize: '14px',
                      borderRadius: '8px',
                      marginRight: '10px',
                      outline: 'none'
                    }}
                  >
                    Buscar
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control mt-2"
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
                      className="form-control input-precioProducto ml-5"
                      value={precio}
                      placeholder="Precio"
                      readOnly
                    />
                  </div>
                  <div>
                    <h6>Cantidad</h6>
                    <input
                      type="number"
                      className="form-control input-cantidadProducto ml-5"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <h6>Stock</h6>
                    <input
                      type="text"
                      className="form-control input-stockProducto ml-5"
                      value={stock}
                      placeholder="Stock"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-success mt-3" onClick={agregarDetalle}>
                Agregar Producto
              </button>
            </div>
          </div>
        </div>

        <div className="col-sm-7">
          <div className="card">
            <div className="card-body  table-responsive custom-table">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta.map((detalle, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{detalle.codigoProducto}</td>
                      <td>{detalle.nombreProducto}</td>
                      <td>{detalle.precio.toFixed(2)}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.subtotal.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => eliminarDetalle(index)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="card mt-4 card-totals">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Subtotal:</h6>
                      <h6>IVA (19%):</h6>
                      <h5>Total:</h5>
                    </div>
                    <div className="text-end">
                      <h6>${total.toFixed(2)}</h6>
                      <h6>${iva.toFixed(2)}</h6>
                      <h5>${totalConIVA.toFixed(2)}</h5>
                    </div>
                  </div>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={generarVenta}
                    disabled={!nombreCliente || detallesVenta.length === 0}
                  >
                    Generar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>


  );
};

export default VentaForm;