let currentExpression = '';
let shouldReset = false;

const expressionDisplay = document.getElementById('expression');
const previewDisplay = document.getElementById('preview');

function updateDisplay() {
    if (currentExpression === '') {
        expressionDisplay.textContent = '0';
        previewDisplay.textContent = '';
        return;
    }

    expressionDisplay.textContent = currentExpression;
   
    const preview = calculatePreview(currentExpression);
    if (preview !== null && preview !== currentExpression) {
        previewDisplay.textContent = preview;
    } else {
        previewDisplay.textContent = '';
    }
}

function calculatePreview(expr) {
    try {
      
        let jsExpr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\%/g, '/100')
            .replace(/,/g, '');

      
        if (/[\+\-\*\/]$/.test(jsExpr)) {
            return null;
        }

     
        const result = eval(jsExpr);
       
        const rounded = Math.round(result * 100000000) / 100000000;
        
        return rounded.toString();
    } catch (e) {
        return null;
    }
}

function inputNumber(num) {
    if (shouldReset) {
        currentExpression = '';
        shouldReset = false;
    }

    
    if (num === '.') {
        const parts = currentExpression.split(/[\+\-\×\÷]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            return;
        }
    }

 
    if (currentExpression === '0' && num !== '.') {
        currentExpression = num;
    } else {
        currentExpression += num;
    }

    updateDisplay();
}

function inputOperator(op) {
    if (currentExpression === '') {
        return;
    }

    if (/[\+\-\×\÷\%]$/.test(currentExpression)) {
        currentExpression = currentExpression.slice(0, -1) + op;
    } else {
        currentExpression += op;
    }

    shouldReset = false;
    updateDisplay();
}

function calculate() {
    if (currentExpression === '') {
        return;
    }

    const result = calculatePreview(currentExpression);
    if (result === null) {
        return;
    }

    currentExpression = result;
    shouldReset = true;
    updateDisplay();
}

function clearAll() {
    currentExpression = '';
    shouldReset = false;
    
    updateDisplay();
}

function backspace() {
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }
}

function percentage() {
    if (currentExpression === '') {
        return;
    }

   
    if (/[\+\-\×\÷\%]$/.test(currentExpression)) {
        currentExpression = currentExpression.slice(0, -1) + '%';
    } else {
        currentExpression += '%';
    }

    shouldReset = false;
    updateDisplay();
}


document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputNumber('.');
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('×');
    } else if (key === '/') {
        event.preventDefault();
        inputOperator('÷');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '%') {
        percentage();
    }
});

updateDisplay();