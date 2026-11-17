CREATE TABLE expenses (
	id SERIAL PRIMARY KEY,
	Groceries DECIMAL(10,2),
	Rent DECIMAL(10,2),
	Entertainment DECIMAL(10,2),
	Car DECIMAL(10,2),
	Insurance DECIMAL(10,2),
	Utilities DECIMAL(10,2)
);

INSERT INTO expenses (Groceries, Rent, Entertainment, Car, Insurance, Utilities)
VALUES (120.00, 1000.00, 50.00, 120, 60, 90.00);

SELECT * FROM expenses;

DELETE FROM expenses
WHERE id = 3;

DROP TABLE expenses;