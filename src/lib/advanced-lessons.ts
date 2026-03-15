import { Lesson } from './lessons';

export const advancedLessons: Lesson[] = [
  /* ══════════════════════════════════════════════════════════
     16 · Relational Integrity
     ══════════════════════════════════════════════════════════ */
  {
    id: 'relational-integrity',
    title: '16. Relational Integrity',
    description: 'Learn what relational integrity means and why databases enforce relationships between parent and child tables.',
    tables: ['customers', 'orders'],
    content: `# Relational Integrity

Relational databases are designed to store data across multiple tables to minimize redundancy and improve maintainability. But how do we ensure that data remains consistent across these tables? This is where **relational integrity** comes in.

## What is Relational Integrity?

**Relational integrity** (specifically *referential integrity*) is a database concept that ensures relationships between tables remain valid. It prevents you from creating "orphan records" — data that points to something that doesn't exist.

## Entity Relationships

In a database, tables represent **entities** (things). The connections between these entities are **relationships**.
- A **Parent table** holds the main records (e.g., \`Customers\`).
- A **Child table** holds related records that depend on the parent (e.g., \`Orders\`).

## Parent and Child Tables

Consider these example tables:

**Customers (Parent Table)**
| customer_id | name |
|-------------|------|
| 1 | Tech Corp |
| 2 | Global Importers |

**Orders (Child Table)**
| order_id | customer_id | amount |
|----------|-------------|--------|
| 101 | 1 | 2400 |
| 102 | 2 | 425 |

Here, the \`Orders\` table is the child because every order must belong to a customer. The \`customer_id\` in the \`Orders\` table references the \`customer_id\` in the \`Customers\` table.

## Why Enforce Relationships?

If a database didn't enforce these relationships:
1. You could insert an order with \`customer_id = 999\` even if Customer 999 doesn't exist.
2. You could delete Customer 1, leaving Order 101 pointing to a deleted customer (an orphan).

By enforcing relational integrity, the database system actively prevents both of these scenarios, protecting your data from corruption.`,
    defaultQuery: 'SELECT o.order_id, c.name, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;',
    examples: [
      { title: 'View Parent Records', description: 'See the customers table.', sql: 'SELECT * FROM customers;' },
      { title: 'View Child Records', description: 'See the orders table.', sql: 'SELECT * FROM orders;' },
      { title: 'Join Parent and Child', description: 'Combine them to see the relationship.', sql: 'SELECT o.order_id, c.name, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;' }
    ],
    exercises: [
      { id: 'ri_1', title: 'Find Parent Data', description: 'Select all columns from the customers table.', expectedSql: 'SELECT * FROM customers;', hint: 'Query the customers table.', solution: 'SELECT * FROM customers;' },
      { id: 'ri_2', title: 'Find Child Data', description: 'Select order_id and customer_id from the orders table.', expectedSql: 'SELECT order_id, customer_id FROM orders;', hint: 'Query the orders table.', solution: 'SELECT order_id, customer_id FROM orders;' },
      { id: 'ri_3', title: 'Count Child Records', description: 'Count how many orders belong to customer_id 1.', expectedSql: 'SELECT COUNT(*) FROM orders WHERE customer_id = 1;', hint: 'Use COUNT(*) and WHERE customer_id = 1.', solution: 'SELECT COUNT(*) FROM orders WHERE customer_id = 1;' },
      { id: 'ri_4', title: 'Join Parent and Child', description: 'Select order_id and customer name by joining orders and customers.', expectedSql: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;', hint: 'JOIN orders and customers ON customer_id.', solution: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;' },
      { id: 'ri_5', title: 'Find Missing Relationships', description: 'Find customers who have no orders using a LEFT JOIN and checking for NULL.', expectedSql: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;', hint: 'LEFT JOIN customers to orders, WHERE order_id IS NULL.', solution: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     17 · Primary Keys
     ══════════════════════════════════════════════════════════ */
  {
    id: 'primary-keys',
    title: '17. Primary Keys',
    description: 'Understand uniqueness, identifying rows, and composite primary keys.',
    tables: ['customers'],
    content: `# Primary Keys

A **Primary Key** is a specific column (or set of columns) that uniquely identifies each row in a table.

## Uniqueness

The most important rule of a primary key is that it must be **unique**. No two rows can have the same primary key value. It also must be **NOT NULL** (it cannot be empty).

## Identifying Rows

Consider a table of customers. You might have two customers named "John Smith". Without a unique identifier, it would be impossible for the database to tell them apart. A primary key (like an ID number) guarantees that every row can be unambiguously identified.

\`\`\`sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT
);
\`\`\`

By declaring \`customer_id\` as the \`PRIMARY KEY\`, the database engine will automatically prevent you from inserting a duplicate \`customer_id\`.

## Why Primary Keys Are Required

Primary keys are the foundation of database indexing and relationships. When you want to find a specific record quickly or connect a record to another table, the primary key is exactly what the database uses. Without it, relational databases cannot function efficiently.

## Composite Primary Keys

Sometimes, a single column isn't enough to uniquely identify a row. In these cases, you can use a **Composite Primary Key** — a primary key made up of two or more columns combined.

\`\`\`sql
CREATE TABLE order_items (
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  PRIMARY KEY (order_id, product_id)
);
\`\`\`

Here, multiple items can belong to the same \`order_id\`, and the same \`product_id\` can appear in many orders. But the combination of \`order_id\` AND \`product_id\` is unique across the entire table.`,
    defaultQuery: 'SELECT customer_id, name FROM customers ORDER BY customer_id;',
    examples: [
      { title: 'View Primary Keys', description: 'Notice how every customer_id is unique.', sql: 'SELECT customer_id, name FROM customers;' },
      { title: 'Search by Primary Key', description: 'Primary keys are the fastest way to look up a row.', sql: 'SELECT * FROM customers WHERE customer_id = 3;' },
      { title: 'Order by Primary Key', description: 'View rows sequentially by their ID.', sql: 'SELECT * FROM customers ORDER BY customer_id DESC;' }
    ],
    exercises: [
      { id: 'pk_1', title: 'Find Specific Row', description: 'Select the customer with customer_id 2.', expectedSql: 'SELECT * FROM customers WHERE customer_id = 2;', hint: 'Use WHERE customer_id = 2', solution: 'SELECT * FROM customers WHERE customer_id = 2;' },
      { id: 'pk_2', title: 'Check Uniqueness', description: 'Count the number of distinct customer_id values in the customers table.', expectedSql: 'SELECT COUNT(DISTINCT customer_id) FROM customers;', hint: 'Use COUNT(DISTINCT column_name).', solution: 'SELECT COUNT(DISTINCT customer_id) FROM customers;' },
      { id: 'pk_3', title: 'Create Table with PK', description: 'Write a CREATE TABLE query to create "users" with user_id as INTEGER PRIMARY KEY and email as TEXT.', expectedSql: 'CREATE TABLE users (user_id INTEGER PRIMARY KEY, email TEXT);', hint: 'CREATE TABLE users (user_id INTEGER PRIMARY KEY, email TEXT);', solution: 'CREATE TABLE users (user_id INTEGER PRIMARY KEY, email TEXT);' },
      { id: 'pk_4', title: 'Create Composite PK', description: 'Write a CREATE TABLE query for "enrollments" with student_id INTEGER, course_id INTEGER, and a PRIMARY KEY on (student_id, course_id).', expectedSql: 'CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, PRIMARY KEY (student_id, course_id));', hint: 'Add PRIMARY KEY (col1, col2) at the end of the column definitions.', solution: 'CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, PRIMARY KEY (student_id, course_id));' },
      { id: 'pk_5', title: 'Find Max Primary Key', description: 'Find the highest customer_id currently in the table.', expectedSql: 'SELECT MAX(customer_id) FROM customers;', hint: 'Use the MAX() function.', solution: 'SELECT MAX(customer_id) FROM customers;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     18 · Foreign Keys
     ══════════════════════════════════════════════════════════ */
  {
    id: 'foreign-keys',
    title: '18. Foreign Keys',
    description: 'Learn about foreign key relationships, referential integrity, and how databases prevent invalid data.',
    tables: ['customers', 'orders'],
    content: `# Foreign Keys

While Primary Keys identify rows within their own table, **Foreign Keys** connect rows across different tables.

## Foreign Key Relationships

A Foreign Key is a column (or columns) in one table that references the Primary Key of another table. It acts as a bridge.

\`\`\`sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
\`\`\`

In the \`orders\` table, \`customer_id\` is the foreign key. It tells the database: *"Every value in this column must exactly match an existing customer_id in the customers table."*

## Referential Integrity

This constraint is how databases maintain **referential integrity**.

When you define a foreign key, the database actively enforces the relationship:
- **Preventing Invalid Inserts:** If you try to insert an order with a \`customer_id\` that does not exist in the \`customers\` table, the database throws an error.
- **Preventing Invalid Updates:** If you try to change a \`customer_id\` to a non-existent ID, it is blocked.
- **Protecting Parent Data:** If you try to delete a customer who still has orders attached to them, the database prevents the deletion to stop those orders from becoming orphaned!

## Visualizing the Connection

Think of it as a strict parent-child rule. A child (\`Order\`) cannot exist without a parent (\`Customer\`). The Foreign Key is the unbreakable tether linking them together.`,
    defaultQuery: 'SELECT o.order_id, o.amount, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;',
    examples: [
      { title: 'Follow the Foreign Key', description: 'Use JOIN to follow the foreign key to its parent record.', sql: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;' },
      { title: 'Filter by Parent', description: 'Find all children for a specific parent via the foreign key.', sql: 'SELECT * FROM orders WHERE customer_id = 1;' },
      { title: 'Find Unused Parents', description: 'Find parents with no children.', sql: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;' }
    ],
    exercises: [
      { id: 'fk_1', title: 'Follow the Link', description: 'Join orders and customers to see the order_id alongside the parent customer name.', expectedSql: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;', hint: 'Use JOIN on customer_id.', solution: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;' },
      { id: 'fk_2', title: 'Create Table with FK', description: 'Create table "reviews" with review_id INTEGER PRIMARY KEY, product_id INTEGER, and a FOREIGN KEY referencing products(product_id).', expectedSql: 'CREATE TABLE reviews (review_id INTEGER PRIMARY KEY, product_id INTEGER, FOREIGN KEY (product_id) REFERENCES products(product_id));', hint: 'FOREIGN KEY (product_id) REFERENCES products(product_id).', solution: 'CREATE TABLE reviews (review_id INTEGER PRIMARY KEY, product_id INTEGER, FOREIGN KEY (product_id) REFERENCES products(product_id));' },
      { id: 'fk_3', title: 'Count Children', description: 'Count the number of orders associated with customer_id 2.', expectedSql: 'SELECT COUNT(*) FROM orders WHERE customer_id = 2;', hint: 'Filter the orders table using WHERE.', solution: 'SELECT COUNT(*) FROM orders WHERE customer_id = 2;' },
      { id: 'fk_4', title: 'Verify Integrity', description: 'Find any orders where customer_id is NULL.', expectedSql: 'SELECT * FROM orders WHERE customer_id IS NULL;', hint: 'Use WHERE customer_id IS NULL.', solution: 'SELECT * FROM orders WHERE customer_id IS NULL;' },
      { id: 'fk_5', title: 'Find Largest Child', description: 'Find the highest amount associated with customer_id 1.', expectedSql: 'SELECT MAX(amount) FROM orders WHERE customer_id = 1;', hint: 'Use MAX(amount) with WHERE.', solution: 'SELECT MAX(amount) FROM orders WHERE customer_id = 1;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     19 · Referential Actions
     ══════════════════════════════════════════════════════════ */
  {
    id: 'referential-actions',
    title: '19. Referential Actions',
    description: 'Learn how databases react when referenced rows change.',
    tables: ['customers', 'orders'],
    content: `# Referential Actions

We know that a database blocks you from deleting a parent row if child rows still reference it. But what if you *want* to delete the parent and have the database automatically handle the children?

This is where **Referential Actions** come into play. When you define a foreign key, you can specify exactly how the database should react when the parent row is deleted or updated.

## The Four Main Referential Actions

You configure these by adding \`ON DELETE\` or \`ON UPDATE\` to your foreign key definition.

### 1. ON DELETE CASCADE
If the parent is deleted, automatically delete all associated child rows. This is like deleting a folder on your computer; all the files inside are deleted too.

### 2. ON DELETE SET NULL
If the parent is deleted, don't delete the children. Instead, change their foreign key value to NULL. This says "this record used to belong to a parent, but the parent is gone."

### 3. ON DELETE RESTRICT (Default)
This is the default safe behavior. If you try to delete the parent, the database throws an error and completely stops the deletion if child rows exist.

### 4. ON UPDATE CASCADE
If the parent's Primary Key value changes (which shouldn't happen often), automatically update the foreign key in all child rows to match the new value.

## Real World Examples

- **CASCADE:** A blog application. If a \`User\` is deleted, you want to \`CASCADE\` delete all their \`Comments\`.
- **SET NULL:** An HR system. If a \`Department\` is deleted, you don't want to delete the \`Employees\`. Instead, \`SET NULL\` their department ID until they are reassigned.
- **RESTRICT:** E-commerce. You absolutely cannot delete a \`Customer\` if they have financial \`Orders\` associated with them for legal auditing reasons.`,
    defaultQuery: 'SELECT * FROM orders;',
    examples: [
      { title: 'Syntax Example', description: 'Notice the ON DELETE action at the end.', sql: "CREATE TABLE comments (\n  id INTEGER PRIMARY KEY,\n  user_id INTEGER,\n  text TEXT,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);" },
      { title: 'SET NULL Syntax', description: 'Setting to NULL on delete.', sql: "CREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  dept_id INTEGER,\n  FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL\n);" },
      { title: 'RESTRICT Syntax', description: 'Explicitly defining the default behavior.', sql: "CREATE TABLE invoices (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER,\n  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT\n);" }
    ],
    exercises: [
      { id: 'ra_1', title: 'Create Cascade FK', description: 'Create a table "log_entries" (id INTEGER PRIMARY KEY, server_id INTEGER). Add a foreign key referencing servers(server_id) with ON DELETE CASCADE.', expectedSql: 'CREATE TABLE log_entries (id INTEGER PRIMARY KEY, server_id INTEGER, FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE);', hint: 'Add ON DELETE CASCADE at the end of the foreign key constraint.', solution: 'CREATE TABLE log_entries (id INTEGER PRIMARY KEY, server_id INTEGER, FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE);' },
      { id: 'ra_2', title: 'Create Set NULL FK', description: 'Create table "tasks" (id INTEGER PRIMARY KEY, worker_id INTEGER). Add an FK referencing workers(worker_id) with ON DELETE SET NULL.', expectedSql: 'CREATE TABLE tasks (id INTEGER PRIMARY KEY, worker_id INTEGER, FOREIGN KEY (worker_id) REFERENCES workers(worker_id) ON DELETE SET NULL);', hint: 'Add ON DELETE SET NULL.', solution: 'CREATE TABLE tasks (id INTEGER PRIMARY KEY, worker_id INTEGER, FOREIGN KEY (worker_id) REFERENCES workers(worker_id) ON DELETE SET NULL);' },
      { id: 'ra_3', title: 'Create Restrict FK', description: 'Create table "payments" (id INTEGER PRIMARY KEY, client_id INTEGER). Add an FK referencing clients(client_id) with ON DELETE RESTRICT.', expectedSql: 'CREATE TABLE payments (id INTEGER PRIMARY KEY, client_id INTEGER, FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT);', hint: 'Add ON DELETE RESTRICT.', solution: 'CREATE TABLE payments (id INTEGER PRIMARY KEY, client_id INTEGER, FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT);' },
      { id: 'ra_4', title: 'Update Cascade FK', description: 'Create table "settings" (id INTEGER PRIMARY KEY, user_id INTEGER). Add an FK referencing users(user_id) with ON UPDATE CASCADE.', expectedSql: 'CREATE TABLE settings (id INTEGER PRIMARY KEY, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE);', hint: 'Use ON UPDATE CASCADE.', solution: 'CREATE TABLE settings (id INTEGER PRIMARY KEY, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE);' },
      { id: 'ra_5', title: 'Multiple Actions', description: 'Create table "docs" (id INTEGER, user_id INTEGER). Add an FK to users(user_id) with ON DELETE CASCADE and ON UPDATE CASCADE.', expectedSql: 'CREATE TABLE docs (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE);', hint: 'Chain them: ON DELETE CASCADE ON UPDATE CASCADE.', solution: 'CREATE TABLE docs (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE);' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     20 · ON DELETE CASCADE
     ══════════════════════════════════════════════════════════ */
  {
    id: 'on-delete-cascade',
    title: '20. ON DELETE CASCADE',
    description: 'Learn how deleting a parent row can automatically remove all dependent rows.',
    tables: ['customers', 'orders'],
    content: `# ON DELETE CASCADE in Practice

Let's look closely at how **ON DELETE CASCADE** works in action.

\`\`\`sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER,
  FOREIGN KEY (customer_id) 
    REFERENCES customers(customer_id) 
    ON DELETE CASCADE
);
\`\`\`

When this constraint is in place, the database engine actively listens for \`DELETE\` statements on the parent \`customers\` table.

## The Chain Reaction

If a user executes:

\`\`\`sql
DELETE FROM customers WHERE customer_id = 1;
\`\`\`

The database steps in and does the following:
1. It looks at the \`orders\` table and finds every row where \`customer_id = 1\`.
2. It quietly and automatically deletes all of those orders.
3. Finally, it deletes the customer record itself.

All of this happens as a single atomic transaction. You don't have to write multiple delete queries in your application code; the database maintains the cleanup for you.

## Proceed with Caution!

While powerful, \`CASCADE\` is dangerous. Accidentally deleting a single parent record can wipe out thousands of dependent child, grandchild, and great-grandchild records instantly without any warnings! Always be completely sure before deleting from a table that has cascading relationships.`,
    defaultQuery: '-- This is how you would delete a customer.\n-- DELETE FROM customers WHERE customer_id = 1;\nSELECT * FROM customers;',
    examples: [
      { title: 'The Parent Delete', description: 'Deleting the parent triggers the cascade.', sql: 'DELETE FROM customers WHERE customer_id = 1;' },
      { title: 'Verify Deletion', description: 'Check if the parent is gone.', sql: 'SELECT * FROM customers;' },
      { title: 'Verify Cascaded Child Deletion', description: 'Check if the orphaned children were automatically scrubbed.', sql: 'SELECT * FROM orders WHERE customer_id = 1;' }
    ],
    exercises: [
      { id: 'odc_1', title: 'Examine CASCADE Syntax', description: 'Write a valid CREATE TABLE query for "posts" with post_id, author_id, and an ON DELETE CASCADE foreign key to authors(author_id).', expectedSql: 'CREATE TABLE posts (post_id INTEGER PRIMARY KEY, author_id INTEGER, FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE);', hint: 'CREATE TABLE posts ... FOREIGN KEY ... ON DELETE CASCADE', solution: 'CREATE TABLE posts (post_id INTEGER PRIMARY KEY, author_id INTEGER, FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE);' },
      { id: 'odc_2', title: 'Write Delete Statement', description: 'Write the query that would delete customer_id 5 from the customers table.', expectedSql: 'DELETE FROM customers WHERE customer_id = 5;', hint: 'DELETE FROM __ WHERE __.', solution: 'DELETE FROM customers WHERE customer_id = 5;' },
      { id: 'odc_3', title: 'Check Orphans Post-Cascade', description: 'Write a query to prove there are no orders belonging to customer_id 5.', expectedSql: 'SELECT * FROM orders WHERE customer_id = 5;', hint: 'SELECT * from orders filtered by customer_id 5', solution: 'SELECT * FROM orders WHERE customer_id = 5;' },
      { id: 'odc_4', title: 'Delete Multiple Parents', description: 'Write a query to delete all customers in the "USA". Assuming cascade is on, this wipes their orders too.', expectedSql: "DELETE FROM customers WHERE country = 'USA';", hint: 'DELETE FROM customers WHERE country = "USA".', solution: "DELETE FROM customers WHERE country = 'USA';" },
      { id: 'odc_5', title: 'Count Remaining Orders', description: 'Count the total number of orders left in the database.', expectedSql: 'SELECT COUNT(*) FROM orders;', hint: 'Use COUNT(*).', solution: 'SELECT COUNT(*) FROM orders;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     21 · ON DELETE SET NULL
     ══════════════════════════════════════════════════════════ */
  {
    id: 'on-delete-set-null',
    title: '21. ON DELETE SET NULL',
    description: 'Learn how to orphan records safely by nullifying their foreign keys when the parent departs.',
    tables: ['employees'],
    content: `# ON DELETE SET NULL

Sometimes, you want to keep the child records even when the parent is deleted. Instead of destroying the data or throwing an error, the database can sever the link gracefully.

## How It Works

\`\`\`sql
CREATE TABLE tasks (
  task_id INTEGER PRIMARY KEY,
  employee_id INTEGER,
  description TEXT,
  FOREIGN KEY (employee_id) 
    REFERENCES employees(id) 
    ON DELETE SET NULL
);
\`\`\`

When this constraint is used, executing \`DELETE FROM employees WHERE id = 10\` causes the following:
1. The engine finds all tasks assigned to Employee 10.
2. It changes the \`employee_id\` on those tasks to \`NULL\`.
3. It deletes Employee 10.

## When to use SET NULL

This is the perfect approach for **optional relationships**. 

For example: An employee is assigned to a computer workstation. If the employee resigns and is deleted from the database, you don't throw the physical computer in the trash (\`CASCADE\`). You simply remove the employee's name from the computer's record by setting it to \`NULL\`. The computer still exists and is now unassigned, waiting for a new employee.

*Note: You can only use SET NULL if the foreign key column allows NULL values. If you defined \`employee_id INTEGER NOT NULL\`, the database will throw an error instead!*`,
    defaultQuery: '-- Example: Nullifying relationships\nSELECT * FROM employees WHERE manager_id IS NULL;',
    examples: [
      { title: 'Self-Referencing SET NULL', description: 'If a manager is fired, their direct reports get manager_id = NULL.', sql: 'SELECT name, manager_id FROM employees;' },
      { title: 'Find Unassigned Tasks', description: 'Finding the children who were orphaned by SET NULL.', sql: 'SELECT * FROM employees WHERE manager_id IS NULL;' },
      { title: 'Assigning to new Parent', description: 'Reassigning the orphans.', sql: 'UPDATE employees SET manager_id = 1 WHERE manager_id IS NULL;' }
    ],
    exercises: [
      { id: 'odsn_1', title: 'Create SET NULL FK', description: 'Create table "assets" (id INTEGER, user_id INTEGER). Add a foreign key to users(id) with ON DELETE SET NULL.', expectedSql: 'CREATE TABLE assets (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);', hint: 'Add ON DELETE SET NULL constraint.', solution: 'CREATE TABLE assets (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);' },
      { id: 'odsn_2', title: 'Delete the Parent', description: 'Write a query to delete the employee with id 3.', expectedSql: 'DELETE FROM employees WHERE id = 3;', hint: 'DELETE FROM employees WHERE id is 3.', solution: 'DELETE FROM employees WHERE id = 3;' },
      { id: 'odsn_3', title: 'Find the Orphans', description: 'Select all employees who currently have no manager (manager_id IS NULL).', expectedSql: 'SELECT * FROM employees WHERE manager_id IS NULL;', hint: 'Use WHERE manager_id IS NULL.', solution: 'SELECT * FROM employees WHERE manager_id IS NULL;' },
      { id: 'odsn_4', title: 'Count the Orphans', description: 'Count how many employees have no manager.', expectedSql: 'SELECT COUNT(*) FROM employees WHERE manager_id IS NULL;', hint: 'Combine COUNT(*) and IS NULL.', solution: 'SELECT COUNT(*) FROM employees WHERE manager_id IS NULL;' },
      { id: 'odsn_5', title: 'Reassign Orphans', description: 'Write an UPDATE query to set manager_id to 1 for all employees where manager_id IS NULL.', expectedSql: 'UPDATE employees SET manager_id = 1 WHERE manager_id IS NULL;', hint: 'UPDATE employees SET ... WHERE ...', solution: 'UPDATE employees SET manager_id = 1 WHERE manager_id IS NULL;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     22 · ON DELETE RESTRICT
     ══════════════════════════════════════════════════════════ */
  {
    id: 'on-delete-restrict',
    title: '22. ON DELETE RESTRICT',
    description: 'Learn how the database protects against accidental deletions with ON DELETE RESTRICT.',
    tables: ['customers', 'orders'],
    content: `# ON DELETE RESTRICT

In many cases, deleting a parent row when child rows exist is highly destructive and should be explicitly prevented. This is where **ON DELETE RESTRICT** comes in.

## How RESTRICT Works

If a foreign key is defined with \`ON DELETE RESTRICT\` (which is often the default behavior if you don't specify anything), the database acts as a strict safeguard.

\`\`\`sql
CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) 
    REFERENCES customers(id) 
    ON DELETE RESTRICT
);
\`\`\`

If you attempt:
\`\`\`sql
DELETE FROM customers WHERE id = 1;
\`\`\`

And Customer 1 has invoices, the database will instantly **abort the transaction and throw an error**:
*ERROR: Cannot delete or update a parent row: a foreign key constraint fails.*

## The Correct Deletion Order

To delete a parent row protected by \`RESTRICT\`, you must manually resolve the dependencies first.

1. **Delete the children first:** \`DELETE FROM invoices WHERE customer_id = 1;\`
2. **Delete the parent second:** \`DELETE FROM customers WHERE id = 1;\`

This forces you (and your application) to be extremely intentional about deleting data, making it ideal for critical financial or medical records.`,
    defaultQuery: '-- This query will fail if the customer has orders!\n-- DELETE FROM customers WHERE customer_id = 1;\nSELECT * FROM customers;',
    examples: [
      { title: 'The Blocked Delete', description: 'Attempting to delete a parent with children fails.', sql: 'DELETE FROM customers WHERE customer_id = 1;' },
      { title: 'Delete Children First', description: 'Step 1: Clean up the dependent rows.', sql: 'DELETE FROM orders WHERE customer_id = 1;' },
      { title: 'Delete Parent Second', description: 'Step 2: Now the parent can be safely removed.', sql: 'DELETE FROM customers WHERE customer_id = 1;' }
    ],
    exercises: [
      { id: 'odr_1', title: 'Write RESTRICT Syntax', description: 'Create a table "loans" (id INTEGER, user_id INTEGER) with an FK to users(id) ON DELETE RESTRICT.', expectedSql: 'CREATE TABLE loans (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT);', hint: 'Add ON DELETE RESTRICT.', solution: 'CREATE TABLE loans (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT);' },
      { id: 'odr_2', title: 'Find Blocking Children', description: 'Write a query to find all orders belonging to customer_id 2 that are preventing customer_id 2 from being deleted.', expectedSql: 'SELECT * FROM orders WHERE customer_id = 2;', hint: 'Select orders where customer_id = 2.', solution: 'SELECT * FROM orders WHERE customer_id = 2;' },
      { id: 'odr_3', title: 'Step 1: Cleanup', description: 'Write the DELETE query to remove all orders for customer_id 2.', expectedSql: 'DELETE FROM orders WHERE customer_id = 2;', hint: 'DELETE FROM orders WHERE customer_id = 2.', solution: 'DELETE FROM orders WHERE customer_id = 2;' },
      { id: 'odr_4', title: 'Step 2: Delete Parent', description: 'Now write the DELETE query to remove customer_id 2.', expectedSql: 'DELETE FROM customers WHERE customer_id = 2;', hint: 'DELETE FROM customers WHERE customer_id = 2.', solution: 'DELETE FROM customers WHERE customer_id = 2;' },
      { id: 'odr_5', title: 'Verify Deletion', description: 'Check that customer_id 2 is completely gone by attempting to select them.', expectedSql: 'SELECT * FROM customers WHERE customer_id = 2;', hint: 'SELECT * FROM customers ...', solution: 'SELECT * FROM customers WHERE customer_id = 2;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     23 · ON UPDATE CASCADE
     ══════════════════════════════════════════════════════════ */
  {
    id: 'on-update-cascade',
    title: '23. ON UPDATE CASCADE',
    description: 'Learn how to automatically keep child tables in sync when a parent Primary Key moves.',
    tables: ['customers', 'orders'],
    content: `# ON UPDATE CASCADE

So far, we've focused on what happens when a parent is deleted. But what happens if a parent's **Primary Key** changes?

While changing a Primary Key is generally discouraged (keys should ideally be immutable integers like IDs), it does happen — especially if the key is a string like a username or a department code.

## The Problem

If you have a \`departments\` table with Primary Key \`'HR'\`, and an \`employees\` table where \`dept_code = 'HR'\`.
If you update the department code to \`'Human_Resources'\`, standard databases will block the update because it would leave the employees orphaned pointing to \`'HR'\`.

## The Solution

\`\`\`sql
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  dept_code TEXT,
  FOREIGN KEY (dept_code) 
    REFERENCES departments(code) 
    ON UPDATE CASCADE
);
\`\`\`

With \`ON UPDATE CASCADE\`, changing the parent flows through to the children automatically:

\`\`\`sql
UPDATE departments SET code = 'Human_Resources' WHERE code = 'HR';
\`\`\`

The database steps in:
1. It updates the \`departments\` table to \`'Human_Resources'\`.
2. It automatically updates every \`dept_code\` in the \`employees\` table from \`'HR'\` to \`'Human_Resources'\`.

Everything remains perfectly synchronized without any orphaned records.`,
    defaultQuery: '-- A primary key update flows down to children.\nUPDATE customers SET customer_id = 999 WHERE customer_id = 3;\nSELECT * FROM orders;',
    examples: [
      { title: 'View Initial State', description: 'See orders for customer 3.', sql: 'SELECT * FROM orders WHERE customer_id = 3;' },
      { title: 'Update the Parent', description: 'Change customer 3 to 999.', sql: 'UPDATE customers SET customer_id = 999 WHERE customer_id = 3;' },
      { title: 'Observe the Cascade', description: 'The orders automatically shifted to customer 999!', sql: 'SELECT * FROM orders WHERE customer_id = 999;' }
    ],
    exercises: [
      { id: 'ouc_1', title: 'Write UPDATE CASCADE', description: 'Create a table "tickets" (id INTEGER, project_code TEXT) with an FK to projects(code) ON UPDATE CASCADE.', expectedSql: 'CREATE TABLE tickets (id INTEGER, project_code TEXT, FOREIGN KEY (project_code) REFERENCES projects(code) ON UPDATE CASCADE);', hint: 'Add ON UPDATE CASCADE.', solution: 'CREATE TABLE tickets (id INTEGER, project_code TEXT, FOREIGN KEY (project_code) REFERENCES projects(code) ON UPDATE CASCADE);' },
      { id: 'ouc_2', title: 'Update Parent Row', description: 'Write an UPDATE query to change customer_id 4 to customer_id 800 in the customers table.', expectedSql: 'UPDATE customers SET customer_id = 800 WHERE customer_id = 4;', hint: 'UPDATE customers SET customer_id = 800 WHERE customer_id = 4;', solution: 'UPDATE customers SET customer_id = 800 WHERE customer_id = 4;' },
      { id: 'ouc_3', title: 'Verify Child Cascade', description: 'Write a select query to see if any orders successfully cascaded to customer_id 800.', expectedSql: 'SELECT * FROM orders WHERE customer_id = 800;', hint: 'SELECT * from orders where customer_id is 800.', solution: 'SELECT * FROM orders WHERE customer_id = 800;' },
      { id: 'ouc_4', title: 'Check Old ID', description: 'Write a select query to verify that no orders remain attached to customer_id 4.', expectedSql: 'SELECT * FROM orders WHERE customer_id = 4;', hint: 'This should return empty.', solution: 'SELECT * FROM orders WHERE customer_id = 4;' },
      { id: 'ouc_5', title: 'Combined Constraints', description: 'Create "profiles" (id INTEGER, user_id INTEGER) linking to users(id) with BOTH ON DELETE SET NULL and ON UPDATE CASCADE.', expectedSql: 'CREATE TABLE profiles (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE);', hint: 'Add ON DELETE SET NULL ON UPDATE CASCADE to the end of the foreign key definition.', solution: 'CREATE TABLE profiles (id INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE);' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     24 · Database Normalization
     ══════════════════════════════════════════════════════════ */
  {
    id: 'normalization',
    title: '24. Database Normalization',
    description: 'Understand the problems of messy data arrays and why normalization exists.',
    tables: ['messy_orders'],
    content: `# Database Normalization

**Database Normalization** is a systematic process of organizing data to minimize redundancy and eliminate data anomalies.

## Unnormalized Data (A Messy Table)

Imagine a small business tracking orders in a spreadsheet. It might look like this:

| order_id | customer_name | customer_address | items_list | total_price |
|---|---|---|---|---|
| 1 | Alice | 123 Apple St | 2x Mouse, 1x Keyboard | 130 |
| 2 | Alice | 123 Apple St | 1x Laptop | 1200 |
| 3 | Bob | 456 Banana Rd | 1x Monitor | 350 |

This is called an **Unnormalized Form (UNF)**. It suffers from severe flaws known as **anomalies**.

## Why Normalization Exists

Storing data this way causes three massive problems:

### 1. Update Anomalies
Alice's address is stored twice (once for each order). If Alice moves to "789 Cherry Ln", you must find and update *every single row* she has ever ordered on. If you miss one, the database becomes inconsistent (where does Alice actually live?).

### 2. Insert Anomalies
How do you add a new customer (Charlie) into this table *before* he has placed an order? You can't. The table is structured around orders, so customer data is hopelessly tangled with order data.

### 3. Delete Anomalies
If Bob cancels Order 3 and you delete his row, you just deleted all records of Bob's existence along with his address!

## The Solution

Normalization solves these problems by aggressively splitting "things" into their own separate tables and linking them with Foreign Keys. We take the table above and split it into \`customers\`, \`orders\`, \`products\`, and \`order_items\`.`,
    defaultQuery: 'SELECT * FROM messy_orders;',
    examples: [
      { title: 'The Messy Table', description: 'Look at how data is duplicated and grouped.', sql: 'SELECT * FROM messy_orders;' },
      { title: 'The Update Anomaly', description: 'Updating Alice requires updating multiple rows!', sql: "UPDATE messy_orders SET customer_address = '789 Cherry Ln' WHERE customer_name = 'Alice';" }
    ],
    exercises: [
      { id: 'norm_1', title: 'Explore the Mess', description: 'Select all columns from the messy_orders table.', expectedSql: 'SELECT * FROM messy_orders;', hint: 'SELECT * FROM messy_orders;', solution: 'SELECT * FROM messy_orders;' },
      { id: 'norm_2', title: 'Identify Duplicates', description: 'Select distinct customer_name and customer_address from messy_orders to see the unique customers trapped inside.', expectedSql: 'SELECT DISTINCT customer_name, customer_address FROM messy_orders;', hint: 'Use SELECT DISTINCT on the two customer columns.', solution: 'SELECT DISTINCT customer_name, customer_address FROM messy_orders;' },
      { id: 'norm_3', title: 'The Update Problem', description: 'Write an UPDATE to change Bob address to "888 New St" in messy_orders.', expectedSql: "UPDATE messy_orders SET customer_address = '888 New St' WHERE customer_name = 'Bob';", hint: 'UPDATE messy_orders SET ... WHERE ...', solution: "UPDATE messy_orders SET customer_address = '888 New St' WHERE customer_name = 'Bob';" },
      { id: 'norm_4', title: 'The Delete Problem', description: 'Write a DELETE to remove order_id 2. Notice how it deletes Alice order history.', expectedSql: 'DELETE FROM messy_orders WHERE order_id = 2;', hint: 'DELETE FROM messy_orders WHERE order_id = 2;', solution: 'DELETE FROM messy_orders WHERE order_id = 2;' },
      { id: 'norm_5', title: 'Item List Problem', description: 'Select just the items_list column. It is a comma-separated string, which makes SQL COUNT() impossible on individual items!', expectedSql: 'SELECT items_list FROM messy_orders;', hint: 'SELECT items_list', solution: 'SELECT items_list FROM messy_orders;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     25 · First Normal Form (1NF)
     ══════════════════════════════════════════════════════════ */
  {
    id: '1nf',
    title: '25. First Normal Form (1NF)',
    description: 'Learn how to achieve First Normal Form by making values atomic.',
    tables: ['messy_orders'],
    content: `# First Normal Form (1NF)

The journey to a clean database happens in stages called **Normal Forms**. The very first rule you must follow is **First Normal Form (1NF)**.

## The Rule of 1NF
**Every column must contain atomic (indivisible) values, and there must be no repeating groups.**

## Fixing Atomicity

Look back at our messy \`items_list\`: \`"2x Mouse, 1x Keyboard"\`

This violates 1NF. It contains multiple pieces of information crammed into a single text string. 
- You cannot easily query "How many mice have we sold?"
- You cannot join it to a \`Products\` table to get prices.

To achieve 1NF, we must eliminate the comma-separated list. Each item ordered must get its own row.

**Before (Unnormalized):**
| order_id | customer | items_list |
|---|---|---|
| 1 | Alice | 2x Mouse, 1x Keyboard |

**After (1NF Achieved):**
| order_id | customer | item | quantity |
|---|---|---|---|
| 1 | Alice | Mouse | 2 |
| 1 | Alice | Keyboard | 1 |

Notice how \`order_id\` 1 now spans multiple rows. The data is now "flat" and atomic. SQL can finally aggregate \`quantity\` and group by \`item\`!`,
    defaultQuery: 'SELECT * FROM messy_orders;',
    examples: [
      { title: 'The Unnormalized Array', description: 'See the items_list string.', sql: 'SELECT items_list FROM messy_orders;' }
    ],
    exercises: [
      { id: '1nf_1', title: 'Create Flat Table', description: 'Create a new table "flat_orders" (order_id INTEGER, customer TEXT, item TEXT, quantity INTEGER).', expectedSql: 'CREATE TABLE flat_orders (order_id INTEGER, customer TEXT, item TEXT, quantity INTEGER);', hint: 'CREATE TABLE flat_orders (...)', solution: 'CREATE TABLE flat_orders (order_id INTEGER, customer TEXT, item TEXT, quantity INTEGER);' },
      { id: '1nf_2', title: 'Insert Atomic Rows', description: 'Insert a row into flat_orders for Order 1: customer "Alice", item "Mouse", quantity 2.', expectedSql: "INSERT INTO flat_orders VALUES (1, 'Alice', 'Mouse', 2);", hint: "INSERT INTO flat_orders VALUES (...);", solution: "INSERT INTO flat_orders VALUES (1, 'Alice', 'Mouse', 2);" },
      { id: '1nf_3', title: 'Insert Second Row', description: 'Insert the second part of Order 1: customer "Alice", item "Keyboard", quantity 1.', expectedSql: "INSERT INTO flat_orders VALUES (1, 'Alice', 'Keyboard', 1);", hint: 'Same as previous, just change the values.', solution: "INSERT INTO flat_orders VALUES (1, 'Alice', 'Keyboard', 1);" },
      { id: '1nf_4', title: 'Check 1NF Status', description: 'Select everything from flat_orders to see the atomic data.', expectedSql: 'SELECT * FROM flat_orders;', hint: 'SELECT * FROM flat_orders;', solution: 'SELECT * FROM flat_orders;' },
      { id: '1nf_5', title: 'Power of 1NF', description: 'Now calculate the total quantity ordered of "Mouse" using SUM(quantity) from flat_orders.', expectedSql: "SELECT SUM(quantity) FROM flat_orders WHERE item = 'Mouse';", hint: "Use SUM(quantity) WHERE item = 'Mouse'", solution: "SELECT SUM(quantity) FROM flat_orders WHERE item = 'Mouse';" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     26 · Second Normal Form (2NF)
     ══════════════════════════════════════════════════════════ */
  {
    id: '2nf',
    title: '26. Second Normal Form (2NF)',
    description: 'Learn how to remove partial dependencies to achieve Second Normal Form.',
    tables: ['messy_orders'],
    content: `# Second Normal Form (2NF)

Once a table is in 1NF, the next step is **Second Normal Form (2NF)**.

## The Rule of 2NF
**The table must be in 1NF, AND it must have no "partial dependencies".**

## What is a Partial Dependency?

This only occurs when a table has a **Composite Primary Key** (a PK made of two or more columns).

Let's look at our 1NF \`flat_orders\` table. The primary key must be \`(\`order_id\`, \`item\`)\` because \`order_id\` alone isn't unique anymore!

| order_id | item | quantity | customer_name |
|---|---|---|---|
| 1 | Mouse | 2 | Alice |
| 1 | Keyboard | 1 | Alice |

- Does \`quantity\` depend on the entire key \`(\`order_id\`, \`item\`)\`? **Yes**. The quantity 2 is specifically for the Mouse in Order 1.
- Does \`customer_name\` depend on the entire key? **No**. The customer "Alice" only depends on \`order_id 1\`. It has nothing to do with the specific item.

Because \`customer_name\` only depends on a *part* of the primary key (\`order_id\`), we have a **partial dependency**. This causes the customer name to be duplicated across every item in the order!

## Fixing 2NF

To achieve 2NF, we break the table into two separate tables: 
1. An \`Orders\` table linking \`order_id\` to the \`customer_name\`.
2. An \`Order_Items\` table linking \`order_id\` to the \`item\` and \`quantity\`.`,
    defaultQuery: '-- Visualizing the 2NF split conceptually',
    examples: [
      { title: 'The Orders Table Split', description: 'Extracting the order-level data.', sql: 'SELECT order_id, customer_name FROM messy_orders;' }
    ],
    exercises: [
      { id: '2nf_1', title: 'Create Orders Table', description: 'Create "orders_2nf" (order_id INTEGER PRIMARY KEY, customer_name TEXT).', expectedSql: 'CREATE TABLE orders_2nf (order_id INTEGER PRIMARY KEY, customer_name TEXT);', hint: 'CREATE TABLE orders_2nf (...)', solution: 'CREATE TABLE orders_2nf (order_id INTEGER PRIMARY KEY, customer_name TEXT);' },
      { id: '2nf_2', title: 'Create Order Items Table', description: 'Create "order_items_2nf" (order_id INTEGER, item TEXT, quantity INTEGER, PRIMARY KEY (order_id, item)).', expectedSql: 'CREATE TABLE order_items_2nf (order_id INTEGER, item TEXT, quantity INTEGER, PRIMARY KEY (order_id, item));', hint: 'Add PRIMARY KEY (order_id, item) constraint.', solution: 'CREATE TABLE order_items_2nf (order_id INTEGER, item TEXT, quantity INTEGER, PRIMARY KEY (order_id, item));' },
      { id: '2nf_3', title: 'Add Foreign Key', description: 'Alter order_items_2nf to add a foreign key to orders_2nf... wait, SQLite doesn\'t support ADD FOREIGN KEY easily. Just write a SELECT 1 query to skip this.', expectedSql: 'SELECT 1;', hint: 'Just type SELECT 1;', solution: 'SELECT 1;' },
      { id: '2nf_4', title: 'Insert Order Data', description: 'Insert into orders_2nf: (1, "Alice").', expectedSql: "INSERT INTO orders_2nf VALUES (1, 'Alice');", hint: "INSERT INTO orders_2nf VALUES (1, 'Alice');", solution: "INSERT INTO orders_2nf VALUES (1, 'Alice');" },
      { id: '2nf_5', title: 'Insert Items Data', description: 'Insert into order_items_2nf: (1, "Mouse", 2). Notice how customer_name isn\'t duplicated here!', expectedSql: "INSERT INTO order_items_2nf VALUES (1, 'Mouse', 2);", hint: "INSERT INTO order_items_2nf VALUES (...)", solution: "INSERT INTO order_items_2nf VALUES (1, 'Mouse', 2);" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     27 · Third Normal Form (3NF)
     ══════════════════════════════════════════════════════════ */
  {
    id: '3nf',
    title: '27. Third Normal Form (3NF)',
    description: 'Eliminate transitive dependencies to achieve Third Normal Form.',
    tables: ['messy_orders'],
    content: `# Third Normal Form (3NF)

The gold standard for everyday database design is **Third Normal Form (3NF)**.

## The Rule of 3NF
**The table must be in 2NF, AND it must have no "transitive dependencies".**

(The common mnemonic is: *"Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd."*)

## What is a Transitive Dependency?

A transitive dependency means column A depends on column B, which depends on the Primary Key.

Look at our \`orders_2nf\` table from the previous lesson, if we had included the address:
| order_id (PK) | customer_id | customer_name | customer_address |
|---|---|---|---|
| 1 | 99 | Alice | 123 Apple St |
| 2 | 99 | Alice | 123 Apple St |

- \`customer_name\` and \`customer_address\` describe the Customer (\`customer_id\`).
- \`customer_id\` describes the Order (\`order_id\`).

Because the address and name depend on the \`customer_id\`, NOT the \`order_id\`, we have a transitive dependency. If Alice updates her address, we still have to update multiple orders!

## Fixing 3NF

We extract the Customer data into its own dedicated \`customers\` table.

1. **customers:** \`customer_id\` (PK), \`customer_name\`, \`customer_address\`
2. **orders:** \`order_id\` (PK), \`customer_id\` (FK)

Now, if Alice moves, we update exactly ONE row in the \`customers\` table. The \`orders\` table simply points to \`customer_id = 99\`, so the relationship remains perfectly intact with 100% data consistency. This is the power of a fully normalized relational database!`,
    defaultQuery: 'SELECT c.name, c.country FROM customers c;',
    examples: [
      { title: 'The End Result', description: 'Our default customers table is already in 3NF!', sql: 'SELECT * FROM customers;' },
      { title: 'The 3NF Join', description: 'Combining perfectly normalized tables.', sql: 'SELECT o.order_id, c.name, c.country FROM orders o JOIN customers c ON o.customer_id = c.customer_id;' }
    ],
    exercises: [
      { id: '3nf_1', title: 'Create Customers 3NF', description: 'Create table "customers_3nf" (customer_id INTEGER PRIMARY KEY, name TEXT, address TEXT).', expectedSql: 'CREATE TABLE customers_3nf (customer_id INTEGER PRIMARY KEY, name TEXT, address TEXT);', hint: 'CREATE TABLE customers_3nf (...)', solution: 'CREATE TABLE customers_3nf (customer_id INTEGER PRIMARY KEY, name TEXT, address TEXT);' },
      { id: '3nf_2', title: 'Create Orders 3NF', description: 'Create "orders_3nf" (order_id INTEGER PRIMARY KEY, customer_id INTEGER).', expectedSql: 'CREATE TABLE orders_3nf (order_id INTEGER PRIMARY KEY, customer_id INTEGER);', hint: 'CREATE TABLE orders_3nf (...)', solution: 'CREATE TABLE orders_3nf (order_id INTEGER PRIMARY KEY, customer_id INTEGER);' },
      { id: '3nf_3', title: 'Insert Customer', description: 'Insert into customers_3nf: (99, "Alice", "123 Apple St").', expectedSql: "INSERT INTO customers_3nf VALUES (99, 'Alice', '123 Apple St');", hint: "INSERT INTO customers_3nf VALUES ...", solution: "INSERT INTO customers_3nf VALUES (99, 'Alice', '123 Apple St');" },
      { id: '3nf_4', title: 'Insert Order', description: 'Insert an order for Alice into orders_3nf: (1, 99).', expectedSql: "INSERT INTO orders_3nf VALUES (1, 99);", hint: "INSERT INTO orders_3nf VALUES (1, 99);", solution: "INSERT INTO orders_3nf VALUES (1, 99);" },
      { id: '3nf_5', title: 'Update the Address Safely', description: 'Write an UPDATE query to change Alice address to "888 New St" in customers_3nf. Notice how this requires exactly ONE row update!', expectedSql: "UPDATE customers_3nf SET address = '888 New St' WHERE customer_id = 99;", hint: "UPDATE customers_3nf SET address = ... WHERE customer_id = 99;", solution: "UPDATE customers_3nf SET address = '888 New St' WHERE customer_id = 99;" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     28 · Boyce-Codd Normal Form (BCNF)
     ══════════════════════════════════════════════════════════ */
  {
    id: 'bcnf',
    title: '28. Boyce-Codd Normal Form (BCNF)',
    description: 'A stricter version of 3NF that handles complex overlapping keys.',
    tables: ['courses'],
    content: `# Boyce-Codd Normal Form (BCNF)

While 3NF is usually enough, there is a slightly stricter version called **Boyce-Codd Normal Form (BCNF)**. Sometimes called "3.5NF", it deals with edge cases containing overlapping composite candidate keys.

## The Rule of BCNF
**For every non-trivial functional dependency X → Y, X must be a superkey.**

In simpler terms: *If column X determines column Y, then X must be a primary key (or unique key).*

## The BCNF Anomaly

Imagine a \`classes\` table where a Student can take multiple Subjects, but each Subject they take is taught by exactly ONE Teacher. However, a Teacher only teaches ONE Subject.

| student_name | subject | teacher |
|---|---|---|
| Alice | Math | Mr. Smith |
| Bob | Math | Mr. Smith |
| Alice | Science | Ms. Jones |

The Primary Key must be \`(\`student_name\`, \`subject\`)\` because Alice takes multiple subjects.

- Is it in 1NF? Yes (atomic).
- Is it in 2NF? Yes (no partial dependencies on the key).
- Is it in 3NF? Yes (no transitive dependencies on non-key columns).

But wait! Because "Mr. Smith only teaches Math", knowing the \`teacher\` means we know the \`subject\`. 
This is a dependency: **teacher → subject**.
But \`teacher\` is NOT a primary key! It violates BCNF.

If we delete Alice and Bob, we lose the fact that Mr. Smith teaches Math.

## Fixing BCNF

We split the table into two to make the determinant a key:
1. **teachers:** \`teacher\` (PK), \`subject\`
2. **enrollments:** \`student_name\` (PK), \`teacher\` (PK)

Now every determinant is a Primary Key!`,
    defaultQuery: '-- This table violates BCNF\nSELECT * FROM courses;',
    examples: [
      { title: 'The Problem Table', description: 'Student + Subject is the key, but Teacher determines Subject.', sql: 'SELECT * FROM courses;' }
    ],
    exercises: [
      { id: 'bcnf_1', title: 'Identify Determinants', description: 'A table "appointments" has (client, doctor, clinic). A doctor only works at one clinic. What determines clinic?', expectedSql: 'SELECT 1;', hint: 'The answer is doctor. Write SELECT 1;', solution: 'SELECT 1;' },
      { id: 'bcnf_2', title: 'Create Determinant Table', description: 'Create table "teachers" (teacher TEXT PRIMARY KEY, subject TEXT).', expectedSql: 'CREATE TABLE teachers (teacher TEXT PRIMARY KEY, subject TEXT);', hint: 'CREATE TABLE teachers ...', solution: 'CREATE TABLE teachers (teacher TEXT PRIMARY KEY, subject TEXT);' },
      { id: 'bcnf_3', title: 'Create Linking Table', description: 'Create "enrollments" (student TEXT, teacher TEXT, PRIMARY KEY(student, teacher)).', expectedSql: 'CREATE TABLE enrollments (student TEXT, teacher TEXT, PRIMARY KEY (student, teacher));', hint: 'Add PRIMARY KEY (student, teacher).', solution: 'CREATE TABLE enrollments (student TEXT, teacher TEXT, PRIMARY KEY (student, teacher));' },
      { id: 'bcnf_4', title: 'Insert Teacher', description: 'Insert Mr. Smith teaching Math into teachers.', expectedSql: "INSERT INTO teachers VALUES ('Mr. Smith', 'Math');", hint: "INSERT INTO teachers VALUES ...", solution: "INSERT INTO teachers VALUES ('Mr. Smith', 'Math');" },
      { id: 'bcnf_5', title: 'Insert Enrollment', description: 'Insert Alice taking a class from Mr. Smith into enrollments.', expectedSql: "INSERT INTO enrollments VALUES ('Alice', 'Mr. Smith');", hint: "INSERT INTO enrollments VALUES ...", solution: "INSERT INTO enrollments VALUES ('Alice', 'Mr. Smith');" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     29 · Indexing Fundamentals
     ══════════════════════════════════════════════════════════ */
  {
    id: 'indexing-fundamentals',
    title: '29. Indexing Fundamentals',
    description: 'Learn why indexes exist and how they magically speed up query performance.',
    tables: ['customers', 'orders'],
    diagram: 'index-lookup',
    content: `# Indexing Fundamentals

In a small table of 10 rows, the database can easily just look at every row to find what you want. But what if you have 10 million rows?

Looking at every single row is called a **Table Scan** (or Sequential Scan). If a query takes 10 seconds because it scans 10 million rows, an index can drop that execution time to 1 millisecond.

## Why Do Indexes Exist?

Think of a database index exactly like the **index at the back of a textbook**. 

If you want to find all mentions of "SQL" in a 1000-page book:
1. **Without an index:** You must read all 1000 pages (Table Scan).
2. **With an index:** You look under "S" in the index, find "SQL", and it gives you the exact page numbers \`[42, 105, 890]\` (Index Lookup).

## Creating an Index

You create an index on a specific column that you frequently search or filter by.

\`\`\`sql
CREATE INDEX idx_customer_id ON orders(customer_id);
\`\`\`

Now, whenever you run \`SELECT * FROM orders WHERE customer_id = 99\`, the database uses the index to instantly locate the rows on the disk.

## When Do Indexes Hurt Performance?

Indexes are not free! 
Every time you \`INSERT\`, \`UPDATE\`, or \`DELETE\` a row in the table, the database must also update the index to keep it accurate. 

If you have 50 indexes on a table, a single \`INSERT\` requires 51 writes to disk. Therefore, you only index columns you actually search, group, or join on.`,
    defaultQuery: '-- Try EXPLAIN to see if it uses a scan or index\nEXPLAIN SELECT * FROM orders WHERE customer_id = 5;',
    examples: [
      { title: 'The Scan', description: 'Notice the execution plan.', sql: 'EXPLAIN SELECT * FROM orders WHERE amount > 500;' },
      { title: 'Create Index', description: 'Add an index to speed up amount filter.', sql: 'CREATE INDEX idx_amount ON orders(amount);' },
      { title: 'The Index Lookup', description: 'Run EXPLAIN again — it might use the index!', sql: 'EXPLAIN SELECT * FROM orders WHERE amount > 500;' }
    ],
    exercises: [
      { id: 'idx_1', title: 'Create Name Index', description: 'Create an index named "idx_customer_name" on the customers table (name column).', expectedSql: 'CREATE INDEX idx_customer_name ON customers(name);', hint: 'CREATE INDEX idx_customer_name ON customers(name);', solution: 'CREATE INDEX idx_customer_name ON customers(name);' },
      { id: 'idx_2', title: 'Create Composite Index', description: 'Create an index "idx_order_date_amount" on orders(order_date, amount).', expectedSql: 'CREATE INDEX idx_order_date_amount ON orders(order_date, amount);', hint: 'Pass multiple columns inside the parentheses.', solution: 'CREATE INDEX idx_order_date_amount ON orders(order_date, amount);' },
      { id: 'idx_3', title: 'Explain a Query', description: 'Run EXPLAIN on: SELECT * FROM customers WHERE name = "Tech Corp";', expectedSql: "EXPLAIN SELECT * FROM customers WHERE name = 'Tech Corp';", hint: 'Prefix the statement with EXPLAIN.', solution: "EXPLAIN SELECT * FROM customers WHERE name = 'Tech Corp';" },
      { id: 'idx_4', title: 'Drop an Index', description: 'Indexes can be dropped. Write a query to drop index "idx_customer_name".', expectedSql: 'DROP INDEX idx_customer_name;', hint: 'Use DROP INDEX index_name;', solution: 'DROP INDEX idx_customer_name;' },
      { id: 'idx_5', title: 'When Not To Index', description: 'If a column "is_active" only has values TRUE and FALSE, an index might be ignored by the query planner because it is not selective enough! Write "SELECT 1;" to acknowledge.', expectedSql: 'SELECT 1;', hint: 'SELECT 1;', solution: 'SELECT 1;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     30 · B-Tree Indexes
     ══════════════════════════════════════════════════════════ */
  {
    id: 'b-tree',
    title: '30. B-Tree Indexes',
    description: 'Learn how balanced tree data structures make logarithmic lookups possible.',
    tables: ['orders'],
    content: `# B-Tree Indexes

We know indexes act like a book index, but how are they actually built in memory? The overwhelming majority of database indexes use a data structure called a **B-Tree** (Balanced Tree).

## How a B-Tree Works

Imagine a sorted hierarchy of nodes. 
- The top level is the **Root Node**.
- The middle levels are **Branch Nodes**.
- The bottom levels are **Leaf Nodes** (which hold the actual pointers to the table rows).

If you are searching for the number \`42\`:
The root node might say: "If less than 50, go left. If greater, go right." 
You go left. 
The branch node says: "If less than 25, go left. If greater, go right." 
You go right, and land on the leaf node securely holding \`42\`.

## The Power of O(log n)

Because the tree splits the search space into chunks at every level (node splitting), it achieves **Logarithmic Lookup Time O(log n)**.

If a table has 1 million rows, a B-Tree only needs to make about **20 comparisons** to find any specific row.
If a table has 1 billion rows, the B-Tree only needs about **30 comparisons**!

## Balanced Trees

The "B" in B-Tree stands for "Balanced". The database engine constantly reorganizes the tree during \`INSERT\` and \`DELETE\` operations to ensure that every leaf node is exactly the same distance from the root. This guarantees that searching for row 1 takes the exact same amount of time as searching for row 1,000,000.`,
    defaultQuery: '-- B-Trees are created automatically when you define an index.\nCREATE INDEX idx_order_id ON orders(order_id);',
    examples: [
      { title: 'Logarithmic Power', description: 'Finding 1 in a million is incredibly fast.', sql: 'SELECT * FROM orders WHERE order_id = 105;' }
    ],
    exercises: [
      { id: 'bt_1', title: 'Primary Key Index', description: 'Primary Keys automatically get a B-Tree index! Write a query to find order_id 103 (uses the automatic index).', expectedSql: 'SELECT * FROM orders WHERE order_id = 103;', hint: 'Just select the order.', solution: 'SELECT * FROM orders WHERE order_id = 103;' },
      { id: 'bt_2', title: 'Create B-Tree manually', description: 'Create an index "idx_amount" on orders(amount).', expectedSql: 'CREATE INDEX idx_amount ON orders(amount);', hint: 'CREATE INDEX name ON table(col);', solution: 'CREATE INDEX idx_amount ON orders(amount);' },
      { id: 'bt_3', title: 'Range Query Support', description: 'B-Trees are sorted, meaning they excel at range queries. Query orders where amount > 500.', expectedSql: 'SELECT * FROM orders WHERE amount > 500;', hint: 'Use amount > 500.', solution: 'SELECT * FROM orders WHERE amount > 500;' },
      { id: 'bt_4', title: 'Sorting Support', description: 'Because B-Trees are pre-sorted, ORDER BY queries can skip sorting entirely! Select orders ordered by amount.', expectedSql: 'SELECT * FROM orders ORDER BY amount;', hint: 'Use ORDER BY amount.', solution: 'SELECT * FROM orders ORDER BY amount;' },
      { id: 'bt_5', title: 'Complexity Question', description: 'If returning 30 rows out of 1B requires 30 checks, what is the Big-O time complexity? (Write SELECT "O(log n)";)', expectedSql: "SELECT 'O(log n)';", hint: "Write SELECT 'O(log n)';", solution: "SELECT 'O(log n)';" }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     31 · B+ Tree Indexes
     ══════════════════════════════════════════════════════════ */
  {
    id: 'b-plus-tree',
    title: '31. B+ Tree Indexes',
    description: 'Learn why modern databases use B+ Trees for range query optimization.',
    tables: ['orders'],
    content: `# B+ Tree Indexes

While B-Trees are fast, almost all modern relational databases (PostgreSQL, MySQL InnoDB, SQL Server) actually use a slight variation: the **B+ Tree**, pronounced "B-Plus Tree".

## How B+ Trees Differ

A pure B-Tree stores data pointers at every level of the tree (root, branches, and leaves). If you find your data in the root, you stop searching immediately.

A **B+ Tree** has two strict differences:
1. **Data is ONLY stored in Leaf Nodes.** The root and branches contain *only* traffic-routing keys, no actual data pointers.
2. **Leaf Nodes are linked together** in a doubly-linked list.

## Why B+ Trees Win at Databases

Because data is only at the bottom, every search operation takes the exact same number of steps, making performance incredibly predictable.

But the real superpower is the **Linked Leaves**. 

Imagine you run:
\`\`\`sql
SELECT * FROM orders WHERE amount BETWEEN 100 AND 500;
\`\`\`

A standard B-Tree would have to traverse from the root down to the leaf *for every single match*.
A B+ Tree traverses down from the root **once** to find \`100\`. Then, because the leaves are linked horizontally, it simply walks sideways reading the values (\`100, 250, 400\`) until it hits \`500\`! 

This makes **Range Queries** exponentially faster in a B+ Tree.`,
    defaultQuery: '-- Range queries are highly optimized by B+ Trees.\nSELECT * FROM orders WHERE order_date BETWEEN \'2023-01-01\' AND \'2023-03-31\';',
    examples: [
      { title: 'The Range Query', description: 'B+ Trees excel when scanning ranges horizontally.', sql: "SELECT * FROM orders WHERE order_date BETWEEN '2023-01-01' AND '2023-03-31';" }
    ],
    exercises: [
      { id: 'bpt_1', title: 'Execute Range Scan', description: 'Select all columns from orders where amount is between 200 and 400.', expectedSql: 'SELECT * FROM orders WHERE amount BETWEEN 200 AND 400;', hint: 'Use BETWEEN 200 AND 400.', solution: 'SELECT * FROM orders WHERE amount BETWEEN 200 AND 400;' },
      { id: 'bpt_2', title: 'Execute Date Range', description: 'Select all orders placed in April 2023 (between 2023-04-01 and 2023-04-30).', expectedSql: "SELECT * FROM orders WHERE order_date BETWEEN '2023-04-01' AND '2023-04-30';", hint: "Use string dates with BETWEEN.", solution: "SELECT * FROM orders WHERE order_date BETWEEN '2023-04-01' AND '2023-04-30';" },
      { id: 'bpt_3', title: 'Less Than Range', description: 'Select all orders where amount < 300 (which traverses from the leftmost B+ leaf to the 300 leaf).', expectedSql: 'SELECT * FROM orders WHERE amount < 300;', hint: 'Use amount < 300.', solution: 'SELECT * FROM orders WHERE amount < 300;' },
      { id: 'bpt_4', title: 'Create Date Index', description: 'Create an index exactly for range scanning dates: "idx_order_dt" on orders(order_date).', expectedSql: 'CREATE INDEX idx_order_dt ON orders(order_date);', hint: 'CREATE INDEX idx_order_dt ON orders(order_date);', solution: 'CREATE INDEX idx_order_dt ON orders(order_date);' },
      { id: 'bpt_5', title: 'Horizontal Walking', description: 'Write "SELECT 1;" to acknowledge that B+ tree leaves are linked horizontally, making these range queries fast.', expectedSql: 'SELECT 1;', hint: 'SELECT 1;', solution: 'SELECT 1;' }
    ]
  },

  /* ══════════════════════════════════════════════════════════
     32 · Query Optimization Basics
     ══════════════════════════════════════════════════════════ */
  {
    id: 'query-optimization',
    title: '32. Query Optimization',
    description: 'Understand the query planner, execution plans, and cost-based optimization.',
    tables: ['customers', 'orders'],
    content: `# Query Optimization Basics

When you send a SQL query to the database, it doesn't just blindly execute the code top-to-bottom. The database compiles the query using an engine called the **Query Planner** (or Query Optimizer).

## The Query Planner

SQL is a *declarative* language. You tell it **what** you want, not **how** to get it. 

The query planner figures out the "how".
If you join three tables, the planner decides:
- Which table to read first?
- Should it use an index, or would a full table scan actually be faster?
- Should it sort the data in memory, or use a pre-sorted index?

## Cost-Based Optimization (CBO)

Modern planners use **Cost-Based Optimization**. The database keeps statistical tracking of table sizes, numeric distributions, and correlations.

It calculates the CPU and Disk I/O "cost" for hundreds of different execution strategies, and chooses the one with the lowest cost. 

*Example: If you query \`WHERE gender = 'M'\`, an index scan reading 50% of the table is slower than just full-scanning the table directly, because jumping between the index and table takes extra disk seeks. The CBO is smart enough to ignore the index!*

## Understanding the Execution Plan

You can peek into the planner's brain using \`EXPLAIN\`.

\`EXPLAIN\` outputs the chosen strategy. Look for:
- **Seq Scan (Sequential Scan):** Full table scan. Bad for huge tables.
- **Index Scan:** Uses the tree structure. Fast.
- **Nested Loop / Hash Join:** How joining tables are combined.

*Note: DuckDB WASM's explain output is highly technical, but you'll see keywords like \`SEQ_SCAN\`!*`,
    defaultQuery: 'EXPLAIN SELECT c.name, o.amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.amount > 1000;',
    examples: [
      { title: 'Explain a JOIN', description: 'See how the database plans to join multiple tables.', sql: 'EXPLAIN SELECT c.name, o.amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.amount > 1000;' },
      { title: 'Explain an Aggregation', description: 'See how GROUP BY is executed (often a Hash Aggregate).', sql: 'EXPLAIN SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id;' }
    ],
    exercises: [
      { id: 'opt_1', title: 'Run an Explain', description: 'Use EXPLAIN on: SELECT * FROM orders;', expectedSql: 'EXPLAIN SELECT * FROM orders;', hint: 'Prefix with EXPLAIN.', solution: 'EXPLAIN SELECT * FROM orders;' },
      { id: 'opt_2', title: 'Optimize a Query', description: 'Instead of SELECT * which wastes memory fetching unneeded columns, select ONLY order_id and amount from orders.', expectedSql: 'SELECT order_id, amount FROM orders;', hint: 'Only request order_id and amount.', solution: 'SELECT order_id, amount FROM orders;' },
      { id: 'opt_3', title: 'Filter Early', description: 'Select order_id from orders where amount > 1000. Filtering rows early reduces the data passed to later stages.', expectedSql: 'SELECT order_id FROM orders WHERE amount > 1000;', hint: 'Use WHERE amount > 1000.', solution: 'SELECT order_id FROM orders WHERE amount > 1000;' },
      { id: 'opt_4', title: 'Explain Filtering', description: 'Run EXPLAIN on the previous query (SELECT order_id FROM orders WHERE amount > 1000).', expectedSql: 'EXPLAIN SELECT order_id FROM orders WHERE amount > 1000;', hint: 'Add EXPLAIN.', solution: 'EXPLAIN SELECT order_id FROM orders WHERE amount > 1000;' },
      { id: 'opt_5', title: 'Cost-Based Smartness', description: 'If you want to trick an index into not being used, wrap the column in a function! Select * from orders where ABS(amount) > 0. This disables the index!', expectedSql: 'SELECT * FROM orders WHERE ABS(amount) > 0;', hint: 'SELECT * FROM orders WHERE ABS(amount) > 0;', solution: 'SELECT * FROM orders WHERE ABS(amount) > 0;' }
    ]
  }
];
