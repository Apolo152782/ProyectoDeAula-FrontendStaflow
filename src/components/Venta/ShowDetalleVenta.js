import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../Style.css';

const ShowDetalleVenta = () => {
    const [detallesVenta, setDetallesVenta] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDetallesVenta, setFilteredDetallesVenta] = useState([]);
    const [contadorExportaciones, setContadorExportaciones] = useState(
        parseInt(localStorage.getItem('contadorExportaciones') || '1', 10)
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchDetallesVenta = async () => {
            try {
                const response = await axios.get('http://localhost:8080/detalleventa/listar');
                setDetallesVenta(response.data);
            } catch (error) {
                console.error('Error al obtener los detalles de la venta:', error);
            }
        };

        fetchDetallesVenta();
    }, []);

    useEffect(() => {
        setFilteredDetallesVenta(
            detallesVenta.filter(detalle =>
                detalle.cod_pro.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                detalle.nompro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                detalle.cantidad.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                detalle.precio.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [detallesVenta, searchTerm]);

    const totalPages = Math.ceil(filteredDetallesVenta.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDetallesVenta.slice(indexOfFirstItem, indexOfLastItem);

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

    const exportarAExcel = () => {
        const libroDeTrabajo = XLSX.utils.book_new();
        const datosParaExportar = filteredDetallesVenta.map(detalle => ({
            "ID Producto": detalle.cod_pro,
            "Nombre del Producto": detalle.nompro,
            "Cantidad Vendida": detalle.cantidad,
            "Precio Unitario": `$${detalle.precio.toFixed(2)}`,
            "Fecha de Venta": detalle.fecha,
        }));


        const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar, {
            header: ["ID Producto", "Nombre del Producto", "Cantidad Vendida", "Precio Unitario", "Fecha de Venta"]
        });

        const anchoColumnas = [
            { wch: 15 },
            { wch: 40 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ];
        hojaDeTrabajo['!cols'] = anchoColumnas;

        const range = XLSX.utils.decode_range(hojaDeTrabajo['!ref']);

        const headerStyle = {
            fill: { fgColor: { rgb: "908DC7" } },
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        const dataStyle = {
            font: { sz: 11 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "D3D3D3" } },
                bottom: { style: "thin", color: { rgb: "D3D3D3" } },
                left: { style: "thin", color: { rgb: "D3D3D3" } },
                right: { style: "thin", color: { rgb: "D3D3D3" } }
            }
        };

        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!hojaDeTrabajo[cellRef]) continue;

                hojaDeTrabajo[cellRef].s = R === 0 ? headerStyle : dataStyle;
            }
        }

        const fechaActual = new Date().toLocaleDateString();
        XLSX.utils.sheet_add_aoa(hojaDeTrabajo, [
            [`Reporte de Detalle de Ventas - ${fechaActual}`]
        ], { origin: -1 });

        // Generar nombre de archivo con contador y fecha
        const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
        const nombreArchivo = `Reporte_DetalleVenta_${contadorExportaciones}_${fecha}.xlsx`;

        XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'Detalle Ventas');
        XLSX.writeFile(libroDeTrabajo, nombreArchivo);

        // Incrementar el contador y guardarlo en localStorage
        const nuevoContador = contadorExportaciones + 1;
        setContadorExportaciones(nuevoContador);
        localStorage.setItem('contadorExportaciones', nuevoContador.toString());
    };

    return (
        <div className="container-fluid show-ventas-container mt-5">
            <div className="table-wrapper">
                <div className="table-title d-flex justify-content-start align-items-center">
                    <h3 className="m-0">Tabla de Detalle Ventas</h3>
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
                    <button
                        className="btn btn-create ms-5"
                        onClick={exportarAExcel}
                        style={{
                            backgroundColor: '#908dc7',
                            color: 'white',
                            padding: '8px 18px',
                            fontSize: '14px',
                            border: '2px solid #6c63ff',
                            borderRadius: '22px',
                            marginRight: '10px'
                        }}>
                        Exportar a Excel
                    </button>
                </div>
                <div className="table-responsive custom-table">
                    <table className="table mb-0">
                        <thead>
                            <tr className="table-header-row">
                                <th>ID</th>
                                <th>Código Del producto</th>
                                <th>Nombre Del producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((detalleVenta, i) => (
                                <tr key={detalleVenta.id}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{detalleVenta.cod_pro}</td>
                                    <td>{detalleVenta.nompro}</td>
                                    <td>{detalleVenta.cantidad}</td>
                                    <td>{detalleVenta.precio}</td>
                                    <td>{detalleVenta.fecha}</td>
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

export default ShowDetalleVenta;
