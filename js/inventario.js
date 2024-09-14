        let nextProductId = 1; 

        class Product {
            constructor(name, category, price, stock) {
                this.id = nextProductId++;
                this.name = name;
                this.category = category;
                this.price = price;
                this.stock = stock;
            }
        }

        let inventory = [];

        function addProduct(name, category, price, stock) {
            const product = new Product(name, category, price, stock);
            inventory.push(product);
            console.log(`Producto agregado: ${product.name} (ID: ${product.id})`);
            renderInventory();
        }

        function renderInventory() {
            const inventoryTableBody = document.getElementById('inventoryTableBody');
            inventoryTableBody.innerHTML = ''; // Limpiar la tabla antes de volver a renderizar

            inventory.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                `;
                inventoryTableBody.appendChild(row);
            });
        }

        function handleAddProduct() {
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);

            if (name && category && !isNaN(price) && !isNaN(stock)) {
                addProduct(name, category, price, stock);
                document.getElementById('productName').value = '';
                document.getElementById('productCategory').value = '';
                document.getElementById('productPrice').value = '';
                document.getElementById('productStock').value = '';
            } else {
                alert('Por favor, complete todos los campos correctamente.');
            }
        }
        function notifyUser(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.innerText = message;
        
            const container = document.querySelector('.container');
            container.insertBefore(notification, container.firstChild);
        
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        function handleAddProduct() {
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);
        
            if (name && category && !isNaN(price) && !isNaN(stock)) {
                addProduct(name, category, price, stock);
                notifyUser(`Producto "${name}" agregado exitosamente.`);
                clearForm();
            } else {
                notifyUser('Por favor, complete todos los campos correctamente.', 'danger');
            }
        }
        
        function clearForm() {
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productStock').value = '';
        }
        // Al cargar la página, inicializa el inventario si ya existe en localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadInventoryFromStorage();
    renderInventory();
});

function loadInventoryFromStorage() {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
        nextProductId = inventory.length ? Math.max(...inventory.map(p => p.id)) + 1 : 1;
    }
}

function saveInventoryToStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function addProduct(name, category, price, stock) {
    const product = new Product(name, category, price, stock);
    inventory.push(product);
    saveInventoryToStorage(); // Guardar el inventario actualizado
    renderInventory();
    console.log(`Producto agregado: ${product.name} (ID: ${product.id})`);
}
function loadInventoryFromStorage() {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
        nextProductId = inventory.length ? Math.max(...inventory.map(p => p.id)) + 1 : 1;
    }
}

function saveInventoryToStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}
function showInventoryJSON() {
    const inventoryJSON = JSON.stringify(inventory, null, 2); // Formato con indentación de 2 espacios
    document.getElementById('jsonOutput').textContent = inventoryJSON;
}
function clearInventory() {
    if (confirm('¿Estás seguro de que deseas limpiar el inventario? Esta acción no se puede deshacer.')) {
        // Limpiar el localStorage y resetear el inventario
        localStorage.removeItem('inventory');
        inventory = [];
        nextProductId = 1; // Reiniciar el contador de IDs

        // Limpiar la tabla en el DOM
        renderInventory();

        // Notificar al usuario
        notifyUser('Inventario limpiado correctamente.', 'warning');
    }
}
