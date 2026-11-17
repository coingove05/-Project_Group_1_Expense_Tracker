const pool = require('./db')
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//api endpoints

//creating new expense

app.get('/api/expenses', async (req,res) => {
	try{
		const result = await pool.query(
			'SELECT * FROM expenses'
		); 

		res.json(result.rows);

	}catch(err){
		console.error(err.message);
		res.status(500).json({error:err.message});
	}


});

app.post('api/expenses', async (req,res) => {
	try{
		const{
			Groceries,
			Rent,
			Entertainment,
			Car,
			Insurance,
			Utilities
		} = req.body;

		const result = await pool.query(
			`INSERT INTO expenses
			(Groceries, Rent, Entertainment, Car, Insurance, Utilities)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *`,
			[
				Groceries,
				Rent,
				Entertainment,
				Car,
				Insurance,
				Utilities
			]
		);
		res.status(201).json(result.rows[0]);

	} catch(err) {
		console.error(err.message);
		res.status(500).json({error: err.message});
	}
});

//Update expense

app.put('/api/expenses/:id', async (req,res) => {
	try{
		const { id } = req.params;

		const {
			Groceries,
			Rent,
			Entertainment,
			Car,
			Insurance,
			Utilities
		} =req.body;
		
		const result = await pool.query(
			`UPDATE expenses
			SET Groceries = $1
				Rent = $2,
                Entertainment = $3,
                Car = $4,
                Insurance = $5,
                Utilities = $6
			WHERE id = &7
			RETURNING *`
			[
				Groceries,
				Rent,
				Entertainment,
				Car,
				Insurance,
				Utilities,
				id
			]
		);
		
		if (result.rows.length === 0) {
			return res.status(404).json({
				error: 'Expense info not found'
			});
		}

		res.json(result.rows[0])
	
	} catch (err) {
		console.error(err.message);
		res.status(500).json({error:err.message});
	}
});

//Delete expense
app.delete('/api/expenses/:id', async (req,res) => {
	try{
		const { id } = req.params;

		const result = await pool.query(
			`DELETE FROM expenses WHERE id = $1 RETURNING *`,
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({
				error: 'Expense info not found'
			});
		}

		res.json({
			message: 'Expense deleted',
			deleted: result.rows[0]
		});
	}catch (err) {
		console.error(err.message);
		res.status(500).json({error: err.message});
	}

});

//backend health checks

app.get('/api/health', (req, res) => {
	    res.json({ message: 'Backend connected!' });
});

app.get('/api/database', async (req,res) => {
	try {
		const result = await pool.query('SELECT NOW()');

		res.json({
			message: 'Database Connected',
			time: result.rows[0].now
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).json({
			error: 'Database failed to connect'
		});
	}
});

app.get('/api/test-db', async (req,res) => {
	try {
		const result = await pool.query(
			'SELECT * FROM expenses'
		);

		res.json(result.rows);

	} catch(err){
		console.error('Db error:', err.message);
		res.status(500).json({error: err.message});
	}

});

//expense calculation
app.get('/api/expenses/total', async (req,res) =>{
	try{
		const result = await pool.query(
			`SELECT
				COALESCE(Groceries, 0) +
				COALESCE(Rent, 0) +
				COALESCE(Entertainment, 0) +
				COALESCE(Car, 0) +
				COALESCE(Insurance, 0) +
				COALESCE(Utilities, 0) AS total
			FROM expenses
			WHERE id = 1
			`
		);

		if(result.rows.length === 0) {
			return res.status(404).json({
				error: 'expenses not found'
			});

		}

		res.json({
			total: Number(result.rows[0].total)
		});

	} catch(err){
		console.error(err.message);
		res.status(500).json({
			error: 'could not calculate'
		});
		
	}
});

const PORT = 8000;

app.patch('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount } = req.body;

        const allowedCategories = [
            'groceries',
            'rent',
            'entertainment',
            'car',
            'insurance',
            'utilities'
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const result = await pool.query(
            `UPDATE expenses
             SET ${category} = ${category} + $1
             WHERE id = $2
             RETURNING *`,
            [amount, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
	    console.log(`Server running on port ${PORT}`);
});

