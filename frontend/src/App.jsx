
import { useState, useEffect } from 'react';

function App() {

    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState('groceries');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState(0);

    // Retrieve database information
    const fetchExpenses = async () => {
        try {
            const response = await fetch(
                'http://localhost:8000/api/expenses'
            );

            const data = await response.json();

            setExpenses(data);

        } catch (error) {
            console.error('Error retrieving expenses:', error);
        }
    };

    const fetchTotal = async () => {
      try{
        const response = await fetch(
          'http://localhost:8000/api/expenses/total'
        );

        const data =  await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setTotal(data.total);

      } catch(error){
        console.error('could not calculate', error);
      }
    };

    // Load database information when page loads
    useEffect(() => {
        fetchExpenses();
        fetchTotal();
    }, []);

    // Add an expense
    const addExpense = async () => {

        if (amount === '' || Number(amount) <= 0) {
            alert('Enter a valid expense amount');
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:8000/api/expenses/1',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        category: category,
                        amount: Number(amount)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add expense');
            }

            console.log('Updated database:', data);

            setAmount('');

            // Refresh displayed database values
            fetchExpenses();
            fetchTotal();

        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div style={{ padding: '30px' }}>

            <h1>Expense Tracker</h1>

            <h2>Current Expenses</h2>

            {expenses.map((expense) => (
                <div key={expense.id}>
                    <p>Groceries: ${expense.groceries}</p>
                    <p>Rent: ${expense.rent}</p>
                    <p>Entertainment: ${expense.entertainment}</p>
                    <p>Car: ${expense.car}</p>
                    <p>Insurance: ${expense.insurance}</p>
                    <p>Utilities: ${expense.utilities}</p>
                </div>
            ))}

            <hr />

            <h2>Add Expense</h2>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="groceries">Groceries</option>
                <option value="rent">Rent</option>
                <option value="entertainment">Entertainment</option>
                <option value="car">Car</option>
                <option value="insurance">Insurance</option>
                <option value="utilities">Utilities</option>
            </select>

            <br /><br />

            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <br /><br />

            <button onClick={addExpense}>
                Add Expense
            </button>

            <h2>Total Expenses</h2>

            <h1>${total.toFixed(2)}</h1>

        </div>
    );
}

export default App;
