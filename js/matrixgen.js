// Función para cargar datos desde la API
async function loadDataFromAPI(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al cargar los datos');
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para generar la matriz de optimización
function generateOptimizationMatrix(data) {
    const optimizationMatrix = {
        purchases: [],
        sales: [],
        constraints: []
    };

    // Extraer los costos de las compras
    data.purchases.forEach(purchase => {
        optimizationMatrix.purchases.push({
            material: purchase.material,
            cost: parseFloat(purchase.cost),
            min: parseInt(purchase.min),
            max: parseInt(purchase.max),
            uom: purchase.uom,
            breakers: parseInt(purchase.breakers)
        });
    });

    // Extraer los precios de las ventas
    data.sales.forEach(sale => {
        optimizationMatrix.sales.push({
            material: sale.material,
            price: parseFloat(sale.price),
            min: parseInt(sale.min),
            max: parseInt(sale.max),
            uom: sale.uom,
            breakers: parseInt(sale.breakers)
        });
    });

    // Generar restricciones (ejemplo)
    optimizationMatrix.constraints.push({
        type: "max",
        value: 100 // Ejemplo de valor de restricción
    });

    return optimizationMatrix;
}

// Función para guardar la matriz de optimización en un archivo JSON
function saveMatrixToJSON(matrix) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(matrix, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "optimization_matrix.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Nueva función para manejar el clic en el botón
async function handleGenerateMatrixClick() {
    const apiUrl = 'http://localhost:3000'; // Cambia esta URL a la API real
    const data = await loadDataFromAPI(apiUrl);

    if (data) {
        const optimizationMatrix = generateOptimizationMatrix(data);
        console.log("Matriz de Optimización Generada:", optimizationMatrix);
        saveMatrixToJSON(optimizationMatrix);
    }
}

// Llamar a la función principal
main();
