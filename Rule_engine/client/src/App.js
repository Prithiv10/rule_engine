import React, { useState } from 'react';
import './App.css';

function App() {
  const [ruleString, setRuleString] = useState('');
  const [userData, setUserData] = useState({ age: '', department: '', salary: '', experience: '' });
  const [eligibility, setEligibility] = useState(null);

  // Create Rule API Call
  const createRule = async (e) => {
    e.preventDefault();
    const response = await fetch(' http://localhost:5000/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleString }),
    });
    if (response.ok) {
      alert('Rule created successfully!');
    }
  };

  // Evaluate Rule API Call
  const evaluateRule = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/rules/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId: 1, data: userData }),
    });
    const result = await response.json();
    setEligibility(result.eligible);
  };

  return (
    <div className="App">
      <h1>Rule Engine</h1>

      {/* Form to create a rule */}
      <form onSubmit={createRule}>
        <input
          type="text"
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          placeholder="Enter rule"
        />
        <button type="submit">Create Rule</button>
      </form>

      {/* Form to evaluate a rule */}
      <form onSubmit={evaluateRule}>
        <input
          type="number"
          value={userData.age}
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
          placeholder="Age"
        />
        <input
          type="text"
          value={userData.department}
          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
          placeholder="Department"
        />
        <input
          type="number"
          value={userData.salary}
          onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
          placeholder="Salary"
        />
        <input
          type="number"
          value={userData.experience}
          onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
          placeholder="Experience"
        />
        <button type="submit">Evaluate Rule</button>
      </form>

      {eligibility !== null && (
        <p>{eligibility ? 'User is eligible' : 'User is not eligible'}</p>
      )}
    </div>
  );
}

export default App;
