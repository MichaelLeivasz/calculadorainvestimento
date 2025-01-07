import { generateReturnsArray } from './src/investmentGoals';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
let doughnutChartReference = {};
let barChartReference = {};

const columnsArray = [
    { columnLabel: 'Mês', accessor: 'month' },
    {
        columnLabel: 'Total Investido',
        accessor: 'investedAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento Mensal',
        accessor: 'interestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento Total',
        accessor: 'totalInterestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Quantia Total',
        accessor: 'totalAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
];

function formatCurrencyToTable(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formatCurrencyToGraph(value) {
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

    const returnsArray = generateReturnsArray(
        startingAmountElement,
        timeAmountElement,
        timeAmountPeriodElement,
        addiitionalContributionElement,
        returnRateElement,
        returnRatePeriodElement
    );

    const finalInvestmentObject = returnsArray[returnsArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: ['Total Investido', 'Rendimento', 'Imposto'],
            datasets: [
                {
                    data: [
                        formatCurrencyToGraph(
                            finalInvestmentObject.investedAmount
                        ),
                        formatCurrencyToGraph(
                            finalInvestmentObject.totalInterestReturns *
                                (1 + taxRateElement / 100)
                        ),
                        formatCurrencyToGraph(
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
            labels: returnsArray.map(
                (investmentObject) => investmentObject.month
            ),
            datasets: [
                {
                    label: 'Total Investido',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.investedAmount)
                    ),
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Retorno de investimento',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.interestReturns)
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

    createTable(columnsArray, returnsArray, 'results-table');
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
