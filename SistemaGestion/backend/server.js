const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/empleados', require('./routes/empleadosRoutes'));
app.use('/api/finanzas', require('./routes/finanzasRoutes'));
app.use('/api/inventarios', require('./routes/inventarioRoutes'));
app.use('/api/horarios', require('./routes/horariosRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Ruta de prueba
app.get('/api', (req, res) => {
    res.send('API funcionando correctamente');
});

// Manejo de errores
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
