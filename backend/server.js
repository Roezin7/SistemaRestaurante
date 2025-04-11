const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/empleados', require('./routes/empleadosRoutes'));
app.use('/api/finanzas', require('./routes/finanzasRoutes'));
app.use('/api/inventarios', require('./routes/inventarioRoutes'));
app.use('/api/horarios', require('./routes/horariosRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Ruta de prueba
app.get('/api', (req, res) => {
    res.send('API funcionando correctamente');
});

// === Sirve el frontend (React build) ===
app.use(express.static(path.join(__dirname, '../frontend/gestion-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/gestion-frontend/build', 'index.html'));
});


// Manejo de errores
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
