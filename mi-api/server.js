const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let data = {
    purchases: [],
    sales: []
};

// Endpoint para recibir datos de compras y ventas
app.post('/api/data', (req, res) => {
    const { purchases, sales } = req.body;

    if (purchases) {
        data.purchases.push(...purchases);
    }

    if (sales) {
        data.sales.push(...sales);
    }

    res.status(200).json({ message: 'Datos recibidos exitosamente' });
});

// Endpoint para obtener los datos
app.get('/api/data', (req, res) => {
    res.status(200).json(data);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
