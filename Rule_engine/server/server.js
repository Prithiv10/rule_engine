const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// const { create_rule } = require('./ast');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rule_engine_db'
});


db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));


class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;  
        this.left = left;  
        this.right = right;
        this.value = value; 
    }
}

app.post('/api/create_rule', (req, res) => {
    const { rule_string } = req.body;
    const astNode = parseRuleToAST(rule_string);

    
    const query = 'INSERT INTO rules (rule_string, ast_representation) VALUES (?, ?)';
    db.query(query, [rule_string, JSON.stringify(astNode)], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send({ message: 'Database error', error: err });
            return;
        }
        res.send({ message: 'Rule created', astNode });
    });
});


// Utility function to parse rule string into AST
const parseRuleToAST = (ruleString) => {
    const tokens = ruleString.split(' '); 
    let node = {};

   
    if (tokens.length === 3) {
        node = {
            operator: tokens[1],
            operand1: tokens[0],
            operand2: tokens[2]
        };
    }

   

    return node; 
};


const combineTwoNodesWithAND = (node1, node2) => {
    return {
        operator: 'AND',
        operand1: node1,
        operand2: node2
    };
};

// Function to combine rules into a single AST
const combine_rules = (rules) => {
    const parsedASTs = rules.map(ruleString => parseRuleToAST(ruleString));
    const operandMap = {};

    
    parsedASTs.forEach((ast) => {
        if (operandMap[ast.operand1]) {
            const existingNode = operandMap[ast.operand1];
            if (existingNode.operator === '>' && ast.operator === '<') {
                operandMap[ast.operand1] = {
                    operator: 'BETWEEN',
                    operand1: ast.operand1,
                    operand2: existingNode.operand2, 
                    operand3: ast.operand2            
                };
            } else {
                operandMap[ast.operand1] = combineTwoNodesWithAND(existingNode, ast);
            }
        } else {
            operandMap[ast.operand1] = ast;
        }
    });

    
    const astNodes = Object.values(operandMap);
    let combinedAST = astNodes[0];

    for (let i = 1; i < astNodes.length; i++) {
        combinedAST = combineTwoNodesWithAND(combinedAST, astNodes[i]);
    }

    return combinedAST;
};



app.post('/api/combine_rules', (req, res) => {
    const { rules } = req.body;

    if (!Array.isArray(rules) || rules.length === 0) {
        return res.status(400).json({ message: 'No rules provided' });
    }

    try {
        // Combine the rules into a single AST
        const combinedAST = combine_rules(rules);

        res.json({ combinedAST });
    } catch (error) {
        console.error('Error combining rules:', error);
        res.status(500).json({ message: 'Error combining rules' });
    }
});





//evaluate
const evaluateCondition = (operator, operand1, operand2, userData) => {
    const value = userData[operand1]; 
    
    switch (operator) {
        case '>':
            return value > operand2;
        case '<':
            return value < operand2;
        case '==':
            return value == operand2;
        case 'BETWEEN':
            return value > operand2[0] && value < operand2[1];  
        default:
            return false;
    }
};

// Function to evaluate the combined rule (AST) against user data
const evaluate_rule = (ast, userData) => {
     
    if (ast.operator === 'AND') {
        return evaluate_rule(ast.operand1, userData) && evaluate_rule(ast.operand2, userData);
    }
    if (ast.operator === 'OR') {
        return evaluate_rule(ast.operand1, userData) || evaluate_rule(ast.operand2, userData);
    }
    if (ast.operator === 'NOT') {
        return !evaluate_rule(ast.operand1, userData);
    }

    if (['>', '<', '==', 'BETWEEN'].includes(ast.operator)) {
        return evaluateCondition(ast.operator, ast.operand1, [ast.operand2, ast.operand3], userData);
    }

    return false; 
};

app.post('/api/evaluate_rule', (req, res) => {
    const { ast, userData } = req.body;

    if (!ast || !userData) {
        return res.status(400).json({ message: 'AST and user data are required' });
    }

    try {
        const result = evaluate_rule(ast, userData);
        res.json({ result });
    } catch (error) {
        console.error('Error evaluating rule:', error);
        res.status(500).json({ message: 'Error evaluating rule' });
    }
});



app.listen(8085, () => {
    console.log('Server is running on port 8085');
});

