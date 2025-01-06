import { generateReturnsArray } from './src/investmentGoals';

const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        return;
    }

    const startingAmountElement = Number(
        document.getElementById('starting-amount').value.replace(',', '.')
    );
    const addiitionalContributionElement = Number(
        document
            .getElementById('additional-contribution')
            .value.replace(',', '.')
    );
    const timeAmountElement = Number(
        document.getElementById('time-amount').value
    );
    const timeAmountPeriodElement =
        document.getElementById('time-amount-period').value;
    const returnRateElement = Number(
        document.getElementById('return-rate').value.replace(',', '.')
    );
    const returnRatePeriodElement =
        document.getElementById('evaluation-period').value;
    const taxRateElement = Number(
        document.getElementById('tax-rate').value.replace(',', '.')
    );

    const returnArray = generateReturnsArray(
        startingAmountElement,
        timeAmountElement,
        timeAmountPeriodElement,
        addiitionalContributionElement,
        returnRateElement,
        returnRatePeriodElement
    );

    console.log(returnArray);
}

function clearForm() {
    form['starting-amount'].value = '';
    form['additional-contribution'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    const errorInputs = document.querySelectorAll('.error');

    for (const eI of errorInputs) {
        eI.classList.remove('error');
        eI.parentElement.querySelector('p').remove();
    }
}

function validateInput(evt) {
    if (evt.target.value === '') {
        return;
    }

    const { parentElement } = evt.target;
    const grandParentElement = evt.target.parentElement.parentElement;
    const inputValue = evt.target.value.replace(',', '.');

    if (
        !parentElement.classList.contains('error') &&
        (isNaN(inputValue) || Number(inputValue) <= 0)
    ) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText =
            'Insira um valor numérico e maior que zero';
        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if (
        parentElement.classList.contains('error') &&
        !isNaN(inputValue) &&
        Number(inputValue) > 0
    ) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

for (const formElement of form) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput);
    }
}

form.addEventListener('submit', renderProgression);
clearFormButton.addEventListener('click', clearForm);
