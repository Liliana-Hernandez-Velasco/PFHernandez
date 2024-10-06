// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', updateTable); // Agregar evento submit
    });

    // Cargar datos desde una API (simulado)
    loadInitialData();
});

let supplyChainData = { purchases: [], sales: [] };

// Función para obtener datos de la API
const loadInitialData = async () => {
    try {
        const response = await fetch('http://localhost:3000'); // Cambia esta URL a la API real
        if (!response.ok) throw new Error('Error al cargar los datos');

        const data = await response.json();
        data.purchases.forEach(item => addRowToTable('supply-chain-purchase-table', item));
        data.sales.forEach(item => addRowToTable('supply-chain-sales-table', item));
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
};

// Función para agregar una fila a la tabla
const addRowToTable = (tableId, rowData) => {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const newRow = document.createElement("tr");
    
    for (const key in rowData) {
        const cell = document.createElement("td");
        cell.textContent = rowData[key];
        newRow.appendChild(cell);
    }
    
    tableBody.appendChild(newRow); // Añadir la fila a la tabla
};

// Función para obtener datos de la tabla
function getSupplyChainData() {
    return supplyChainData;
}

// Función para calcular el profit usando el algoritmo simplex
function calculateProfit() {
    let c = []; // Coeficientes de la función objetivo
    let A = []; // Coeficientes de las restricciones
    let b = []; // Lados derechos de las restricciones

    // Llenar coeficientes de la función objetivo
    supplyChainData.purchases.forEach(purchase => {
        c.push(purchase.cost);
    });

    supplyChainData.sales.forEach(sale => {
        c.push(-sale.price);
    });

    // Llenar coeficientes de las restricciones
    supplyChainData.purchases.forEach(purchase => {
        let constraint = Array(supplyChainData.purchases.length + supplyChainData.sales.length).fill(0);
        let index = supplyChainData.purchases.indexOf(purchase);
        constraint[index] = 1; // Variable de compra

        A.push(constraint);
        b.push(purchase.max); // Restricción superior
    });

    supplyChainData.sales.forEach(sale => {
        let constraint = Array(supplyChainData.purchases.length + supplyChainData.sales.length).fill(0);
        let index = supplyChainData.sales.indexOf(sale) + supplyChainData.purchases.length;
        constraint[index] = -1; // Variable de venta

        A.push(constraint);
        b.push(-sale.min); // Restricción inferior (debe ser al menos el mínimo vendido)
    });

    // Llamar a la función simplex
    let optimalValue = simplex(c, A, b);
    console.log("El valor óptimo es:", optimalValue);
    document.getElementById('json-output').textContent = `Valor óptimo calculado: ${optimalValue}`;
}

// Función para actualizar la tabla
function updateTable(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const form = event.target; // El formulario que se envía
    const tableId = form.getAttribute("data-table-id"); // ID de la tabla a actualizar
    const formData = new FormData(form);
    const rowData = {};

    // Extraer datos del formulario
    formData.forEach((value, key) => {
        rowData[key] = value;
    });

    // Comprobar si los datos están completos
    const isEmptyRow = Object.values(rowData).some(value => value.trim() === "");
    if (isEmptyRow) {
        alert("Por favor, revisa todos los campos antes de enviar."); // Alertar al usuario
        return; // Salir de la función si hay campos vacíos
    }

    // Agregar la fila a la tabla
    addRowToTable(tableId, rowData);

    // Almacenar datos en supplyChainData
    if (tableId === 'supply-chain-purchase-table') {
        supplyChainData.purchases.push(rowData);
    } else if (tableId === 'supply-chain-sales-table') {
        supplyChainData.sales.push(rowData);
    }

    // Limpiar el formulario
    form.reset();

    // Calcular el profit después de agregar nuevos datos
    calculateProfit();

    // Enviar datos a la API
    sendDataToAPI(); // Llama a la función para enviar datos
}

// Función para enviar datos a la API
const sendDataToAPI = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplyChainData)
        });

        if (!response.ok) throw new Error('Error al enviar datos');

        const result = await response.json();
        console.log(result.message); // Mensaje de éxito

    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para descargar un archivo JSON
function downloadJSON(filename, jsonData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Descargar el JSON de datos de usuario
function downloadUserDataJSON() {
    const data = getSupplyChainData();
    downloadJSON("user_data.json", data);
}

// Función para limpiar los datos de todas las tablas
function clearTables() {
    const tableIds = ['supply-chain-purchase-table', 'supply-chain-sales-table'];
    tableIds.forEach(tableId => {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = '';  // Limpiar la tabla
    });

    // Limpiar los datos almacenados
    supplyChainData = { purchases: [], sales: [] };
    document.getElementById('json-output').textContent = ''; // Limpiar JSON generado
    alert('Datos de las tablas han sido limpiados.');
}

// Función para realizar la búsqueda del pivote
function getPivotElement(tableau) {
    let pivotCol = tableau[0].findIndex(value => value < 0); // Columna de pivote
    let ratios = [];

    // Calcular las razones para encontrar la fila de pivote
    for (let i = 1; i < tableau.length; i++) {
        if (tableau[i][pivotCol] > 0) {
            ratios.push(tableau[i][tableau[0].length - 1] / tableau[i][pivotCol]);
        } else {
            ratios.push(Infinity);
        }
    }

    let pivotRow = ratios.indexOf(Math.min(...ratios)) + 1; // Fila de pivote
    return { pivotRow, pivotCol };
}

// Función para realizar la eliminación de Gauss
function pivot(tableau, pivotRow, pivotCol) {
    let pivotValue = tableau[pivotRow][pivotCol];

    // Normalizar la fila de pivote
    for (let j = 0; j < tableau[0].length; j++) {
        tableau[pivotRow][j] /= pivotValue;
    }

    // Eliminar otras filas
    for (let i = 0; i < tableau.length; i++) {
        if (i !== pivotRow) {
            let factor = tableau[i][pivotCol];
            for (let j = 0; j < tableau[0].length; j++) {
                tableau[i][j] -= factor * tableau[pivotRow][j];
            }
        }
    }
}

// Función principal del algoritmo simplex
function simplex(c, A, b) {
    let tableau = [];
    // Crear la tabla inicial
    tableau.push([...c.map(v => -v), 0]); // Coeficientes de la función objetivo
    for (let i = 0; i < A.length; i++) {
        tableau.push([...A[i], b[i]]); // Restricciones
    }

    while (true) {
        let { pivotRow, pivotCol } = getPivotElement(tableau);

        // Si no hay más columnas de pivote negativas, se ha encontrado la solución óptima
        if (pivotCol === -1) {
            break;
        }

        pivot(tableau, pivotRow, pivotCol);
    }

    return tableau[0][tableau[0].length - 1]; // Valor óptimo de la función objetivo
}
