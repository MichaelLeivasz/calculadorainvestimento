import { generateReturnsArray } from './src/investmentGoals';
import { Chart } from 'chart.js/auto';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
let doughnutChartReference = {};
let barChartReference = {};

function formatCurrency(value) {
    return value.toFixed(2);
}

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        return;
    }

    resetCharts();

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

    const finalInvestmentObject = returnArray[returnArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: ['Total Investido', 'Rendimento', 'Imposto'],
            datasets: [
                {
                    data: [
                        formatCurrency(finalInvestmentObject.investedAmount),
                        formatCurrency(
                            finalInvestmentObject.totalInterestReturns *
                                (1 + taxRateElement / 100)
                        ),
                        formatCurrency(
                            finalInvestmentObject.totalInterestReturns
                        ),
                    ],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        },
    });

    barChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnArray.map(
                (investmentObject) => investmentObject.month
            ),
            datasets: [
                {
                    label: 'Total Investido',
                    data: returnArray.map((investmentObject) =>
                        formatCurrency(investmentObject.investedAmount)
                    ),
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Retorno de investimento',
                    data: returnArray.map((investmentObject) =>
                        formatCurrency(investmentObject.interestReturns)
                    ),
                    backgroundColor: 'rgb(54, 162, 235)',
                },
            ],
        },
        options: {
            responsive: true,
            scales: { x: { stacked: true }, y: { stacked: true } },
        },
    });
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetCharts() {
    if (
        !isObjectEmpty(doughnutChartReference) &&
        !isObjectEmpty(barChartReference)
    ) {
        doughnutChartReference.destroy();
        barChartReference.destroy();
    }
}

function clearForm() {
    form['starting-amount'].value = '';
    form['additional-contribution'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    resetCharts();

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
