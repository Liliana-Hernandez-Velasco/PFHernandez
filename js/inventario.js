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