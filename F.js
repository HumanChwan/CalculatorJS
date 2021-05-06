"use strict";


let precedence = (operator) => {
    switch(operator) {
        case '-':
            return 1;
        case '+':
            return 2;
        case '*':
            return 3;
        case '%':
            return 4;
        case '/':
            return 5;
        case '^':
            return 6;
        default:
            return 0;
    }
};

let expressionParser = (expression) => {
    let expressionAsList = []
    let cache = '';
    for(let i = 0; i < expression.length; ++i) {
        if(precedence(expression[i]) || expression[i] === '(' || expression[i] === ')') {
            if(expression[i] === '+' || expression[i] === '-') {
                if(!i || precedence(expression[i-1]) || expression[i-1] === '('){
                    cache += '0';
                }
            }
            if(cache.length) 
                expressionAsList.push(cache);
            cache = '';
            expressionAsList.push(expression[i]);
        }
        else if (expression[i] === ' ')
            continue;
        else {
            cache += expression[i];
        }
    }
    if(cache.length)
        expressionAsList.push(cache);
    return expressionAsList;
};

let infixToPostfix = (asList) => {
    let stack = [];
    let postfixList = [];
    for(let i = 0; i < asList.length; ++i) {
        if(!isNaN(asList[i]))
            postfixList.push(asList[i]);
        else if (asList[i] === '(') {
            if(i && !precedence(asList[i-1]) && asList[i-1] != '(') {
                while(stack.length > 0 && precedence('*') < precedence(stack[stack.length-1])) {
                    postfixList.push(stack.pop());
                }
                stack.push('*'); 
            }
            stack.push(asList[i]);
        }
        else if (asList[i] === ')') {
            while(stack[stack.length-1] != '(') {
                let a = stack.pop();
                postfixList.push(a);
            }
            stack.pop();
        } else if(asList[i] === '^') 
            stack.push(asList[i]);
        else {
            while(stack.length > 0 && precedence(asList[i]) < precedence(stack[stack.length-1])) {
                postfixList.push(stack.pop());
            }
            stack.push(asList[i]);
        }
    }
    while(stack.length) {
        postfixList.push(stack.pop());
    }
    return postfixList;
};


let addition = (a, b) => a+b;
let subtraction = (a, b) => a-b;
let multiplication = (a, b) => a*b;
let division = (a, b) => a/b;
let pow = (a, b) => a**b;
let modulo = (a, b) => a%b;

let functionName = {
    '+': addition,
    '-': subtraction,
    '*': multiplication,
    '/': division,
    '%': modulo,
    '^': pow
};


let evaluate = (postfixList) => {
    let stack = [];
    for(let i = 0; i < postfixList.length; ++i) {
        if(!isNaN(postfixList[i])) 
            stack.push(postfixList[i]);
        else {
            let one = parseFloat(stack.pop())
            if(isNaN(one)) {
                console.log('fail');
                return
            }
            let two = parseFloat(stack.pop())
            if(isNaN(two)) {
                console.log('fail');
                return
            }
            try {
                stack.push(functionName[postfixList[i]](two, one));
            } catch( er ) {
                console.log('fail : ' + er);
                return;
            }
        }
    }
    return parseFloat(stack.pop());
};



let infix = [];
let cache = '';
let main_expression = document.getElementById('main-expr');
let answer = document.getElementById("Answer");

function main() {
    if(cache.length)
        infix.push(cache);
    
    let answer = evaluate(infixToPostfix(infix));
    
    let toBeDisplayed = document.getElementById('Answer');
    if(typeof answer === 'undefined' || isNaN(answer)) {
        toBeDisplayed.innerHTML = 'Input Error :('
        toBeDisplayed.classList.add('answer-wrong')

    } else if(answer === Infinity) {
        toBeDisplayed.innerHTML = 'Dividing by Zero is bad boi move'
        toBeDisplayed.classList.add('answer-wrong')

    } else {
        toBeDisplayed.innerHTML = 'Answer : ' + answer
        toBeDisplayed.classList.remove('answer-wrong')

    }
    infix.pop()
};


function clear_main() {
    infix = [];
    cache = '';
    main_expression.innerHTML = `&nbsp;`
    answer.innerHTML = '';
}

function backspace() {
    if(cache.length) 
        infix.push(cache);
    let last_added = infix.pop();
    if('0' <= last_added && last_added <= '9') {
        try {
            last_added = last_added.slice(0, -1);
            if(last_added.length){
                infix.push(last_added);
                cache = last_added;
            } else {
                cache = '';
            }
        } catch ( er ){
            infix = [];
            cache = ''
        }
       
    }
    last_added = main_expression.innerText;
    if(last_added != `&nbsp;`)  {
        try {
            last_added = last_added.slice(0, -1);
        } catch ( er ){
            last_added = `&nbsp;`;
        }
    }
    let finalText = '';
    for(let i = 0; i < last_added.length; ++i) {
        if(precedence(last_added[i])) {
            finalText += `<span class="operator">` + last_added[i] + '</span>';
        } else if (last_added[i] === '(' || last_added[i] === ')') {
            finalText += `<span class="parenthesis">` + last_added[i] + '</span>';
        } else {
            finalText += last_added[i];
        }
    }
    main_expression.innerHTML = finalText;
}

function modeChange() {
    document.body.classList.toggle('light');
    if(document.body.classList.contains('light'))
        document.getElementById('mode-shift').innerHTML = 'Dark :';
    else 
        document.getElementById('mode-shift').innerHTML = 'Light :'
};



function add(toBeAdded) {   
    if(precedence(toBeAdded) || toBeAdded === '(' || toBeAdded === ')') {
        if (cache) {
            infix.push(cache);
        }
        cache = '';
        infix.push(toBeAdded);
    } else {
        cache += toBeAdded;
    }
    if(toBeAdded === '*') 
        toBeAdded = '×'
    else if(toBeAdded === '/')
        toBeAdded = '÷';

    if (precedence(toBeAdded)){
        main_expression.innerHTML += `<span class="operator">`+toBeAdded+`</span>`;
    } else if (toBeAdded === '(' || toBeAdded === ')') {
        main_expression.innerHTML += `<span class="parenthesis">`+toBeAdded+`</span>`;
    } else {
        main_expression.innerHTML += toBeAdded;
    }
};

