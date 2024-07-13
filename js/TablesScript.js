function updateTable(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const tableId = form.getAttribute('data-table-id');
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const newRow = document.createElement('tr');

    const columns = ['material', 'cost', 'min', 'max', 'uom', 'breakers', 'process-id', 'variable'];
    
    columns.forEach(key => {
      const newCell = document.createElement('td');
      newCell.classList.add(key);
      newCell.innerText = formData.get(key) || '';
      newRow.appendChild(newCell);
    });

    tableBody.appendChild(newRow);
    form.reset();
  }