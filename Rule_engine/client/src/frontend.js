import React, { useState } from 'react';

function App() {
    // State variables
    const [ruleString, setRuleString] = useState('');
    const [astNode, setAstNode] = useState(null);
    const [rules, setRules] = useState(['']);
    const [combinedAST, setCombinedAST] = useState(null);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const [evaluationResult, setEvaluationResult] = useState(null);

    // Handlers for creating rules
    const handleSubmited = async (e) => {
        e.preventDefault();
        try{
          
        const response = await fetch('http://localhost:8085/api/create_rule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rule_string: ruleString }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Rule Created Successfully...');
        } else {
            setError(data.message);
        }
      } catch (err) {
        console.error('Error Creating rules:', err);
        alert('An error occurred while Creating the rules.');
    }
};

    // Handlers for combining rules
    const handleRuleChange = (index, event) => {
        const newRules = [...rules];
        newRules[index] = event.target.value;
        setRules(newRules);
    };

    const addRuleField = () => setRules([...rules, '']);
    const removeRuleField = (index) => setRules(rules.filter((_, i) => i !== index));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setEvaluationResult(null);

        try {
            const response = await fetch('http://localhost:8085/api/combine_rules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rules }),
            });

            const data = await response.json();
            if (response.ok) {
                setCombinedAST(data.combinedAST);
                alert('Rules Combined Successfully');
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error combining rules:', err);
            alert('An error occurred while combining the rules.');
        }
    };

    // Handlers for evaluation
    const handleUserDataChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleEvaluateRule = async (event) => {
        event.preventDefault();
        setError(null);
        setEvaluationResult(null);

        try {
            const response = await fetch('http://localhost:8085/api/evaluate_rule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ast: combinedAST, userData }),
            });

            const data = await response.json();
            if (response.ok) {
                setEvaluationResult(data.result);
                alert('Rule Evaluated Successfully');
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error evaluating rule:', err);
            alert('An error occurred while evaluating the rule.');
        }
    };

    return (
      <div className="container">
     <h1>Rule Engine</h1>
      <div className="section-box section-create">
          <h2 className="title">Create Rule</h2>
          <form onSubmit={handleSubmited}>
              <input
                  type="text"
                  className="input-field"
                  value={ruleString}
                  onChange={(e) => setRuleString(e.target.value)}
                  placeholder="Enter rule string"
              />
              <button type="submit" className="btn btn-submit">Submit</button>
          </form>
      </div>
  
      {/* Rule Combination Section  */}
      <div className="section-box section-combine">
          <h2 className="title">Combine Rules</h2>
          <form onSubmit={handleSubmit}>
              {rules.map((rule, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                      <input
                          type="text"
                          className="input-field"
                          value={rule}
                          onChange={(event) => handleRuleChange(index, event)}
                          placeholder={`Rule ${index + 1}`}
                          required
                      />
                      <button type="button" className="btn btn-remove" onClick={() => removeRuleField(index)}>
                          Remove
                      </button>
                  </div>
              ))}
              <button type="button" className="btn btn-add" onClick={addRuleField}>
                  Add Rule
              </button>
              <button type="submit" className="btn btn-submit">Combine Rules</button>
          </form>
      </div>
  
      {/* User Data Input Section */}
      <div className="section-box section-evaluate">
          <h2 className="title">Evaluate Rule</h2>
          <form onSubmit={handleEvaluateRule}>
              <div>
                  <label className="label">Age:</label>
                  <input type="number" name="age" className="input-field" onChange={handleUserDataChange} required />
              </div>
              <div>
                  <label className="label">Department:</label>
                  <input type="text" name="department" className="input-field" onChange={handleUserDataChange} required />
              </div>
              <div>
                  <label className="label">Salary:</label>
                  <input type="number" name="salary" className="input-field" onChange={handleUserDataChange} required />
              </div>
              <div>
                  <label className="label">Experience:</label>
                  <input type="number" name="experience" className="input-field" onChange={handleUserDataChange} required />
              </div>
              <button type="submit" className="btn btn-submit">Evaluate Rule</button>
          </form>
      </div>
  
      {/* Evaluation Result Display */}
      {evaluationResult !== null && (
          <div className="section-box result">
              <h2 className="result-text">Evaluation Result: {evaluationResult ? 'True' : 'False'}</h2>
          </div>
      )}
  
      {/* Error Display */}
      {error && <p className="error-message">Error: {error}</p>}
  </div>
  
    );
}

export default App;
