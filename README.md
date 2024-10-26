# rule_engine
***Project overview***

This is a React-based application for creating, combining, and evaluating rules. Users can input rules, combine them into an Abstract Syntax Tree (AST), and evaluate user data based on the combined rules.

**Usage**
1. Create Rule
* In the "Create Rule" section, enter a rule string (e.g., "age > 25 && salary > 50000").
* Click Submit to create the rule.
* On success, a notification will appear indicating the rule was created successfully.
  
2. Combine Rules
* In the "Rule Combination Tool" section, enter multiple rules.
* Click Add Rule to include additional rules if needed.
* Click Combine Rules to combine them into an AST structure, which the backend will return.
* On success, a notification will confirm the combination of rules.
  
3. Evaluate Rule
* In the "Enter User Data" section, input values for Age, Department, Salary, and Experience.
* Click Evaluate Rule to evaluate the user data against the combined rules.
* If the evaluation is successful, the result (True or False) will appear under "Evaluation Result."

***Install dependencies***

 npm install

 ***Start the frontend:***
 
 cd client
 npm start

 ***Start the Backend:***

 cd server
 node server.js
