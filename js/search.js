// search.js
function searchContent() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('.card');
    let found = false;

    cards.forEach(card => {
        let textContent = card.textContent.toLowerCase();
        if (textContent.includes(input)) {
            card.style.display = 'block';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });

    if (!found) {
        alert('No se encontraron resultados para su búsqueda.');
    }
}
