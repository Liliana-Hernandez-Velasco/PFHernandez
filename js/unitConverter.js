document.addEventListener('DOMContentLoaded', function() {
    const unitForm = document.getElementById('unit-converter-form');
    const typeRadios = unitForm.elements['type'];
    const initialUOM = document.getElementById('initialUOM');
    const finalUOM = document.getElementById('finalUOM');
    const valueInput = document.getElementById('value');
    const resultInput = document.getElementById('conversionresult');
    const convertBtn = document.getElementById('convert-btn');

    const units = {
        volume: {
            Lt: 1,
            cm3: 1000,
            Oz: 33.814
        },
        weight: {
            Kg: 1,
            g: 1000,
            lb: 2.20462
        },
        length: {
            m: 1,
            cm: 100,
            in: 39.3701
        }
    };

    function populateUOMOptions(type) {
        const options = Object.keys(units[type]);
        initialUOM.innerHTML = '';
        finalUOM.innerHTML = '';

        options.forEach(unit => {
            const optionElement1 = document.createElement('option');
            optionElement1.value = unit;
            optionElement1.textContent = unit;
            initialUOM.appendChild(optionElement1);

            const optionElement2 = document.createElement('option');
            optionElement2.value = unit;
            optionElement2.textContent = unit;
            finalUOM.appendChild(optionElement2);
        });
    }

    typeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            populateUOMOptions(this.value);
        });
    });

    convertBtn.addEventListener('click', function() {
        const selectedType = unitForm.elements['type'].value;
        const initialUnit = initialUOM.value;
        const finalUnit = finalUOM.value;
        const value = parseFloat(valueInput.value);

        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }

        const conversionFactor = units[selectedType][finalUnit] / units[selectedType][initialUnit];
        const result = value * conversionFactor;
        resultInput.value = result.toFixed(2);
    });
});
