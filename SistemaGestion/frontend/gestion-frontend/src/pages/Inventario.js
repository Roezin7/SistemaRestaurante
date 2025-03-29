import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Inventario = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get('/inventario')
            .then(response => setProductos(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h3>Inventario</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Cantidad</th>
                        <th>Costo Unitario</th>
                        <th>Precio Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.inventario_id}>
                            <td>{producto.nombre}</td>
                            <td>{producto.categoria}</td>
                            <td>{producto.cantidad}</td>
                            <td>${producto.costo_unitario}</td>
                            <td>${producto.precio_venta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventario;
