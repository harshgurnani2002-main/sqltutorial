export type InteractiveExample = {
  title: string;
  description: string;
  sql: string;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  expectedSql: string;
  hint: string;
  solution: string;
  tables?: string[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  defaultQuery: string;
  tables: string[];
  examples: InteractiveExample[];
  exercises: Exercise[];
  diagram?: 'filter-pipeline' | 'join-venn' | 'join-animated' | 'groupby-buckets' | 'window-partition' | 'index-lookup';
};

export const lessons: Lesson[] = [
  /* ══════════════════════════════════════════════════════════
     1 · Introduction to Databases
     ══════════════════════════════════════════════════════════ */
  {
    id: 'introduction',
    title: '1. Introduction to Databases',
    description: 'Understand what databases are, how tables store data, and the relational model.',
    tables: ['employees', 'customers', 'products', 'orders'],
    content: `# What Is a Database?

A **database** is an organized collection of structured data stored electronically. Think of it as a digital filing cabinet that lets you quickly search, sort, and retrieve information.

Databases power almost every modern application — from e-commerce sites tracking orders, to banking systems managing transactions, to social media platforms storing user profiles.

## Why Use a Database?

Without a database, you'd store data in spreadsheets or text files. Databases offer critical advantages:

- **Speed** — queries can search millions of rows in milliseconds.
- **Concurrency** — multiple users can read and write data simultaneously.
- **Integrity** — rules (constraints) keep data consistent and valid.
- **Security** — access can be controlled per user, per table, or even per column.

## Tables, Rows & Columns

Data lives in **tables**. Each table has:

- **Columns** — the categories of data (e.g. \`name\`, \`salary\`, \`department\`).
- **Rows** — individual records (one row = one employee, one order, etc.).

Here's what the \`employees\` table looks like:

| id | name | department | salary | hire_date |
|----|------|------------|--------|-----------|
| 1 | Alice Johnson | Engineering | 95000 | 2019-03-15 |
| 2 | Bob Smith | Engineering | 88000 | 2020-07-01 |
| 3 | Charlie Lee | Sales | 62000 | 2018-11-20 |

Each column has a **data type**: \`INTEGER\`, \`VARCHAR\` (text), \`DATE\`, \`DECIMAL\`, etc.

## The Relational Model

Tables can **relate** to each other through shared columns called **keys**:

- A **primary key** (PK) uniquely identifies each row — like \`employees.id\`.
- A **foreign key** (FK) references a primary key in another table — like \`orders.customer_id\` referencing \`customers.customer_id\`.

This lets you connect data across tables without duplicating it.

## SQL — Structured Query Language

SQL is the language used to communicate with databases. With SQL you can:

- **Query** data (\`SELECT\`)
- **Insert** new rows (\`INSERT\`)
- **Update** existing rows (\`UPDATE\`)
- **Delete** rows (\`DELETE\`)
- **Create** tables and indexes (\`CREATE\`)

## Your First Query

The simplest SQL command retrieves everything from a table:

\`\`\`sql
SELECT * FROM employees;
\`\`\`

The \`*\` means "all columns". This returns every row and every column from the \`employees\` table.

## Counting Rows

Want to know how many rows a table has?

\`\`\`sql
SELECT COUNT(*) FROM employees;
\`\`\`

Try the interactive examples below to explore each table in the database →`,
    defaultQuery: 'SELECT * FROM employees;',
    examples: [
      { title: 'View All Employees', description: 'See every row and column in the employees table.', sql: 'SELECT * FROM employees;' },
      { title: 'View All Customers', description: 'Explore the customers table.', sql: 'SELECT * FROM customers;' },
      { title: 'View All Products', description: 'See the product catalog.', sql: 'SELECT * FROM products;' },
      { title: 'Count All Orders', description: 'How many orders are in the database?', sql: 'SELECT COUNT(*) AS total_orders FROM orders;' },
    ],
    exercises: [
      { id: 'intro_1', title: 'Explore Employees', description: 'Select all rows from the employees table.', expectedSql: 'SELECT * FROM employees;', hint: 'Use SELECT * FROM table_name;', solution: 'SELECT * FROM employees;' },
      { id: 'intro_2', title: 'Explore Customers', description: 'Select all rows from the customers table.', expectedSql: 'SELECT * FROM customers;', hint: 'Same pattern — change the table name.', solution: 'SELECT * FROM customers;' },
      { id: 'intro_3', title: 'Explore Products', description: 'Select all rows from the products table.', expectedSql: 'SELECT * FROM products;', hint: 'SELECT * FROM products;', solution: 'SELECT * FROM products;' },
      { id: 'intro_4', title: 'Explore Orders', description: 'Select all rows from the orders table.', expectedSql: 'SELECT * FROM orders;', hint: 'SELECT * FROM orders;', solution: 'SELECT * FROM orders;' },
      { id: 'intro_5', title: 'Select One Column', description: 'Select only the name column from employees.', expectedSql: 'SELECT name FROM employees;', hint: 'Replace * with the column name.', solution: 'SELECT name FROM employees;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     2 · SELECT Basics
     ══════════════════════════════════════════════════════════ */
  {
    id: 'select-basics',
    title: '2. SELECT Basics',
    description: 'Learn to choose specific columns, use aliases, compute expressions, and remove duplicates.',
    tables: ['employees', 'products'],
    content: `# The SELECT Statement

\`SELECT\` is the most fundamental SQL command. It tells the database **which columns** you want to see.

## Selecting Specific Columns

Instead of \`SELECT *\` (all columns), list only the columns you need:

\`\`\`sql
SELECT name, salary FROM employees;
\`\`\`

This returns just two columns. Selecting only what you need is faster and clearer.

## Column Aliases with AS

Give columns friendly, readable names using \`AS\`:

\`\`\`sql
SELECT name AS employee_name,
       salary AS annual_pay
FROM employees;
\`\`\`

The column headers in the result will show \`employee_name\` and \`annual_pay\` instead of \`name\` and \`salary\`.

## Computed Expressions

You can **calculate new values** directly in SELECT:

\`\`\`sql
SELECT name,
       salary / 12 AS monthly_pay
FROM employees;
\`\`\`

This divides each salary by 12 to show monthly pay. You can use \`+\`, \`-\`, \`*\`, \`/\` operators.

## Combining Columns

Concatenate text columns:

\`\`\`sql
SELECT name || ' (' || department || ')' AS employee_info
FROM employees;
\`\`\`

## DISTINCT — Removing Duplicates

If a column has repeated values, \`DISTINCT\` returns each value only once:

\`\`\`sql
SELECT DISTINCT department FROM employees;
\`\`\`

This shows the 4 unique department names, not 10 rows.

## Edge Cases

- \`SELECT *\` returns all columns — useful for exploration but avoid in production.
- Aliases don't change the actual data — they're just display names.
- Division by zero will cause an error.
- \`DISTINCT\` applies to the entire row, not just one column.`,
    defaultQuery: 'SELECT name, department, salary FROM employees;',
    examples: [
      { title: 'Select Specific Columns', description: 'Get just the name, department, and salary.', sql: 'SELECT name, department, salary FROM employees;' },
      { title: 'Column Aliases', description: 'Rename columns for clarity.', sql: "SELECT name AS employee, salary AS annual_pay FROM employees;" },
      { title: 'Monthly Salary Calculation', description: 'Divide salary by 12 to get monthly pay.', sql: 'SELECT name, salary / 12 AS monthly_pay FROM employees;' },
      { title: 'Distinct Departments', description: 'See all unique departments.', sql: 'SELECT DISTINCT department FROM employees;' },
    ],
    exercises: [
      { id: 'sel_1', title: 'Name & Department', description: 'Select the name and department of all employees.', expectedSql: 'SELECT name, department FROM employees;', hint: 'List the columns separated by commas.', solution: 'SELECT name, department FROM employees;' },
      { id: 'sel_2', title: 'Product Catalog', description: 'Select product name and price from the products table.', expectedSql: 'SELECT name, price FROM products;', hint: 'Use the products table.', solution: 'SELECT name, price FROM products;' },
      { id: 'sel_3', title: 'Aliased Columns', description: 'Select employee name with alias "employee" and salary with alias "pay".', expectedSql: "SELECT name AS employee, salary AS pay FROM employees;", hint: 'Use the AS keyword.', solution: "SELECT name AS employee, salary AS pay FROM employees;" },
      { id: 'sel_4', title: 'Monthly Pay', description: 'Calculate each employee monthly salary (salary / 12) aliased as monthly_pay.', expectedSql: 'SELECT name, salary / 12 AS monthly_pay FROM employees;', hint: 'Divide the salary column by 12.', solution: 'SELECT name, salary / 12 AS monthly_pay FROM employees;' },
      { id: 'sel_5', title: 'Unique Values', description: 'List all distinct departments from employees.', expectedSql: 'SELECT DISTINCT department FROM employees;', hint: 'Add DISTINCT before the column name.', solution: 'SELECT DISTINCT department FROM employees;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     3 · Filtering — WHERE
     ══════════════════════════════════════════════════════════ */
  {
    id: 'where-clause',
    title: '3. Filtering with WHERE',
    description: 'Filter rows using conditions, logical operators, LIKE, BETWEEN, IN, and NULL checks.',
    tables: ['employees', 'products'],
    diagram: 'filter-pipeline',
    content: `# The WHERE Clause

\`WHERE\` filters rows to only those that match a condition. Without WHERE, you get every row.

\`\`\`sql
SELECT * FROM employees WHERE department = 'Engineering';
\`\`\`

This returns only employees in the Engineering department.

## How WHERE Works

Think of WHERE as a **gatekeeper**. The database checks each row against the condition. Only rows where the condition is \`TRUE\` pass through.

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`=\` | Equal | \`salary = 90000\` |
| \`<>\` or \`!=\` | Not equal | \`department <> 'HR'\` |
| \`>\` | Greater than | \`salary > 70000\` |
| \`<\` | Less than | \`price < 100\` |
| \`>=\` | Greater or equal | \`stock >= 50\` |
| \`<=\` | Less or equal | \`quantity <= 5\` |

## Logical Operators — AND / OR / NOT

Combine multiple conditions:

\`\`\`sql
SELECT * FROM employees
WHERE department = 'Engineering' AND salary > 90000;
\`\`\`

\`\`\`sql
SELECT * FROM employees
WHERE department = 'Sales' OR department = 'Marketing';
\`\`\`

\`\`\`sql
SELECT * FROM employees
WHERE NOT department = 'HR';
\`\`\`

**Operator precedence**: \`NOT\` > \`AND\` > \`OR\`. Use parentheses to be explicit:

\`\`\`sql
SELECT * FROM employees
WHERE (department = 'Sales' OR department = 'Marketing') AND salary > 60000;
\`\`\`

## LIKE — Pattern Matching

Match text patterns with wildcards:

- \`%\` matches **zero or more** characters
- \`_\` matches **exactly one** character

\`\`\`sql
SELECT * FROM employees WHERE name LIKE 'A%';
\`\`\`

This finds names starting with "A" (Alice).

\`\`\`sql
SELECT * FROM employees WHERE name LIKE '%son';
\`\`\`

Names ending with "son" (Alice Johnson).

## BETWEEN — Range Matching

\`\`\`sql
SELECT * FROM products WHERE price BETWEEN 50 AND 200;
\`\`\`

This is equivalent to \`price >= 50 AND price <= 200\`. Both endpoints are **inclusive**.

## IN — List Matching

\`\`\`sql
SELECT * FROM employees WHERE department IN ('Sales', 'Marketing');
\`\`\`

Cleaner than writing multiple \`OR\` conditions.

## NULL Handling

\`NULL\` means "unknown" or "missing". You **cannot** use \`=\` to check for NULL:

\`\`\`sql
-- WRONG: this returns nothing
SELECT * FROM employees WHERE manager_id = NULL;

-- CORRECT:
SELECT * FROM employees WHERE manager_id IS NULL;
\`\`\`

Use \`IS NOT NULL\` to find rows that have a value.

## Common Mistakes

- Forgetting quotes around text values: \`WHERE department = Engineering\` fails
- Using \`=\` instead of \`IS\` for NULL checks
- Missing parentheses when mixing AND with OR`,
    defaultQuery: "SELECT * FROM employees WHERE salary > 70000;",
    examples: [
      { title: 'Filter by Department', description: 'Find all engineers.', sql: "SELECT * FROM employees WHERE department = 'Engineering';" },
      { title: 'Multiple Conditions', description: 'Engineers earning above 90k.', sql: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 90000;" },
      { title: 'Pattern Matching', description: 'Names starting with "A".', sql: "SELECT * FROM employees WHERE name LIKE 'A%';" },
      { title: 'Range & NULL', description: 'Affordable products and employees without managers.', sql: "SELECT * FROM employees WHERE manager_id IS NULL;" },
    ],
    exercises: [
      { id: 'whr_1', title: 'Sales Team', description: "Find all employees in the 'Sales' department.", expectedSql: "SELECT * FROM employees WHERE department = 'Sales';", hint: "Use WHERE department = 'Sales'.", solution: "SELECT * FROM employees WHERE department = 'Sales';" },
      { id: 'whr_2', title: 'Expensive Products', description: 'Find products with price greater than 100.', expectedSql: 'SELECT * FROM products WHERE price > 100;', hint: 'Use the > comparison operator.', solution: 'SELECT * FROM products WHERE price > 100;' },
      { id: 'whr_3', title: 'High-Earning Engineers', description: "Find employees in Engineering earning above 90000.", expectedSql: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 90000;", hint: 'Combine two conditions with AND.', solution: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 90000;" },
      { id: 'whr_4', title: 'Name Pattern', description: 'Find employees whose name starts with letter "F".', expectedSql: "SELECT * FROM employees WHERE name LIKE 'F%';", hint: "Use LIKE with the % wildcard.", solution: "SELECT * FROM employees WHERE name LIKE 'F%';" },
      { id: 'whr_5', title: 'Top-Level Employees', description: 'Find employees who have no manager (manager_id IS NULL).', expectedSql: 'SELECT * FROM employees WHERE manager_id IS NULL;', hint: 'Use IS NULL, not = NULL.', solution: 'SELECT * FROM employees WHERE manager_id IS NULL;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     4 · Sorting — ORDER BY
     ══════════════════════════════════════════════════════════ */
  {
    id: 'order-by',
    title: '4. Sorting with ORDER BY',
    description: 'Sort results ascending or descending by one or more columns.',
    tables: ['employees', 'products'],
    content: `# ORDER BY

By default, SQL returns rows in no guaranteed order. Use \`ORDER BY\` to sort results.

\`\`\`sql
SELECT * FROM employees ORDER BY salary DESC;
\`\`\`

## Ascending vs Descending

- \`ASC\` — lowest to highest (default if omitted)
- \`DESC\` — highest to lowest

\`\`\`sql
SELECT * FROM products ORDER BY price ASC;   -- cheapest first
SELECT * FROM products ORDER BY price DESC;  -- most expensive first
\`\`\`

## Multiple Sort Columns

Sort by department first, then by salary within each department:

\`\`\`sql
SELECT * FROM employees
ORDER BY department ASC, salary DESC;
\`\`\`

This groups employees by department alphabetically, and within each department, shows the highest earners first.

## Sorting by Expressions

You can sort by computed values:

\`\`\`sql
SELECT name, salary / 12 AS monthly
FROM employees
ORDER BY monthly DESC;
\`\`\`

## Sorting by Column Position

Instead of column names, you can use the position number:

\`\`\`sql
SELECT name, salary FROM employees ORDER BY 2 DESC;
\`\`\`

Here \`2\` refers to the second column (\`salary\`). This is less readable, so use column names when possible.

## LIMIT — Top N Results

Return only the first N rows:

\`\`\`sql
SELECT * FROM products ORDER BY price DESC LIMIT 3;
\`\`\`

This gives you the 3 most expensive products. \`LIMIT\` always goes at the end of the query.

## OFFSET — Skipping Rows

\`\`\`sql
SELECT * FROM employees ORDER BY salary DESC LIMIT 3 OFFSET 2;
\`\`\`

This skips the top 2 earners and shows the next 3. Useful for pagination.

## Common Mistakes

- Forgetting that \`ASC\` is the default
- Using \`LIMIT\` without \`ORDER BY\` — the results are unpredictable
- Column position numbers start at 1, not 0`,
    defaultQuery: 'SELECT * FROM employees ORDER BY salary DESC;',
    examples: [
      { title: 'Sort by Salary (High to Low)', description: 'See the highest earners first.', sql: 'SELECT * FROM employees ORDER BY salary DESC;' },
      { title: 'Multi-Column Sort', description: 'Group by department, then sort by salary within each.', sql: 'SELECT * FROM employees ORDER BY department ASC, salary DESC;' },
      { title: 'Top 3 Products', description: 'Most expensive products.', sql: 'SELECT * FROM products ORDER BY price DESC LIMIT 3;' },
    ],
    exercises: [
      { id: 'ord_1', title: 'Sort Products by Price', description: 'List all products ordered by price ascending.', expectedSql: 'SELECT * FROM products ORDER BY price ASC;', hint: 'Use ORDER BY price ASC.', solution: 'SELECT * FROM products ORDER BY price ASC;' },
      { id: 'ord_2', title: 'Newest Employees', description: 'List employees ordered by hire_date, newest first.', expectedSql: 'SELECT * FROM employees ORDER BY hire_date DESC;', hint: 'Use ORDER BY hire_date DESC.', solution: 'SELECT * FROM employees ORDER BY hire_date DESC;' },
      { id: 'ord_3', title: 'Multi-Sort', description: 'List employees sorted by department ASC then salary DESC.', expectedSql: 'SELECT * FROM employees ORDER BY department ASC, salary DESC;', hint: 'Separate columns with a comma.', solution: 'SELECT * FROM employees ORDER BY department ASC, salary DESC;' },
      { id: 'ord_4', title: 'Top 3 Most Expensive', description: 'Show the 3 most expensive products.', expectedSql: 'SELECT * FROM products ORDER BY price DESC LIMIT 3;', hint: 'Combine ORDER BY with LIMIT.', solution: 'SELECT * FROM products ORDER BY price DESC LIMIT 3;' },
      { id: 'ord_5', title: 'Sorted Names', description: 'Show employee names and salaries sorted by salary ascending.', expectedSql: 'SELECT name, salary FROM employees ORDER BY salary ASC;', hint: 'Select specific columns, then sort.', solution: 'SELECT name, salary FROM employees ORDER BY salary ASC;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     5 · Aggregations
     ══════════════════════════════════════════════════════════ */
  {
    id: 'aggregations',
    title: '5. Aggregate Functions',
    description: 'Use COUNT, SUM, AVG, MIN, and MAX to summarize data.',
    tables: ['employees', 'products', 'orders'],
    content: `# Aggregate Functions

Aggregate functions compute a **single value** from many rows. They collapse the table into summary statistics.

## The Five Core Aggregates

| Function | Description | Example |
|----------|-------------|---------|
| \`COUNT(*)\` | Number of rows | How many employees? |
| \`COUNT(col)\` | Non-NULL values in a column | How many have managers? |
| \`SUM(col)\` | Total of a numeric column | Total payroll |
| \`AVG(col)\` | Average value | Average salary |
| \`MIN(col)\` | Smallest value | Cheapest product |
| \`MAX(col)\` | Largest value | Highest salary |

## COUNT

\`\`\`sql
SELECT COUNT(*) AS total_employees FROM employees;
\`\`\`

\`COUNT(*)\` counts all rows. \`COUNT(manager_id)\` counts only rows where \`manager_id\` is not NULL.

\`\`\`sql
SELECT COUNT(manager_id) AS has_manager FROM employees;
\`\`\`

## SUM and AVG

\`\`\`sql
SELECT SUM(salary) AS total_payroll,
       AVG(salary) AS avg_salary
FROM employees;
\`\`\`

## MIN and MAX

\`\`\`sql
SELECT MIN(price) AS cheapest,
       MAX(price) AS most_expensive
FROM products;
\`\`\`

## Combining Aggregates

You can use multiple aggregate functions in one query:

\`\`\`sql
SELECT COUNT(*) AS total,
       MIN(salary) AS lowest,
       MAX(salary) AS highest,
       AVG(salary) AS average
FROM employees;
\`\`\`

## Aggregates with WHERE

Filter first, then aggregate:

\`\`\`sql
SELECT AVG(salary) AS eng_avg
FROM employees
WHERE department = 'Engineering';
\`\`\`

## Important Notes

- Aggregates ignore NULL values (except \`COUNT(*)\`)
- You cannot mix aggregate and non-aggregate columns without \`GROUP BY\`
- \`AVG\` on integers may truncate — cast to decimal for precision`,
    defaultQuery: 'SELECT COUNT(*) AS total, AVG(salary) AS avg_salary FROM employees;',
    examples: [
      { title: 'Count All Employees', description: 'How many employees are there?', sql: 'SELECT COUNT(*) AS total_employees FROM employees;' },
      { title: 'Salary Statistics', description: 'Min, max, and average salary in one query.', sql: 'SELECT MIN(salary) AS lowest, MAX(salary) AS highest, ROUND(AVG(salary),0) AS average FROM employees;' },
      { title: 'Total Order Revenue', description: 'Sum of all order amounts.', sql: 'SELECT SUM(amount) AS total_revenue FROM orders;' },
    ],
    exercises: [
      { id: 'agg_1', title: 'Total Headcount', description: 'Count the total number of employees.', expectedSql: 'SELECT COUNT(*) AS total_employees FROM employees;', hint: 'Use COUNT(*).', solution: 'SELECT COUNT(*) AS total_employees FROM employees;' },
      { id: 'agg_2', title: 'Highest Salary', description: 'Find the highest salary among all employees.', expectedSql: 'SELECT MAX(salary) AS max_salary FROM employees;', hint: 'Use MAX(salary).', solution: 'SELECT MAX(salary) AS max_salary FROM employees;' },
      { id: 'agg_3', title: 'Inventory Value', description: 'Calculate the total value of all product stock (SUM of price * stock).', expectedSql: 'SELECT SUM(price * stock) AS total_value FROM products;', hint: 'Multiply price by stock inside SUM.', solution: 'SELECT SUM(price * stock) AS total_value FROM products;' },
      { id: 'agg_4', title: 'Average Price', description: 'Find the average product price.', expectedSql: 'SELECT AVG(price) AS avg_price FROM products;', hint: 'Use AVG(price).', solution: 'SELECT AVG(price) AS avg_price FROM products;' },
      { id: 'agg_5', title: 'First Hire', description: 'Find the earliest hire date among employees.', expectedSql: 'SELECT MIN(hire_date) AS earliest_hire FROM employees;', hint: 'MIN works on dates too.', solution: 'SELECT MIN(hire_date) AS earliest_hire FROM employees;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     6 · GROUP BY & HAVING
     ══════════════════════════════════════════════════════════ */
  {
    id: 'group-by',
    title: '6. GROUP BY & HAVING',
    description: 'Group rows by a column and filter groups with HAVING.',
    tables: ['employees', 'orders', 'products'],
    diagram: 'groupby-buckets',
    content: `# GROUP BY

\`GROUP BY\` splits rows into **buckets** based on a column value, then applies aggregate functions to each bucket.

\`\`\`sql
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department;
\`\`\`

## How It Works — Step by Step

1. The engine scans all 10 employee rows.
2. Rows with the **same** \`department\` value are placed in the same bucket.
3. \`COUNT(*)\` is computed **per bucket**.

Result:

| department | headcount |
|------------|-----------|
| Engineering | 4 |
| Sales | 3 |
| Marketing | 2 |
| HR | 1 |

## Multiple Aggregates per Group

\`\`\`sql
SELECT department,
       COUNT(*) AS headcount,
       AVG(salary) AS avg_salary,
       MAX(salary) AS top_salary
FROM employees
GROUP BY department;
\`\`\`

## HAVING — Filtering Groups

\`HAVING\` filters **groups** (not individual rows — that's \`WHERE\`).

\`\`\`sql
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 70000;
\`\`\`

## WHERE vs HAVING

- \`WHERE\` filters rows **before** grouping.
- \`HAVING\` filters groups **after** grouping.

\`\`\`sql
-- First filter to non-HR departments (WHERE), group, then keep only large departments (HAVING)
SELECT department, COUNT(*) AS headcount
FROM employees
WHERE department <> 'HR'
GROUP BY department
HAVING COUNT(*) > 2;
\`\`\`

## Common Mistakes

- Selecting a non-aggregated column that isn't in GROUP BY
- Using WHERE instead of HAVING to filter on aggregate results
- Forgetting that GROUP BY changes the meaning of SELECT`,
    defaultQuery: "SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;",
    examples: [
      { title: 'Count per Department', description: 'How many employees in each department?', sql: 'SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department;' },
      { title: 'Department Statistics', description: 'Avg and max salary per department.', sql: 'SELECT department, ROUND(AVG(salary),0) AS avg_salary, MAX(salary) AS top_salary FROM employees GROUP BY department;' },
      { title: 'HAVING Filter', description: 'Only departments with avg salary above 70k.', sql: 'SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department HAVING AVG(salary) > 70000;' },
    ],
    exercises: [
      { id: 'grp_1', title: 'Headcount per Dept', description: 'Count employees in each department.', expectedSql: 'SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department;', hint: 'GROUP BY department, then COUNT(*).', solution: 'SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department;' },
      { id: 'grp_2', title: 'Avg Salary per Dept', description: 'Find average salary per department.', expectedSql: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;', hint: 'Use AVG(salary) with GROUP BY.', solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;' },
      { id: 'grp_3', title: 'Orders per Customer', description: 'Count orders per customer_id.', expectedSql: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;', hint: 'GROUP BY customer_id on the orders table.', solution: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;' },
      { id: 'grp_4', title: 'High-Salary Departments', description: 'Find departments with average salary above 70000.', expectedSql: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 70000;', hint: 'Use HAVING to filter after grouping.', solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 70000;' },
      { id: 'grp_5', title: 'Large Categories', description: 'Count products per category, only show categories with more than 2 products.', expectedSql: 'SELECT category, COUNT(*) AS cnt FROM products GROUP BY category HAVING COUNT(*) > 2;', hint: 'GROUP BY category, HAVING COUNT(*) > 2.', solution: 'SELECT category, COUNT(*) AS cnt FROM products GROUP BY category HAVING COUNT(*) > 2;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     7 · JOINS  — MASSIVELY EXPANDED
     ══════════════════════════════════════════════════════════ */
  {
    id: 'joins',
    title: '7. SQL JOINS',
    description: 'Combine rows from multiple tables using INNER, LEFT, RIGHT, and FULL joins.',
    tables: ['customers', 'orders', 'products'],
    diagram: 'join-animated',
    content: `# Why Do Joins Exist?

In a well-designed database, data is **normalized** — split across multiple tables to avoid duplication. For example:

- \`customers\` stores customer info (name, email, country)
- \`orders\` stores order info (amount, date) with a \`customer_id\` that points back to customers

To answer "What did each customer order?", you need to **combine** these tables. That's what a JOIN does.

## Relational Keys

### Primary Keys (PK)

A primary key **uniquely identifies** each row in a table. No two rows can have the same PK.

- \`customers.customer_id\` — each customer has a unique ID
- \`products.product_id\` — each product has a unique ID

### Foreign Keys (FK)

A foreign key is a column that **references** a primary key in another table. It creates a link between tables.

- \`orders.customer_id\` → references \`customers.customer_id\`
- \`orders.product_id\` → references \`products.product_id\`

## How a JOIN Works

A JOIN compares every row in Table A with every row in Table B. For each pair, it checks the **join condition**. If the condition is true, it combines the rows.

\`\`\`sql
SELECT o.order_id, c.name, o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

The \`ON\` clause specifies the join condition: match rows where \`customer_id\` is equal.

## Join Types Explained

### INNER JOIN

Returns only rows where **both** tables have a match.

If a customer has no orders → that customer is **excluded**.
If an order has no matching customer → that order is **excluded**.

\`\`\`sql
SELECT o.order_id, c.name, o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

### LEFT JOIN (LEFT OUTER JOIN)

Returns **all rows from the left table**, even if there's no match in the right table. Unmatched columns from the right table are filled with \`NULL\`.

\`\`\`sql
SELECT c.name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`

This shows **all customers** — even Euro Traders who has no orders (their order columns show NULL).

### RIGHT JOIN (RIGHT OUTER JOIN)

The mirror of LEFT JOIN — all rows from the **right** table, with NULLs for unmatched left-side columns.

### FULL OUTER JOIN

Returns all rows from **both** tables. Rows without a match on either side get NULL-filled columns.

\`\`\`sql
SELECT c.name, o.order_id
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`

## Join Cardinality

- **One-to-Many**: One customer → many orders. This is the most common join scenario.
- **One-to-One**: One employee → one desk assignment.
- **Many-to-Many**: Students ↔ Courses (requires a junction table).

## Table Aliases

Use short aliases to keep joins readable:

\`\`\`sql
-- Instead of:
SELECT orders.order_id, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id;

-- Use:
SELECT o.order_id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

## Joining Three Tables

You can chain multiple JOINs:

\`\`\`sql
SELECT c.name AS customer,
       p.name AS product,
       o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;
\`\`\`

## Finding Unmatched Rows

A powerful pattern — use LEFT JOIN + WHERE IS NULL to find rows with no match:

\`\`\`sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
\`\`\`

This finds customers who have **never placed an order**.

## Common Mistakes

- **Forgetting the ON clause** — this creates a CROSS JOIN (every row × every row)
- **Wrong join column** — make sure FK matches the correct PK
- **Ambiguous column names** — always prefix with table alias when both tables have a column with the same name
- **Using INNER JOIN when LEFT is needed** — if you want to see ALL customers, use LEFT JOIN`,
    defaultQuery: "SELECT o.order_id, c.name AS customer, p.name AS product, o.amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.customer_id\nINNER JOIN products p ON o.product_id = p.product_id;",
    examples: [
      { title: 'INNER JOIN: Orders + Customers', description: 'See who placed each order.', sql: 'SELECT o.order_id, c.name, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;' },
      { title: 'LEFT JOIN: All Customers', description: 'Show all customers — even those without orders.', sql: 'SELECT c.name, o.order_id, o.amount FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;' },
      { title: 'Three-Table JOIN', description: 'Customer name, product name, and order amount.', sql: "SELECT c.name AS customer, p.name AS product, o.amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.customer_id\nINNER JOIN products p ON o.product_id = p.product_id;" },
      { title: 'Find Customers Without Orders', description: 'LEFT JOIN + IS NULL pattern.', sql: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;' },
    ],
    exercises: [
      { id: 'jn_1', title: 'Basic INNER JOIN', description: 'Join orders with customers to show order_id, customer name, and amount.', expectedSql: 'SELECT o.order_id, c.name, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;', hint: 'Use INNER JOIN with ON matching customer_id.', solution: 'SELECT o.order_id, c.name, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;', tables: ['orders', 'customers'] },
      { id: 'jn_2', title: 'Products in Orders', description: 'Join orders with products to show order_id, product name, and quantity.', expectedSql: 'SELECT o.order_id, p.name, o.quantity FROM orders o INNER JOIN products p ON o.product_id = p.product_id;', hint: 'Join on product_id.', solution: 'SELECT o.order_id, p.name, o.quantity FROM orders o INNER JOIN products p ON o.product_id = p.product_id;', tables: ['orders', 'products'] },
      { id: 'jn_3', title: 'Customer Order Count', description: 'LEFT JOIN customers with orders to show all customers and their order count.', expectedSql: 'SELECT c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name;', hint: 'Use LEFT JOIN so customers with 0 orders appear. COUNT the order_id.', solution: 'SELECT c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name;', tables: ['customers', 'orders'] },
      { id: 'jn_4', title: 'Three-Table Join', description: 'Show customer name, product name, and amount for each order (join 3 tables).', expectedSql: 'SELECT c.name AS customer, p.name AS product, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id INNER JOIN products p ON o.product_id = p.product_id;', hint: 'Chain two INNER JOINs from the orders table.', solution: 'SELECT c.name AS customer, p.name AS product, o.amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id INNER JOIN products p ON o.product_id = p.product_id;', tables: ['orders', 'customers', 'products'] },
      { id: 'jn_5', title: 'Customers Without Orders', description: 'Find customers who have placed no orders using LEFT JOIN.', expectedSql: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;', hint: 'LEFT JOIN then filter WHERE o.order_id IS NULL.', solution: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;', tables: ['customers', 'orders'] },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     8 · Subqueries
     ══════════════════════════════════════════════════════════ */
  {
    id: 'subqueries',
    title: '8. Subqueries',
    description: 'Use queries inside queries for scalar values and correlated lookups.',
    tables: ['employees', 'customers', 'orders', 'products'],
    content: `# Subqueries

A **subquery** is a query nested inside another query. The inner query runs first, and its result is used by the outer query.

## Scalar Subquery

Returns a **single value** that can be used in a comparison:

\`\`\`sql
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

The subquery computes the average salary (73900), then the outer query finds everyone earning above that.

## IN Subquery

Returns a **list of values**. The outer query checks if a column value is in that list:

\`\`\`sql
SELECT * FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);
\`\`\`

This finds customers who have placed at least one order.

## NOT IN

The opposite — find items NOT in the list:

\`\`\`sql
SELECT * FROM products
WHERE product_id NOT IN (SELECT product_id FROM orders);
\`\`\`

Products that have never been ordered.

## Correlated Subquery

A correlated subquery references a column from the **outer** query. It runs once for each row:

\`\`\`sql
SELECT e.name, e.salary, e.department
FROM employees e
WHERE e.salary > (
  SELECT AVG(e2.salary)
  FROM employees e2
  WHERE e2.department = e.department
);
\`\`\`

For each employee, the subquery calculates the average salary **of their department**, then checks if they earn above it.

## EXISTS

\`EXISTS\` returns TRUE if the subquery returns **any rows**:

\`\`\`sql
SELECT c.name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
\`\`\`

This is often faster than \`IN\` for large datasets.

## Subqueries in FROM (Derived Tables)

Use a subquery as a temporary table:

\`\`\`sql
SELECT department, avg_salary
FROM (
  SELECT department, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department
) AS dept_stats
WHERE avg_salary > 70000;
\`\`\`

## When to Use Subqueries vs JOINs

- Use subqueries for simple existence/comparison checks
- Use JOINs when you need columns from both tables
- Correlated subqueries can be slow — consider JOINs or CTEs as alternatives`,
    defaultQuery: "SELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);",
    examples: [
      { title: 'Above Average Salary', description: 'Find employees earning above the company average.', sql: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);' },
      { title: 'Customers With Orders', description: 'Find customers who have placed orders.', sql: 'SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders);' },
      { title: 'Above Department Average', description: 'Find employees earning above their own department average.', sql: "SELECT e.name, e.salary, e.department FROM employees e WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e.department);" },
    ],
    exercises: [
      { id: 'sub_1', title: 'Above Average', description: 'Find employees earning above the average salary.', expectedSql: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);', hint: 'Use a subquery with AVG in the WHERE clause.', solution: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);' },
      { id: 'sub_2', title: 'Active Customers', description: 'Find customers who have placed at least one order (use IN).', expectedSql: 'SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders);', hint: 'Use IN with a subquery on orders.', solution: 'SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders);' },
      { id: 'sub_3', title: 'Most Expensive Product', description: 'Find the most expensive product using a subquery.', expectedSql: 'SELECT * FROM products WHERE price = (SELECT MAX(price) FROM products);', hint: 'Subquery returns MAX(price), outer query matches it.', solution: 'SELECT * FROM products WHERE price = (SELECT MAX(price) FROM products);' },
      { id: 'sub_4', title: 'Department Stars', description: 'Find employees earning above their department average (correlated subquery).', expectedSql: "SELECT e.name, e.salary, e.department FROM employees e WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e.department);", hint: 'Reference outer table in the subquery WHERE.', solution: "SELECT e.name, e.salary, e.department FROM employees e WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e.department);" },
      { id: 'sub_5', title: 'Unordered Products', description: 'Find products that have never been ordered (using NOT IN).', expectedSql: 'SELECT * FROM products WHERE product_id NOT IN (SELECT product_id FROM orders);', hint: 'Use NOT IN with a subquery selecting product_id from orders.', solution: 'SELECT * FROM products WHERE product_id NOT IN (SELECT product_id FROM orders);' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     9 · Window Functions
     ══════════════════════════════════════════════════════════ */
  {
    id: 'window-functions',
    title: '9. Window Functions',
    description: 'Use ROW_NUMBER, RANK, and PARTITION BY for advanced analytics.',
    tables: ['employees', 'orders', 'products'],
    diagram: 'window-partition',
    content: `# Window Functions

Window functions perform calculations **across a set of rows** related to the current row — without collapsing them like GROUP BY does.

## The Key Difference from GROUP BY

- \`GROUP BY\` collapses rows → one output row per group
- Window functions keep **all rows** → adds a computed column to each row

## ROW_NUMBER

Assigns a unique sequential integer to each row:

\`\`\`sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
\`\`\`

Every employee gets a rank. The highest salary is rank 1.

## PARTITION BY

Restart the numbering within each group:

\`\`\`sql
SELECT name, department, salary,
       ROW_NUMBER() OVER (
         PARTITION BY department ORDER BY salary DESC
       ) AS dept_rank
FROM employees;
\`\`\`

Each department gets its own ranking. Fiona is #1 in Engineering, Charlie is #1 in Sales.

## RANK vs DENSE_RANK

- \`RANK()\` — ties get the same number, next rank is **skipped** (1, 1, 3, 4)
- \`DENSE_RANK()\` — ties get the same number, next rank is **not skipped** (1, 1, 2, 3)

\`\`\`sql
SELECT name, price,
       RANK() OVER (ORDER BY price DESC) AS price_rank
FROM products;
\`\`\`

## Running Totals with SUM

\`\`\`sql
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
\`\`\`

Each row shows the cumulative sum of all orders up to that date.

## The OVER() Clause

Every window function uses \`OVER()\`:

- \`OVER (ORDER BY col)\` — computes over all rows ordered by col
- \`OVER (PARTITION BY col ORDER BY col2)\` — computes within each partition

## Practical Use: Top N per Group

Find the highest-paid employee in each department:

\`\`\`sql
SELECT name, department, salary
FROM (
  SELECT name, department, salary,
         ROW_NUMBER() OVER (
           PARTITION BY department ORDER BY salary DESC
         ) AS rn
  FROM employees
)
WHERE rn = 1;
\`\`\``,
    defaultQuery: "SELECT name, department, salary,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;",
    examples: [
      { title: 'Global Ranking', description: 'Rank employees by salary across the company.', sql: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees;' },
      { title: 'Department Ranking', description: 'Rank within each department.', sql: 'SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;' },
      { title: 'Running Total', description: 'Cumulative order revenue over time.', sql: 'SELECT order_id, order_date, amount, SUM(amount) OVER (ORDER BY order_date) AS running_total FROM orders;' },
    ],
    exercises: [
      { id: 'win_1', title: 'Company-Wide Ranking', description: 'Rank all employees by salary descending using ROW_NUMBER.', expectedSql: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees;', hint: 'Use ROW_NUMBER() OVER (ORDER BY salary DESC).', solution: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank FROM employees;' },
      { id: 'win_2', title: 'Department Ranking', description: 'Rank employees within each department by salary descending.', expectedSql: 'SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;', hint: 'Add PARTITION BY department.', solution: 'SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;' },
      { id: 'win_3', title: 'Running Total', description: 'Calculate a running total of order amounts sorted by order_date.', expectedSql: 'SELECT order_id, amount, SUM(amount) OVER (ORDER BY order_date) AS running_total FROM orders;', hint: 'Use SUM() OVER (ORDER BY order_date).', solution: 'SELECT order_id, amount, SUM(amount) OVER (ORDER BY order_date) AS running_total FROM orders;' },
      { id: 'win_4', title: 'Price Ranking', description: 'Use RANK() to rank products by price descending.', expectedSql: 'SELECT name, price, RANK() OVER (ORDER BY price DESC) AS price_rank FROM products;', hint: 'RANK() works like ROW_NUMBER() but handles ties.', solution: 'SELECT name, price, RANK() OVER (ORDER BY price DESC) AS price_rank FROM products;' },
      { id: 'win_5', title: 'Top per Department', description: 'Find the highest-paid employee in each department using ROW_NUMBER.', expectedSql: "SELECT name, department, salary FROM (SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) WHERE rn = 1;", hint: 'Use a subquery: ROW_NUMBER with PARTITION BY, then filter WHERE rn = 1.', solution: "SELECT name, department, salary FROM (SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) WHERE rn = 1;" },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     10 · Performance & Optimization
     ══════════════════════════════════════════════════════════ */
  {
    id: 'performance',
    title: '10. Query Performance',
    description: 'Understand indexes, EXPLAIN plans, and optimization techniques.',
    tables: ['employees', 'orders'],
    diagram: 'index-lookup',
    content: `# Query Performance

As data grows from thousands to millions of rows, **how** you write queries matters enormously. A poorly written query on a large table can take minutes; an optimized one takes milliseconds.

## Indexes

An **index** is a data structure that speeds up lookups — like a book's index that lets you jump to the right page instead of reading every page.

\`\`\`sql
CREATE INDEX idx_emp_dept ON employees(department);
\`\`\`

After creating this index, queries filtering by \`department\` run faster because the engine can skip directly to matching rows.

## How Indexes Work

Without an index, the database performs a **full table scan** — checking every single row. This is O(n).

With an index, the database uses a tree structure (B-tree) to find matching rows in O(log n) time.

## When to Use Indexes

- Columns frequently used in \`WHERE\` clauses
- Columns used in \`JOIN\` conditions
- Columns used in \`ORDER BY\`
- High-cardinality columns (many unique values)

## When NOT to Index

- Very small tables (full scan is fast enough)
- Columns rarely used in queries
- Columns with very few unique values (e.g., boolean flags)
- Tables with very frequent writes (indexes slow down INSERT/UPDATE)

## EXPLAIN — Understanding Query Plans

See how the database plans to execute your query:

\`\`\`sql
EXPLAIN SELECT * FROM employees WHERE department = 'Engineering';
\`\`\`

The output shows whether the database is using an index, doing a full scan, or using other strategies.

## Optimization Tips

1. **Select only needed columns** — \`SELECT name, salary\` instead of \`SELECT *\`
2. **Filter early with WHERE** — reduce rows before joining or aggregating
3. **Avoid functions on indexed columns** — \`WHERE UPPER(name) = 'ALICE'\` can't use a name index
4. **Use LIMIT** when you only need a subset of rows
5. **Use EXISTS instead of IN** for large subqueries — EXISTS stops at the first match
6. **Avoid SELECT DISTINCT** when possible — it requires sorting all rows
7. **Use appropriate JOIN types** — don't use LEFT JOIN when INNER JOIN suffices`,
    defaultQuery: "EXPLAIN SELECT * FROM employees WHERE department = 'Engineering';",
    examples: [
      { title: 'Create an Index', description: 'Index the department column for faster lookups.', sql: 'CREATE INDEX idx_emp_dept ON employees(department);' },
      { title: 'EXPLAIN a Query', description: 'See the execution plan.', sql: "EXPLAIN SELECT * FROM employees WHERE department = 'Engineering';" },
      { title: 'Efficient Top N', description: 'Get top 5 earners using only needed columns.', sql: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;' },
    ],
    exercises: [
      { id: 'perf_1', title: 'Create Index', description: 'Create an index on the employees department column.', expectedSql: 'CREATE INDEX idx_emp_dept ON employees(department);', hint: 'Use CREATE INDEX name ON table(column).', solution: 'CREATE INDEX idx_emp_dept ON employees(department);' },
      { id: 'perf_2', title: 'EXPLAIN Plan', description: "Run EXPLAIN on: SELECT * FROM orders WHERE amount > 500.", expectedSql: 'EXPLAIN SELECT * FROM orders WHERE amount > 500;', hint: 'Prefix the query with EXPLAIN.', solution: 'EXPLAIN SELECT * FROM orders WHERE amount > 500;' },
      { id: 'perf_3', title: 'Efficient SELECT', description: 'Select only name and salary from employees where department is Engineering.', expectedSql: "SELECT name, salary FROM employees WHERE department = 'Engineering';", hint: "Don't use * — list the specific columns.", solution: "SELECT name, salary FROM employees WHERE department = 'Engineering';" },
      { id: 'perf_4', title: 'Top 5 Earners', description: 'Find the top 5 highest-paid employees efficiently.', expectedSql: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;', hint: 'ORDER BY + LIMIT for efficient top-N.', solution: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;' },
      { id: 'perf_5', title: 'EXISTS Pattern', description: 'Find customers with orders using EXISTS instead of IN.', expectedSql: 'SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);', hint: 'EXISTS returns TRUE if the subquery has any rows.', solution: 'SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     11 · Primary & Foreign Keys
     ══════════════════════════════════════════════════════════ */
  {
    id: 'keys',
    title: '11. Primary & Foreign Keys',
    description: 'Understand primary keys, foreign keys, and how tables relate to each other.',
    tables: ['employees', 'customers', 'orders', 'products'],
    content: `# Primary & Foreign Keys

Keys are the **foundation of the relational model**. They define how tables connect and enforce data integrity.

## Primary Key (PK)

A primary key **uniquely identifies every row** in a table. Rules:

- Every table should have one
- Values must be **unique** — no two rows can share the same PK
- Values must be **NOT NULL** — every row needs an identifier

\`\`\`sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  department VARCHAR NOT NULL
);
\`\`\`

The \`id\` column is the primary key. If you try to insert a duplicate, the database rejects it.

## Checking Primary Keys

You can discover primary keys by looking at the columns:

\`\`\`sql
SELECT * FROM employees ORDER BY id;
\`\`\`

Notice each \`id\` is unique and sequential.

## Foreign Key (FK)

A foreign key is a column that **references** a primary key in another table. It creates a link.

In our database:
- \`orders.customer_id\` → references \`customers.customer_id\`
- \`orders.product_id\` → references \`products.product_id\`
- \`employees.manager_id\` → references \`employees.id\` (self-reference!)

## Why Foreign Keys Matter

1. **Data Integrity** — you can't create an order for a customer that doesn't exist
2. **Relationships** — they define how data connects across tables
3. **Queries** — JOINs use foreign key relationships to combine tables

## Verifying Relationships

Check which customers have placed orders:

\`\`\`sql
SELECT DISTINCT o.customer_id, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

Find orphaned references (orders with no matching customer):

\`\`\`sql
SELECT o.order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
\`\`\`

## Composite Keys

Sometimes a primary key consists of **multiple columns**:

\`\`\`sql
CREATE TABLE enrollment (
  student_id INTEGER,
  course_id INTEGER,
  grade VARCHAR,
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

The combination of student + course is unique, not each column individually.

## Natural vs Surrogate Keys

- **Natural key**: uses real-world data (email, SSN) — can change
- **Surrogate key**: auto-generated integer (id) — stable, preferred`,
    defaultQuery: 'SELECT * FROM orders ORDER BY order_id;',
    examples: [
      { title: 'View Order Relationships', description: 'See how orders reference customers and products.', sql: 'SELECT order_id, customer_id, product_id FROM orders ORDER BY order_id;' },
      { title: 'Verify FK Integrity', description: 'Check that every order has a valid customer.', sql: 'SELECT o.order_id, o.customer_id, c.name FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id;' },
      { title: 'Self-Referencing FK', description: 'Employees whose manager_id points back to employees.id.', sql: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;' },
    ],
    exercises: [
      { id: 'key_1', title: 'Unique IDs', description: 'Select all employee IDs and names, ordered by id, to verify uniqueness.', expectedSql: 'SELECT id, name FROM employees ORDER BY id;', hint: 'SELECT id, name FROM employees ORDER BY id.', solution: 'SELECT id, name FROM employees ORDER BY id;' },
      { id: 'key_2', title: 'FK Columns', description: 'Select order_id, customer_id, and product_id from orders to see the foreign keys.', expectedSql: 'SELECT order_id, customer_id, product_id FROM orders;', hint: 'List the three key columns from orders.', solution: 'SELECT order_id, customer_id, product_id FROM orders;' },
      { id: 'key_3', title: 'Join via FK', description: 'Use the customer_id FK to join orders with customers. Show order_id and customer name.', expectedSql: 'SELECT o.order_id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;', hint: 'INNER JOIN on customer_id.', solution: 'SELECT o.order_id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;' },
      { id: 'key_4', title: 'Check Orphans', description: 'Find any orders where customer_id does not match a customer (should be 0).', expectedSql: 'SELECT o.order_id FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL;', hint: 'LEFT JOIN + WHERE IS NULL pattern.', solution: 'SELECT o.order_id FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL;' },
      { id: 'key_5', title: 'Self-Reference', description: 'Show each employee and their manager name using the manager_id self-referencing FK.', expectedSql: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;', hint: 'LEFT JOIN employees with itself using manager_id = id.', solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     12 · Self Joins
     ══════════════════════════════════════════════════════════ */
  {
    id: 'self-joins',
    title: '12. Self Joins',
    description: 'Join a table with itself to compare rows or traverse hierarchies.',
    tables: ['employees'],
    content: `# Self Joins

A **self join** is when you join a table with **itself**. This is useful for:

- Comparing rows within the same table
- Traversing hierarchies (employee → manager)
- Finding pairs or duplicates

## Employee → Manager Hierarchy

Our \`employees\` table has a \`manager_id\` column that references \`id\` in the same table:

\`\`\`sql
SELECT e.name AS employee,
       e.department,
       m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

We use **two aliases** (\`e\` and \`m\`) to treat the same table as two different tables.

## Why LEFT JOIN?

Some employees have \`manager_id = NULL\` (they're top-level). LEFT JOIN ensures they still appear.

\`\`\`sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
WHERE m.name IS NULL;
\`\`\`

This finds employees who report to nobody — the bosses.

## Finding Salary Comparisons

Compare each employee's salary to others in the same department:

\`\`\`sql
SELECT e1.name, e2.name AS colleague,
       e1.salary - e2.salary AS salary_diff
FROM employees e1
INNER JOIN employees e2
  ON e1.department = e2.department
  AND e1.id < e2.id;
\`\`\`

The \`e1.id < e2.id\` prevents duplicate pairs (Alice-Bob and Bob-Alice).

## Counting Direct Reports

\`\`\`sql
SELECT m.name AS manager,
       COUNT(e.id) AS direct_reports
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
GROUP BY m.name;
\`\`\`

## Common Patterns

- **Hierarchy traversal**: employee → manager → manager's manager
- **Pair comparisons**: find all employee pairs in same department
- **Duplicate detection**: find rows with matching values`,
    defaultQuery: "SELECT e.name AS employee,\n       e.department,\n       m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
    examples: [
      { title: 'Employee ↔ Manager', description: 'See who reports to whom.', sql: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;' },
      { title: 'Find the Bosses', description: 'Employees with no manager.', sql: 'SELECT e.name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id WHERE m.name IS NULL;' },
      { title: 'Direct Reports Count', description: 'How many people report to each manager?', sql: 'SELECT m.name AS manager, COUNT(e.id) AS direct_reports FROM employees e INNER JOIN employees m ON e.manager_id = m.id GROUP BY m.name;' },
    ],
    exercises: [
      { id: 'self_1', title: 'Employee-Manager List', description: 'Show each employee name and their manager name using a self join.', expectedSql: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;', hint: 'LEFT JOIN employees with itself.', solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;' },
      { id: 'self_2', title: 'Top-Level Employees', description: 'Find employees who have no manager (manager_id IS NULL).', expectedSql: 'SELECT name FROM employees WHERE manager_id IS NULL;', hint: 'Use WHERE manager_id IS NULL.', solution: 'SELECT name FROM employees WHERE manager_id IS NULL;' },
      { id: 'self_3', title: 'Direct Reports', description: 'Count direct reports per manager.', expectedSql: 'SELECT m.name AS manager, COUNT(e.id) AS direct_reports FROM employees e INNER JOIN employees m ON e.manager_id = m.id GROUP BY m.name;', hint: 'INNER JOIN employees e ON e.manager_id = m.id, then COUNT + GROUP BY.', solution: 'SELECT m.name AS manager, COUNT(e.id) AS direct_reports FROM employees e INNER JOIN employees m ON e.manager_id = m.id GROUP BY m.name;' },
      { id: 'self_4', title: 'Same Department Pairs', description: 'Find all pairs of employees in the same department (use e1.id < e2.id to avoid duplicates).', expectedSql: 'SELECT e1.name, e2.name AS colleague FROM employees e1 INNER JOIN employees e2 ON e1.department = e2.department AND e1.id < e2.id;', hint: 'Self join on department with e1.id < e2.id.', solution: 'SELECT e1.name, e2.name AS colleague FROM employees e1 INNER JOIN employees e2 ON e1.department = e2.department AND e1.id < e2.id;' },
      { id: 'self_5', title: 'Manager Department', description: 'Show employee name, department, and their manager department.', expectedSql: 'SELECT e.name AS employee, e.department, m.department AS manager_dept FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;', hint: 'Select department from both aliases.', solution: 'SELECT e.name AS employee, e.department, m.department AS manager_dept FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     13 · Common Table Expressions (CTEs)
     ══════════════════════════════════════════════════════════ */
  {
    id: 'ctes',
    title: '13. Common Table Expressions',
    description: 'Use WITH clauses to write readable, step-by-step queries.',
    tables: ['employees', 'orders', 'customers', 'products'],
    content: `# Common Table Expressions (CTEs)

A **CTE** (Common Table Expression) is a temporary named result set defined with \`WITH\`. It makes complex queries **readable and modular**.

## Basic Syntax

\`\`\`sql
WITH high_earners AS (
  SELECT name, salary, department
  FROM employees
  WHERE salary > 80000
)
SELECT * FROM high_earners;
\`\`\`

The CTE \`high_earners\` is like a temporary table that exists only for this query.

## Why Use CTEs?

1. **Readability** — break complex queries into named steps
2. **Reusability** — reference the same CTE multiple times
3. **Debugging** — test each step independently

## CTEs vs Subqueries

Subquery (hard to read):

\`\`\`sql
SELECT department, avg_sal FROM (
  SELECT department, AVG(salary) AS avg_sal
  FROM employees GROUP BY department
) WHERE avg_sal > 70000;
\`\`\`

CTE (much clearer):

\`\`\`sql
WITH dept_stats AS (
  SELECT department,
         AVG(salary) AS avg_sal
  FROM employees
  GROUP BY department
)
SELECT department, avg_sal
FROM dept_stats
WHERE avg_sal > 70000;
\`\`\`

## Multiple CTEs

Chain multiple CTEs separated by commas:

\`\`\`sql
WITH dept_totals AS (
  SELECT department, SUM(salary) AS total_salary
  FROM employees
  GROUP BY department
),
dept_count AS (
  SELECT department, COUNT(*) AS headcount
  FROM employees
  GROUP BY department
)
SELECT t.department, t.total_salary, c.headcount
FROM dept_totals t
INNER JOIN dept_count c ON t.department = c.department;
\`\`\`

## CTE with JOIN

\`\`\`sql
WITH customer_orders AS (
  SELECT customer_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT c.name, co.order_count, co.total_spent
FROM customer_orders co
INNER JOIN customers c ON co.customer_id = c.customer_id
ORDER BY co.total_spent DESC;
\`\`\`

## When to Use CTEs

- Queries with multiple aggregation steps
- Queries where the same subquery is used more than once
- Any query that's getting too complex to read
- Replacing deeply nested subqueries`,
    defaultQuery: "WITH high_earners AS (\n  SELECT name, salary, department\n  FROM employees\n  WHERE salary > 80000\n)\nSELECT * FROM high_earners;",
    examples: [
      { title: 'Basic CTE', description: 'Filter high earners using a CTE.', sql: "WITH high_earners AS (\n  SELECT name, salary, department\n  FROM employees\n  WHERE salary > 80000\n)\nSELECT * FROM high_earners;" },
      { title: 'Department Stats CTE', description: 'Calculate and filter department averages.', sql: "WITH dept_stats AS (\n  SELECT department, ROUND(AVG(salary),0) AS avg_sal, COUNT(*) AS cnt\n  FROM employees\n  GROUP BY department\n)\nSELECT * FROM dept_stats WHERE avg_sal > 70000;" },
      { title: 'CTE + JOIN', description: 'Summarize customer spending then join with names.', sql: "WITH customer_orders AS (\n  SELECT customer_id, COUNT(*) AS order_count, SUM(amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, co.order_count, co.total_spent\nFROM customer_orders co\nINNER JOIN customers c ON co.customer_id = c.customer_id\nORDER BY co.total_spent DESC;" },
    ],
    exercises: [
      { id: 'cte_1', title: 'Basic CTE', description: 'Create a CTE called high_earners that selects employees with salary > 80000, then SELECT * from it.', expectedSql: "WITH high_earners AS (SELECT name, salary, department FROM employees WHERE salary > 80000) SELECT * FROM high_earners;", hint: 'WITH name AS (query) SELECT * FROM name;', solution: "WITH high_earners AS (\n  SELECT name, salary, department\n  FROM employees\n  WHERE salary > 80000\n)\nSELECT * FROM high_earners;" },
      { id: 'cte_2', title: 'Department Averages', description: 'Use a CTE to find departments with average salary above 70000.', expectedSql: "WITH dept_stats AS (SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department) SELECT department, avg_sal FROM dept_stats WHERE avg_sal > 70000;", hint: 'CTE groups by department with AVG, outer query filters.', solution: "WITH dept_stats AS (\n  SELECT department, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY department\n)\nSELECT department, avg_sal\nFROM dept_stats\nWHERE avg_sal > 70000;" },
      { id: 'cte_3', title: 'Customer Spending', description: 'Create a CTE that sums order amounts per customer_id, then join with customers to show name and total_spent.', expectedSql: "WITH customer_orders AS (SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, co.total_spent FROM customer_orders co INNER JOIN customers c ON co.customer_id = c.customer_id;", hint: 'CTE aggregates orders, outer query joins with customers.', solution: "WITH customer_orders AS (\n  SELECT customer_id, SUM(amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, co.total_spent\nFROM customer_orders co\nINNER JOIN customers c ON co.customer_id = c.customer_id;" },
      { id: 'cte_4', title: 'Multiple CTEs', description: 'Create two CTEs: dept_salary (SUM salary by dept) and dept_count (COUNT by dept), then join them.', expectedSql: "WITH dept_salary AS (SELECT department, SUM(salary) AS total_salary FROM employees GROUP BY department), dept_count AS (SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department) SELECT t.department, t.total_salary, c.headcount FROM dept_salary t INNER JOIN dept_count c ON t.department = c.department;", hint: 'Separate CTEs with a comma. Join them in outer query.', solution: "WITH dept_salary AS (\n  SELECT department, SUM(salary) AS total_salary\n  FROM employees\n  GROUP BY department\n),\ndept_count AS (\n  SELECT department, COUNT(*) AS headcount\n  FROM employees\n  GROUP BY department\n)\nSELECT t.department, t.total_salary, c.headcount\nFROM dept_salary t\nINNER JOIN dept_count c ON t.department = c.department;" },
      { id: 'cte_5', title: 'Top Products CTE', description: 'Use a CTE to find products ordered more than once, showing product name and order count.', expectedSql: "WITH product_orders AS (SELECT product_id, COUNT(*) AS order_count FROM orders GROUP BY product_id HAVING COUNT(*) > 1) SELECT p.name, po.order_count FROM product_orders po INNER JOIN products p ON po.product_id = p.product_id;", hint: 'CTE groups orders by product_id with HAVING, join with products.', solution: "WITH product_orders AS (\n  SELECT product_id, COUNT(*) AS order_count\n  FROM orders\n  GROUP BY product_id\n  HAVING COUNT(*) > 1\n)\nSELECT p.name, po.order_count\nFROM product_orders po\nINNER JOIN products p ON po.product_id = p.product_id;" },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     14 · Views
     ══════════════════════════════════════════════════════════ */
  {
    id: 'views',
    title: '14. Views',
    description: 'Create reusable virtual tables with CREATE VIEW.',
    tables: ['employees', 'orders', 'customers'],
    content: `# Views

A **view** is a saved SQL query that acts like a virtual table. It doesn't store data — it runs the query every time you access it.

## Creating a View

\`\`\`sql
CREATE VIEW engineering_team AS
SELECT name, salary, hire_date
FROM employees
WHERE department = 'Engineering';
\`\`\`

Now you can query it like a table:

\`\`\`sql
SELECT * FROM engineering_team;
\`\`\`

## Why Use Views?

1. **Simplification** — hide complex joins behind a simple name
2. **Security** — expose only specific columns to certain users
3. **Consistency** — everyone uses the same query definition
4. **Reusability** — write the query once, use it everywhere

## Views with JOINs

\`\`\`sql
CREATE VIEW order_details AS
SELECT o.order_id, c.name AS customer, p.name AS product,
       o.quantity, o.amount, o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;
\`\`\`

Now a simple \`SELECT * FROM order_details\` gives you the full order info.

## Views with Aggregations

\`\`\`sql
CREATE VIEW department_summary AS
SELECT department, COUNT(*) AS headcount,
       ROUND(AVG(salary), 0) AS avg_salary,
       MAX(salary) AS top_salary
FROM employees
GROUP BY department;
\`\`\`

## Querying Views

Views work just like tables in other queries:

\`\`\`sql
SELECT * FROM department_summary
WHERE headcount > 2
ORDER BY avg_salary DESC;
\`\`\`

## Dropping Views

Remove a view when it's no longer needed:

\`\`\`sql
DROP VIEW IF EXISTS engineering_team;
\`\`\`

## Views vs CTEs vs Subqueries

| Feature | View | CTE | Subquery |
|---------|------|-----|----------|
| Persists | Yes (until dropped) | No (one query) | No |
| Reusable | Yes | Within query | No |
| Readable | High | High | Low |`,
    defaultQuery: "CREATE VIEW engineering_team AS\nSELECT name, salary, hire_date\nFROM employees\nWHERE department = 'Engineering';",
    examples: [
      { title: 'Create & Query View', description: 'Create a view for the engineering team.', sql: "CREATE OR REPLACE VIEW engineering_team AS SELECT name, salary, hire_date FROM employees WHERE department = 'Engineering';" },
      { title: 'Query the View', description: 'Use the view like a table.', sql: "SELECT * FROM engineering_team;" },
      { title: 'Order Details View', description: 'Create a view joining orders, customers, and products.', sql: "CREATE OR REPLACE VIEW order_details AS\nSELECT o.order_id, c.name AS customer, p.name AS product, o.quantity, o.amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.customer_id\nINNER JOIN products p ON o.product_id = p.product_id;" },
    ],
    exercises: [
      { id: 'view_1', title: 'Create Team View', description: "Create a view called sales_team showing name and salary of Sales department employees.", expectedSql: "CREATE OR REPLACE VIEW sales_team AS SELECT name, salary FROM employees WHERE department = 'Sales';", hint: "CREATE OR REPLACE VIEW name AS SELECT ...", solution: "CREATE OR REPLACE VIEW sales_team AS\nSELECT name, salary\nFROM employees\nWHERE department = 'Sales';" },
      { id: 'view_2', title: 'Query the View', description: 'Select all rows from the sales_team view.', expectedSql: 'SELECT * FROM sales_team;', hint: 'Query it like a regular table.', solution: 'SELECT * FROM sales_team;' },
      { id: 'view_3', title: 'Summary View', description: 'Create a view called dept_summary showing department, headcount, and avg_salary.', expectedSql: "CREATE OR REPLACE VIEW dept_summary AS SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department;", hint: 'Use GROUP BY in the view definition.', solution: "CREATE OR REPLACE VIEW dept_summary AS\nSELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;" },
      { id: 'view_4', title: 'Filter a View', description: 'Query dept_summary to show only departments with headcount > 2.', expectedSql: 'SELECT * FROM dept_summary WHERE headcount > 2;', hint: 'Filter the view in the WHERE clause.', solution: 'SELECT * FROM dept_summary WHERE headcount > 2;' },
      { id: 'view_5', title: 'Drop a View', description: 'Drop the sales_team view safely.', expectedSql: 'DROP VIEW IF EXISTS sales_team;', hint: 'Use DROP VIEW IF EXISTS.', solution: 'DROP VIEW IF EXISTS sales_team;' },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     15 · Advanced SQL — CASE, UNION, COALESCE
     ══════════════════════════════════════════════════════════ */
  {
    id: 'advanced-sql',
    title: '15. Advanced SQL',
    description: 'Master CASE expressions, UNION, COALESCE, and string functions.',
    tables: ['employees', 'customers', 'orders', 'products'],
    content: `# Advanced SQL Techniques

These powerful features let you handle complex logic, combine result sets, and handle NULL values gracefully.

## CASE Expressions

\`CASE\` adds **if/then/else** logic to your queries:

\`\`\`sql
SELECT name, salary,
  CASE
    WHEN salary >= 90000 THEN 'Senior'
    WHEN salary >= 70000 THEN 'Mid-Level'
    ELSE 'Junior'
  END AS level
FROM employees;
\`\`\`

Each row gets categorized based on the first matching \`WHEN\` condition.

## CASE in Aggregations

Count employees per category:

\`\`\`sql
SELECT
  SUM(CASE WHEN salary >= 90000 THEN 1 ELSE 0 END) AS senior_count,
  SUM(CASE WHEN salary >= 70000 AND salary < 90000 THEN 1 ELSE 0 END) AS mid_count,
  SUM(CASE WHEN salary < 70000 THEN 1 ELSE 0 END) AS junior_count
FROM employees;
\`\`\`

## COALESCE — Default for NULLs

\`COALESCE\` returns the **first non-NULL** value from a list:

\`\`\`sql
SELECT name,
       COALESCE(email, 'no-email@unknown.com') AS email
FROM customers;
\`\`\`

Euro Traders has \`NULL\` email, so COALESCE replaces it with the default.

## UNION — Combining Results

\`UNION\` stacks results from multiple queries:

\`\`\`sql
SELECT name, 'employee' AS type FROM employees
UNION
SELECT name, 'customer' AS type FROM customers;
\`\`\`

Rules:
- Both queries must have the **same number of columns**
- Column types should match
- \`UNION\` removes duplicates; \`UNION ALL\` keeps them

## UNION ALL (faster)

\`\`\`sql
SELECT name FROM employees
UNION ALL
SELECT name FROM customers;
\`\`\`

No deduplication, so it's faster for large datasets.

## String Functions

\`\`\`sql
SELECT UPPER(name) AS uppercase_name,
       LENGTH(name) AS name_length,
       REPLACE(department, 'Engineering', 'Eng') AS short_dept
FROM employees;
\`\`\`

## NULLIF

Returns NULL if the two arguments are equal:

\`\`\`sql
SELECT name, NULLIF(manager_id, 0) AS mgr
FROM employees;
\`\`\`

## Practical Example: Sales Report

\`\`\`sql
SELECT
  c.name AS customer,
  COALESCE(SUM(o.amount), 0) AS total_spent,
  COUNT(o.order_id) AS orders,
  CASE
    WHEN SUM(o.amount) > 2000 THEN 'VIP'
    WHEN SUM(o.amount) > 500 THEN 'Regular'
    ELSE 'New'
  END AS tier
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.name
ORDER BY total_spent DESC;
\`\`\``,
    defaultQuery: "SELECT name, salary,\n  CASE\n    WHEN salary >= 90000 THEN 'Senior'\n    WHEN salary >= 70000 THEN 'Mid-Level'\n    ELSE 'Junior'\n  END AS level\nFROM employees;",
    examples: [
      { title: 'CASE Expression', description: 'Categorize employees by salary level.', sql: "SELECT name, salary,\n  CASE\n    WHEN salary >= 90000 THEN 'Senior'\n    WHEN salary >= 70000 THEN 'Mid-Level'\n    ELSE 'Junior'\n  END AS level\nFROM employees;" },
      { title: 'COALESCE for NULLs', description: 'Replace NULL email with a default.', sql: "SELECT name, COALESCE(email, 'no-email@unknown.com') AS email FROM customers;" },
      { title: 'UNION', description: 'Combine employee and customer names.', sql: "SELECT name, 'employee' AS type FROM employees\nUNION\nSELECT name, 'customer' AS type FROM customers;" },
      { title: 'Sales Report', description: 'Customer tiers using CASE + LEFT JOIN.', sql: "SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent,\n  CASE\n    WHEN SUM(o.amount) > 2000 THEN 'VIP'\n    WHEN SUM(o.amount) > 500 THEN 'Regular'\n    ELSE 'New'\n  END AS tier\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.name\nORDER BY total_spent DESC;" },
    ],
    exercises: [
      { id: 'adv_1', title: 'Salary Levels', description: "Use CASE to label employees as 'Senior' (>=90000), 'Mid-Level' (>=70000), or 'Junior'. Show name, salary, level.", expectedSql: "SELECT name, salary, CASE WHEN salary >= 90000 THEN 'Senior' WHEN salary >= 70000 THEN 'Mid-Level' ELSE 'Junior' END AS level FROM employees;", hint: "CASE WHEN condition THEN value ... ELSE default END", solution: "SELECT name, salary,\n  CASE\n    WHEN salary >= 90000 THEN 'Senior'\n    WHEN salary >= 70000 THEN 'Mid-Level'\n    ELSE 'Junior'\n  END AS level\nFROM employees;" },
      { id: 'adv_2', title: 'Handle NULL Email', description: "Use COALESCE to show 'N/A' for customers with NULL email.", expectedSql: "SELECT name, COALESCE(email, 'N/A') AS email FROM customers;", hint: "COALESCE(column, default_value)", solution: "SELECT name, COALESCE(email, 'N/A') AS email FROM customers;" },
      { id: 'adv_3', title: 'Union Names', description: "Combine employee names (type='employee') and customer names (type='customer') using UNION.", expectedSql: "SELECT name, 'employee' AS type FROM employees UNION SELECT name, 'customer' AS type FROM customers;", hint: "Both SELECT must have same column count.", solution: "SELECT name, 'employee' AS type FROM employees\nUNION\nSELECT name, 'customer' AS type FROM customers;" },
      { id: 'adv_4', title: 'Count by Level', description: "Count how many Senior, Mid-Level, and Junior employees there are using CASE inside SUM.", expectedSql: "SELECT SUM(CASE WHEN salary >= 90000 THEN 1 ELSE 0 END) AS senior_count, SUM(CASE WHEN salary >= 70000 AND salary < 90000 THEN 1 ELSE 0 END) AS mid_count, SUM(CASE WHEN salary < 70000 THEN 1 ELSE 0 END) AS junior_count FROM employees;", hint: "SUM(CASE WHEN ... THEN 1 ELSE 0 END)", solution: "SELECT\n  SUM(CASE WHEN salary >= 90000 THEN 1 ELSE 0 END) AS senior_count,\n  SUM(CASE WHEN salary >= 70000 AND salary < 90000 THEN 1 ELSE 0 END) AS mid_count,\n  SUM(CASE WHEN salary < 70000 THEN 1 ELSE 0 END) AS junior_count\nFROM employees;" },
      { id: 'adv_5', title: 'Customer Tiers', description: "Create a customer tier report: show name, total_spent, and tier (VIP > 2000, Regular > 500, else New).", expectedSql: "SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent, CASE WHEN SUM(o.amount) > 2000 THEN 'VIP' WHEN SUM(o.amount) > 500 THEN 'Regular' ELSE 'New' END AS tier FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY total_spent DESC;", hint: "LEFT JOIN, GROUP BY, CASE, COALESCE for NULLs.", solution: "SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent,\n  CASE\n    WHEN SUM(o.amount) > 2000 THEN 'VIP'\n    WHEN SUM(o.amount) > 500 THEN 'Regular'\n    ELSE 'New'\n  END AS tier\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.name\nORDER BY total_spent DESC;" },
    ],
  },
];
