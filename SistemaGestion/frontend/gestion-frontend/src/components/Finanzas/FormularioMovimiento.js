import React, { useState } from 'react';
import axios from '../../api/axios';

const FormularioMovimiento = () => {
    const [tipo, setTipo] = useState('ingreso');
    const [concepto, setConcepto] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [beneficiario, setBeneficiario] = useState('');
    const [numeroCheque, setNumeroCheque] = useState('');

    const registrarMovimiento = async () => {
        try {
            const data = { concepto, monto, fecha, metodo_pago: metodoPago, beneficiario, numero_cheque: numeroCheque };
            const endpoint = tipo === 'ingreso' ? '/finanzas/ingresos' : '/finanzas/egresos';

            await axios.post(endpoint, data);
            alert('Movimiento registrado correctamente');
            setConcepto('');
            setMonto('');
            setFecha('');
            setMetodoPago('efectivo');
            setBeneficiario('');
            setNumeroCheque('');
        } catch (error) {
            console.error('Error al registrar el movimiento:', error);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h4>Registrar Movimiento</h4>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                <input
                    type="text"
                    placeholder="Concepto"
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Monto"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Fecha"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="cheque">Cheque</option>
                </select>
                {metodoPago === 'cheque' && (
                    <>
                        <input
                            type="text"
                            placeholder="Beneficiario"
                            value={beneficiario}
                            onChange={(e) => setBeneficiario(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Número de Cheque"
                            value={numeroCheque}
                            onChange={(e) => setNumeroCheque(e.target.value)}
                        />
                    </>
                )}
                <button onClick={registrarMovimiento}>Registrar</button>
            </div>
        </div>
    );
};

export default FormularioMovimiento;
