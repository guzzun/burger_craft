document.addEventListener('DOMContentLoaded', () => {
    const addBtns = document.querySelectorAll('.add-item');
    const resetBtn = document.querySelector('.reset');
    let firstSelectAdded = false;

    resetBtn.addEventListener('click', () => {
        window.location.reload(true);
        window.scrollTo(0, 0);
    });

    const updateCraftResults = (allOptions, selectedOption) => {
        const craftResults = document.querySelector('.craft-totals.burger-craft-results');
    
        if (selectedOption && selectedOption.value !== "" && selectedOption.dataset.grams) {
            const optionValue = allOptions.dataset.option;
    
            const gramsAttr = selectedOption.dataset.grams;
    
            const resultRow = document.createElement('div');
            resultRow.classList.add('result-row', `option-${optionValue}`);
            resultRow.dataset.option = optionValue;
    
            const labelText = selectedOption.text.match(/^[^(]*/)[0].trim();
            const labelSpan = document.createElement('span');
            labelSpan.classList.add('label');
            labelSpan.textContent = `${labelText} : `;
            resultRow.appendChild(labelSpan);
    
            const valueSpan = document.createElement('span');
            valueSpan.classList.add('value');
            valueSpan.textContent = `${selectedOption.dataset.price} lei`;
            resultRow.appendChild(valueSpan);
    
            const grams = parseFloat(gramsAttr);
            const massSpan = document.createElement('span');
            massSpan.classList.add('mass');
            massSpan.textContent = ` (${grams} gr)`;
            resultRow.appendChild(massSpan);
    
            craftResults.insertBefore(resultRow, document.querySelector('.total-price-row'));
    
            calculateTotalPriceAndMass();
        }
    };
    

    const calculateTotalPriceAndMass = () => {
        const craftResults = document.querySelector('.craft-totals.burger-craft-results');
        const totalPriceRow = document.querySelector('.total-price-row');
        let totalPrice = 0;
        let totalMass = 0;
    
        const allOptions = craftResults.querySelectorAll('.result-row');
        allOptions.forEach(option => {
            const priceText = option.querySelector('.value').textContent;
            const massText = option.querySelector('.mass').textContent;
    
            const price = parseFloat(priceText);
            const mass = parseFloat(massText.replace(/\D/g, '')); 
    
            if (!isNaN(price)) {
                totalPrice += price;
            }
    
            if (!isNaN(mass)) {
                totalMass += mass;
            }
        });
    
        const totalPriceElem = totalPriceRow.querySelector('.total-price');
        const totalMassElem = totalPriceRow.querySelector('.total-mass');
    
        totalPriceElem.textContent = totalPrice.toFixed(2);
        totalMassElem.textContent = totalMass.toFixed(2);
    };
    
    
    addBtns.forEach(addBtn => {
        addBtn.addEventListener('click', () => {
            const burgerItem = addBtn.closest('.burger-item');
            const originalSelect = burgerItem.querySelector('.craft-select');
            const cloneSelect = originalSelect.cloneNode(true);

            const selectContainer = document.createElement('div');
            selectContainer.classList.add('field-wrap');
            selectContainer.appendChild(cloneSelect);

            const deleteBtn = document.createElement('div');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<img src="img/delete.png" alt="delete">';

            const allOptions = document.createElement('div');
            allOptions.classList.add('field-row', 'burger-options');
            allOptions.dataset.option = cloneSelect.dataset.option;

            allOptions.appendChild(selectContainer);
            burgerItem.insertBefore(allOptions, addBtn);
            allOptions.appendChild(deleteBtn);

            deleteBtn.addEventListener('click', () => {
                allOptions.remove();
                removeImgByOption(allOptions.dataset.option);
                removeResultRow(allOptions.dataset.option);
                calculateTotalPriceAndMass();
            });

            [originalSelect, cloneSelect].forEach(select => {
                select.addEventListener('change', () => {
                    updateRightSideImgs(burgerItem, allOptions, select);
                    updateCraftResults(allOptions, select.querySelector('option:checked'));
                });
            });

            const selectedOption = originalSelect.querySelector('option:checked');
            if (selectedOption) {
                cloneSelect.value = selectedOption.value;
                updateRightSideImgs(burgerItem, allOptions, originalSelect);
                updateCraftResults(allOptions, selectedOption);
            }

            if (!firstSelectAdded) {
                updateCraftResults(allOptions, selectedOption);
                firstSelectAdded = true;
            }
        });
    });

    const updateRightSideImgs = (burgerItem, allOptions, select) => {
        const rightSideImgs = document.querySelector('.right-side .burger-images');
        const optionValue = allOptions.dataset.option;
        const selectedOption = select.querySelector('option:checked');

        if (selectedOption && selectedOption.value !== "") {
            const imgPath = selectedOption.dataset.img;
            if (imgPath !== null) {
                const labelText = selectedOption.text.replace(/\([^)]*\)/g, '').trim();
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('burger-image', 'burger-center');
                imageDiv.dataset.option = optionValue;
                imageDiv.innerHTML = `<span class="image-text-right">${labelText}</span>
                                      <img class="jelly" src="${imgPath}" alt="${labelText}" title="${labelText}">`;
                rightSideImgs.appendChild(imageDiv);
            }
        }

        addImgsBetweenBlocks(rightSideImgs);
    };

    const removeImgByOption = (optionValue) => {
        const rightSideImgs = document.querySelector('.right-side .burger-images');
        const imgToRemove = rightSideImgs.querySelector(`.burger-image[data-option="${optionValue}"]`);
        if (imgToRemove) {
            imgToRemove.remove();
        }
    };

    const removeResultRow = (optionValue) => {
        const craftResults = document.querySelector('.craft-totals.burger-craft-results');
        const resultRowToRemove = craftResults.querySelector(`.result-row[data-option="${optionValue}"]`);
        if (resultRowToRemove) {
            resultRowToRemove.remove();
        }
    };

    const addImgsBetweenBlocks = (rightSideImgs) => {
        const topBlock = rightSideImgs.querySelector('.burger-top-image');
        const bottomBlock = rightSideImgs.querySelector('.burger-bottom-image');
        const newImgsContainer = document.createElement('div');
        newImgsContainer.classList.add('new-images-container');
        const existingImgs = rightSideImgs.querySelectorAll('.burger-image:not(.burger-top-image):not(.burger-bottom-image)');
        existingImgs.forEach(image => {
            newImgsContainer.appendChild(image);
        });
        rightSideImgs.insertBefore(newImgsContainer, bottomBlock);
    };
});

