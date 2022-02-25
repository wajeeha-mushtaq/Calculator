let screen = document.getElementById('output');
buttons = document.querySelectorAll('.btn');
let screenValue = '';

for(item of buttons){
    item.addEventListener('click', (e) => {
      buttonText = e.target.innerText;
      screen.value += buttonText;
    })
  }

/* HISTORY PART */
var x=0;
var expression_arr = Array();
var result_arr = Array();

function add_element_to_array(exp, res)
{
  expression_arr[x] = exp;
  result_arr[x] = res;
  x++;
  display_array();
}

function display_array()
{
   var e = "";

   for (var y=0; y<expression_arr.length; y++)
   {
     e += "Expression: " + expression_arr[y] + " Result: "+ result_arr[y] + "<br/>";
     document.getElementById("expression").innerHTML = e;
    }
}

/* OPERATORS FUNCTIONS */

function pi(){
  screen.value+=3.14159;
}

function euler(){
  screen.value+=2.71828;
}

function backspec(){
  screen.value = screen.value.substr(0,screen.value.length-1);
}

/* OPERATORS OBJECT */
operators =  {
    "(": {
        "pre": 0,
        "rule": 0,
        "unary": 0
    },
    "+": {
        "pre": 2,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a + b;
        }
    },
    "-": {
        "pre": 2,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a - b;
        }
    },
    "*": {
        "pre": 3,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a * b;
        }
    },
    "/": {
        "pre": 3,
        "rule": 0,
        "unary": 0,
        "func": (a, b) => {
            return a / b;
        }
    },
    "sqrt(": {
        "pre": 6,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.sqrt(n);
        }
    },
    "sin(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.sin(n);
        },

    },
    "cos(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.cos(n);
        }
    },
    "tan(": {
        "pre": 5,
        "rule": 1,
        "unary": 1,
        "func": (n) => {
            return Math.tan(n)
        }
    },
    ")": {
        "pre": -1,
        "rule": 0,
        "unary": 0
    }
  };


  Ops = ["+", "-", "*", "/", "sqrt("];
  trigs = ["e(", "sin(", "cos(", "tan("];

    isOperand = function (_in) {
        return !isNaN(_in);
    };

    isOperator = function (o_p) {
        return Ops.includes(o_p);
    };

    isDigit = function (n) {
        let numReg = /[0-9]/i;
        return numReg.test(n);
    };


    peek = function (arr_) {
        return arr_[arr_.length - 1];
    };

    isTrig = function (t) {
        return trigs.includes(t);
    };

    /* INFIX TO POSTFIX */
    function InfixtoPostfix(_infix) {
        let _post = [];
        let _stack = [];

        for (i = 0; i < _infix.length; i++) {
            let tok = _infix[i];
            if (isOperand(tok)) {
                _post.push(tok);
            } else if (tok === "(") {
                _stack.push(tok);
            } else if (tok === ")") {
                while (_stack.length > 0 && peek(_stack) !== "(") {
                    _post.push(_stack.pop());
                }
                _stack.pop();
            } else if (isOperator(tok) || isTrig(tok)) {
                a = tok;
                b = peek(_stack);

                while (_stack.length > 0 && b !== "(" && ((!operators[a].rule && (operators[a].pre <= operators[b].pre)) ||
                        (operators[a].rule && (operators[a].pre < operators[b].pre)))) {
                    _post.push(_stack.pop());
                    b = peek(_stack);
                }
                _stack.push(a);
            }
        }

        while (_stack.length > 0) {
            let v = _stack.pop();
            if (v !== "(" && v !== ")") {
                _post.push(v);
            }
        }
        return _post;
    }

    function postfixEval(_postfix) {
        if (!_postfix.includes("(") && !_postfix.includes(")")) {
            let _out = [];
            for (i = 0; i < _postfix.length; i++) {
                let t = _postfix[i];
                if (isOperand((t))) {
                    _out.push(t);
                } else {
                    if (operators[t].unary) {
                        e = Number(_out.pop());
                        _out.push(operators[t].func(e).toString());
                    } else {
                        a = Number(_out.pop());
                        b = Number(_out.pop());
                        _out.push(operators[t].func(b, a).toString());
                    }
                }
            }
            return _out[0];
        }
    }


    ins = [];
    _syntax = [];

    function AddValue(str) {
        let val = str.toString();
        let pk = peek(ins);
        if (pk === null || pk === undefined) {
            ins.push(val);
        } else if (pk.includes(".") || isDigit(pk)) {
            ins.push(ins.pop().toString() + val);
        } else if (pk === "-" || pk === "+") {
            let dp = ins[ins.length - 2];
            if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
                ins.push(ins.pop().toString() + val);
            } else {
                ins.push(str);
            }
        } else {
            ins.push(str);
        }
    }


    function handleTrig(trig) {
        switch (trig.substring(0, 4)) {
                case "sin(":
                    ins.push(trigs[1]);
                    break;
                case "cos(":
                    ins.push(trigs[2]);
                    break;
                case "tan(":
                    ins.push(trigs[3]);
                    break;
        }
    }

    //operators handler
    function handleOperator(op) {
        for (let i = 0; i < Ops.length; i++) {
            if (Ops[i] === op) {
                ins.push(Ops[i]);
            }
        }
    }

    //constants control handler
    function handleConst(constant) {
        if (constant === "eⁿ") {
            ins.push("e(");
        } else {
            ins.push(constant);
        }
    }

    //point or float sign control//
    function AddPoint(str) {
        let peek = ins[ins.length - 1];
        if (peek === null || peek === undefined) {
            ins.push(str);
        } else if (!peek.includes(".")) {
            if (isOperand(peek)) {
                ins.push(ins.pop().toString() + str);
            } else {
                ins.push(str);
            }
        }
    }

    //braces control handler
    function AddBrace(str) {
        ins.push(str);
    }

    function resolveConsts() {
        let _const = ["e", "π"];

        for (i = 0; i < ins.length; i++) {
            let curr = ins[i];
            if (_const.includes(curr)) {
                if (isOperand(ins[i - 1]) || ins[i - 1] === ")") {
                    ins.splice(i, 0, "*");
                    ins[i + 1] = (curr === _const[0]) ? Math.E : Math.PI;
                } else if (ins[i - 1] === "-" || ins[i - 1] === "+") {
                    let dp = ins[i - 2];
                    if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
                        let op = ins[i - 1];
                        ins.splice(i - 1, 2, op + ((curr === _const[0]) ? Math.E : Math.PI));
                    }
                }
            }
        }
    }

    function Evaluate() {
        resolveConsts();
        let output = InfixtoPostfix(ins);
        let result = postfixEval(output);
        ins = [];
        ins.push(result);
        display();
    }


    function display() {
        let v = ins.join();
        document.getElementById('output').value = st(v).toString();
    }

    let st = function (v) {
        return v.replace(/,/g, "");
    };

    //clears input screen/
    function screenclear() {
        ins = [];
        screen.value='';
        display();
    }