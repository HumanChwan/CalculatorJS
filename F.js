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



let clickMeNya = document.getElementById("btn");

function main() {

    let expression = document.getElementById("single").value;
    expression = expression.replace('x', '*');
    let answer = evaluate(infixToPostfix(expressionParser(expression)));
    // document.getElementById("postfix").innerHTML = infixToPostfix(expressionParser(expression));
    if(typeof answer === 'undefined' || isNaN(answer)) {
        document.getElementById("Answer").innerHTML = 'Input Error :(';
        let p = document.getElementById("Answer");
        p.classList.add("answer-wrong");
    } else if(answer === Infinity) {
        document.getElementById("Answer").innerHTML = 'Dividing by Zero is bad boi move';
        let p = document.getElementById("Answer");
        p.classList.add("answer-wrong");
    } else {
        document.getElementById("Answer").innerHTML = 'Answer : ' + answer;
        let p = document.getElementById("Answer");
        p.classList.remove('answer-wrong');
    }
};


// clickMeNya.addEventListener('mousedown', () => {
//     document.getElementById('btn').classList.add('press');
// });
// clickMeNya.addEventListener('mouseup', () => {
//     document.getElementById('btn').classList.remove('press');
// });

function modeChange() {
    document.body.classList.toggle('light');
    if(document.body.classList.contains('light'))
        document.getElementById('mode-shift').innerHTML = 'Dark :';
    else 
        document.getElementById('mode-shift').innerHTML = 'Light :'
}