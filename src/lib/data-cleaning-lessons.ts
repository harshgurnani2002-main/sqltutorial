import { Lesson } from './lessons';

export const dataCleaningLessons: Lesson[] = [
  {
    id: "handling-nulls",
    title: "33. Handling NULL Values",
    description: "Learn how to identity, filter, and handle missing data using IS NULL and COALESCE.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Handling NULL Values\n\nIn real-world databases, data is rarely perfect. Often, columns will be completely missing values, which databases represent as `NULL`. Missing data can ruin aggregate functions like `AVG()` and break reporting logic.\n\n### Finding NULLs\nTo identify missing data, use the `IS NULL` or `IS NOT NULL` operators. You cannot use `=` or `!=` with NULL.\n```sql\nSELECT * FROM raw_customers WHERE email IS NULL;\n```\n\n### The COALESCE Function\n`COALESCE(val1, val2, ...)` returns the first non-null value in the list. This is the industry standard for providing fallback or default values on the fly.\n```sql\n-- If phone is NULL, returns 'No Phone'\nSELECT id, COALESCE(phone, 'No Phone') AS safe_phone FROM raw_customers;\n```\n\n### The NULLIF Function\n`NULLIF(expression1, expression2)` returns `NULL` if expression1 equals expression2, otherwise it returns expression1. Use this to turn empty strings `''` or placeholder errors into actual NULLs so they can be filtered out properly.\n```sql\nSELECT NULLIF(phone, '') FROM raw_customers;\n```",
    defaultQuery: "SELECT * FROM raw_customers LIMIT 10;",
    examples: [
      {
        title: "Find missing emails",
        description: "Identify all raw_customers missing an email.",
        sql: "SELECT id, name FROM raw_customers WHERE email IS NULL;"
      }
    ],
    exercises: [
      {
        id: "handling-nulls-1",
        title: "Identify Missing Phones",
        description: "Write a query to find all raw_customers where `phone` is missing (NULL). Return `id` and `name`.",
        expectedSql: "SELECT id, name FROM raw_customers WHERE phone IS NULL;",
        hint: "Use `IS NULL` on phone.",
        solution: "SELECT id, name FROM raw_customers WHERE phone IS NULL;"
      },
      {
        id: "handling-nulls-2",
        title: "Filter Valid Emails",
        description: "Retrieve all records from `raw_customers` where `email` is NOT NULL.",
        expectedSql: "SELECT * FROM raw_customers WHERE email IS NOT NULL;",
        hint: "Use `IS NOT NULL`.",
        solution: "SELECT * FROM raw_customers WHERE email IS NOT NULL;"
      },
      {
        id: "handling-nulls-3",
        title: "Provide Default Phones",
        description: "Select `id`, `name`, and replace missing `phone` with 'Unknown' using `COALESCE`.",
        expectedSql: "SELECT id, name, COALESCE(phone, 'Unknown') AS phone FROM raw_customers;",
        hint: "Use `COALESCE(phone, 'Unknown')`.",
        solution: "SELECT id, name, COALESCE(phone, 'Unknown') AS phone FROM raw_customers;"
      },
      {
        id: "handling-nulls-4",
        title: "Convert Empty Strings to NULL",
        description: "Select `id` and `phone` from `raw_customers`, turning empty strings `''` in `phone` to `NULL` using `NULLIF`.",
        expectedSql: "SELECT id, NULLIF(phone, '') AS phone FROM raw_customers;",
        hint: "Use `NULLIF(phone, '')`.",
        solution: "SELECT id, NULLIF(phone, '') AS phone FROM raw_customers;"
      }
    ]
  },
  {
    id: "filtering-invalid-data",
    title: "34. Filtering Invalid Data",
    description: "Learn to use WHERE conditions to filter logically invalid records.",
    tables: ["dirty_products", "raw_orders"],
    content: "## Filtering Invalid Data\n\nDirty data contains illogical or impossible values—like negative prices, dates from the year 3000, or nonsense status codes. Filtering this raw data before it hits analytical models is a fundamental Data Engineering step.\n\n### Removing Impossible Values\nAlways rely on `WHERE` bounds when extracting raw columns.\n```sql\nSELECT * FROM dirty_products WHERE price >= 0;\n```\n\n### Enforcing Business Rules\nOften, systems generate loose string values. We force validity by explicitly filtering against allowed application enums using `IN`.\n```sql\nSELECT * FROM raw_orders WHERE status IN ('pending', 'shipped', 'delivered');\n```",
    defaultQuery: "SELECT * FROM dirty_products LIMIT 10;",
    examples: [
      {
        title: "Filter valid prices",
        description: "Only pull positive prices.",
        sql: "SELECT * FROM dirty_products WHERE price > 0;"
      }
    ],
    exercises: [
      {
        id: "filtering-invalid-1",
        title: "Remove Negative Prices",
        description: "Select all from `dirty_products` where `price` is >= 0.",
        expectedSql: "SELECT * FROM dirty_products WHERE price >= 0;",
        hint: "Use `WHERE price >= 0`.",
        solution: "SELECT * FROM dirty_products WHERE price >= 0;"
      },
      {
        id: "filtering-invalid-2",
        title: "Filter Future Dates",
        description: "Select `id`, `name`, `created_at` from `raw_customers` where date is NOT in the future (<= '2025-01-01').",
        expectedSql: "SELECT id, name, created_at FROM raw_customers WHERE created_at <= '2025-01-01';",
        hint: "Use `<=` against the date.",
        solution: "SELECT id, name, created_at FROM raw_customers WHERE created_at <= '2025-01-01';"
      },
      {
        id: "filtering-invalid-3",
        title: "Validate Order Status",
        description: "Get `raw_orders` with valid `status`: 'pending', 'shipped', 'delivered'.",
        expectedSql: "SELECT * FROM raw_orders WHERE status IN ('pending', 'shipped', 'delivered');",
        hint: "Use `IN(...)`.",
        solution: "SELECT * FROM raw_orders WHERE status IN ('pending', 'shipped', 'delivered');"
      },
      {
        id: "filtering-invalid-4",
        title: "Combined Conditions",
        description: "Select `dirty_products` where `price` >= 0 AND `name` IS NOT NULL.",
        expectedSql: "SELECT * FROM dirty_products WHERE price >= 0 AND name IS NOT NULL;",
        hint: "Use `AND`.",
        solution: "SELECT * FROM dirty_products WHERE price >= 0 AND name IS NOT NULL;"
      }
    ]
  },
  {
    id: "removing-duplicates",
    title: "35. Removing Duplicates",
    description: "Strategies for deduplication using DISTINCT and GROUP BY.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Removing Duplicates\n\nIt happens all the time: users click submit twice, or integration APIs send the same payload twice. You must know how to dedupe mathematically.\n\n### DISTINCT vs GROUP BY\n`DISTINCT` is a quick way to find a unique list of rows. But if you want to keep the *most recent* action by a user, you rely on `GROUP BY` paired with an aggregate like `MAX`.\n```sql\n-- Quick unique list\nSELECT DISTINCT email FROM raw_customers;\n```\n\n### Safely Grouping Aggregates\nBy grouping on duplicate vectors (like email or phone), we can collapse duplicates without losing the data tied to them.\n```sql\nSELECT email, MAX(created_at) AS latest_action \nFROM raw_customers \nGROUP BY email;\n```",
    defaultQuery: "SELECT email, COUNT(*) FROM raw_customers GROUP BY email;",
    examples: [
      {
        title: "Find unique statuses",
        description: "List distinct statuses.",
        sql: "SELECT DISTINCT status FROM raw_orders;"
      }
    ],
    exercises: [
      {
        id: "dedup-1",
        title: "Distinct Emails",
        description: "Select a unique list of `email` from `raw_customers`.",
        expectedSql: "SELECT DISTINCT email FROM raw_customers;",
        hint: "Use `DISTINCT`.",
        solution: "SELECT DISTINCT email FROM raw_customers;"
      },
      {
        id: "dedup-2",
        title: "Identify Duplicates",
        description: "Find `phone` numbers in `raw_customers` appearing > 1 time. Output `phone` and `duplicate_count`.",
        expectedSql: "SELECT phone, COUNT(*) AS duplicate_count FROM raw_customers GROUP BY phone HAVING COUNT(*) > 1;",
        hint: "Use `HAVING COUNT(*) > 1`.",
        solution: "SELECT phone, COUNT(*) AS duplicate_count FROM raw_customers GROUP BY phone HAVING COUNT(*) > 1;"
      },
      {
        id: "dedup-3",
        title: "Latest Record",
        description: "For each `email` in `raw_customers`, return the `email` and MAX `created_at` as `latest_date`.",
        expectedSql: "SELECT email, MAX(created_at) AS latest_date FROM raw_customers GROUP BY email;",
        hint: "Group by email.",
        solution: "SELECT email, MAX(created_at) AS latest_date FROM raw_customers GROUP BY email;"
      },
      {
        id: "dedup-4",
        title: "Aggregate Duplicates",
        description: "Find total spent (sum of price) per `email` joining `raw_customers` to `raw_orders`.",
        expectedSql: "SELECT c.email, SUM(o.amount) AS total_spend FROM raw_customers c JOIN raw_orders o ON c.id = o.customer_id GROUP BY c.email;",
        hint: "Join and group by email.",
        solution: "SELECT c.email, SUM(o.amount) AS total_spend FROM raw_customers c JOIN raw_orders o ON c.id = o.customer_id GROUP BY c.email;"
      }
    ]
  },
  {
    id: "string-standardization",
    title: "36. String Standardization",
    description: "Clean text data by trimming whitespace and enforcing case consistency.",
    tables: ["raw_customers", "dirty_products"],
    content: "## Text Standardization\n\nUnsanitized system inputs usually contain extra spaces or varied caps (e.g., 'Alice@gmail.com' vs 'alice@gmail.com'). This destroys string-mapping joins.\n\n### Trimming\n`TRIM(string)` removes whitespace from both ends of a string. Variations like `LTRIM` and `RTRIM` exist, but global `TRIM` is standard.\n```sql\nSELECT TRIM(name) FROM dirty_products;\n```\n\n### Casing Standardization\nConvert all raw emails, physical addresses, and statuses explicitly to `LOWER()` or `UPPER()` before attempting any matching algorithms.\n```sql\nSELECT id, name, LOWER(email) AS clean_email FROM raw_customers;\n```",
    defaultQuery: "SELECT TRIM(name) FROM dirty_products;",
    examples: [
      {
        title: "Lowercase emails",
        description: "Enforce a lowercase standard.",
        sql: "SELECT LOWER(email) FROM raw_customers;"
      }
    ],
    exercises: [
      {
        id: "string-std-1",
        title: "Trim Names",
        description: "Select `id` and `TRIM(name)` aliased as `clean_name` from `dirty_products`.",
        expectedSql: "SELECT id, TRIM(name) AS clean_name FROM dirty_products;",
        hint: "Use `TRIM(name)`.",
        solution: "SELECT id, TRIM(name) AS clean_name FROM dirty_products;"
      },
      {
        id: "string-std-2",
        title: "Standardize Casing",
        description: "Return `id`, `name`, and `LOWER(email)` as `clean_email` from `raw_customers`.",
        expectedSql: "SELECT id, name, LOWER(email) AS clean_email FROM raw_customers;",
        hint: "Use `LOWER()`.",
        solution: "SELECT id, name, LOWER(email) AS clean_email FROM raw_customers;"
      },
      {
        id: "string-std-3",
        title: "Uppercase Status",
        description: "Return `id` and uppercase `status` from `raw_orders` as `sys_status`.",
        expectedSql: "SELECT id, UPPER(status) AS sys_status FROM raw_orders;",
        hint: "Use `UPPER()`.",
        solution: "SELECT id, UPPER(status) AS sys_status FROM raw_orders;"
      },
      {
        id: "string-std-4",
        title: "Trim AND Case",
        description: "Return `id` and `email` from `raw_customers` applying both `LOWER` and `TRIM` as `clean_email`.",
        expectedSql: "SELECT id, LOWER(TRIM(email)) AS clean_email FROM raw_customers;",
        hint: "Nest `LOWER(TRIM(email))`.",
        solution: "SELECT id, LOWER(TRIM(email)) AS clean_email FROM raw_customers;"
      }
    ]
  },
  {
    id: "fixing-inconsistent-data",
    title: "37. Fixing Inconsistent Data",
    description: "Use REPLACE to handle embedded errors and strip special characters.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Inconsistent Strings\n\n### The REPLACE Function\n`REPLACE(string, old_val, new_val)` hunts down hardcoded substrings and replaces them.\n```sql\nSELECT REPLACE(status, 'process', 'pending') FROM raw_orders;\n```\n\n### System-Agnostic Stripping\nCharacters like dashes `-` or parentheses `()` in phone numbers or currency symbols `$` disrupt data casts. By replacing them with empty strings `''`, you efficiently delete them entirely.\n```sql\n-- Removes dashes silently\nSELECT REPLACE(phone, '-', '') FROM raw_customers;\n```",
    defaultQuery: "SELECT phone FROM raw_customers;",
    examples: [
      {
        title: "Remove dashes",
        description: "Strips '-' from phone strings.",
        sql: "SELECT REPLACE(phone, '-', '') FROM raw_customers;"
      }
    ],
    exercises: [
      {
        id: "fix-inconsistent-1",
        title: "Strip formatting",
        description: "Select `id` and remove dashes from `phone` in `raw_customers` as `clean_phone`.",
        expectedSql: "SELECT id, REPLACE(phone, '-', '') AS clean_phone FROM raw_customers;",
        hint: "Use `REPLACE` with dashes.",
        solution: "SELECT id, REPLACE(phone, '-', '') AS clean_phone FROM raw_customers;"
      },
      {
        id: "fix-inconsistent-2",
        title: "Multiple Replacements",
        description: "Remove both dashes and spaces from `phone` in `raw_customers`.",
        expectedSql: "SELECT id, REPLACE(REPLACE(phone, '-', ''), ' ', '') AS clean_phone FROM raw_customers;",
        hint: "Nest two `REPLACE` functions.",
        solution: "SELECT id, REPLACE(REPLACE(phone, '-', ''), ' ', '') AS clean_phone FROM raw_customers;"
      },
      {
        id: "fix-inconsistent-3",
        title: "Domain Typos",
        description: "Replace '@gnail.com' with '@gmail.com' in `email` from `raw_customers`.",
        expectedSql: "SELECT id, REPLACE(email, '@gnail.com', '@gmail.com') AS fixed_email FROM raw_customers;",
        hint: "Replace the misspelled domain.",
        solution: "SELECT id, REPLACE(email, '@gnail.com', '@gmail.com') AS fixed_email FROM raw_customers;"
      },
      {
        id: "fix-inconsistent-4",
        title: "Status Mapping",
        description: "Replace 'shipped_out' with 'shipped' in `status` from `raw_orders`.",
        expectedSql: "SELECT id, REPLACE(status, 'shipped_out', 'shipped') AS new_status FROM raw_orders;",
        hint: "Use `REPLACE` on status.",
        solution: "SELECT id, REPLACE(status, 'shipped_out', 'shipped') AS new_status FROM raw_orders;"
      }
    ]
  },
  {
    id: "email-phone-cleaning",
    title: "38. Email & Phone Cleaning",
    description: "Combine techniques to fully cleanse contact info natively in SQL.",
    tables: ["raw_customers"],
    content: "## Contact Workflows\n\nClean contact data requires chaining methods together. An email must have an `@`, and a phone number mathematically shouldn't contain alphabetical or special string characters.\n\n### Full Stripping Trees\nYou can nest functions endlessly inside SQL.\n```sql\nSELECT REPLACE(REPLACE(REPLACE(phone, '(', ''), ')', ''), '-', '') FROM raw_customers;\n```\n\n### Regex-like Basic Validations\nBefore relying on expensive Regex patterns, you can validate structurally right in ANSI standard SQL using `LIKE`.\n```sql\n-- Requires at least an @ symbol\nSELECT email FROM raw_customers WHERE email LIKE '%@%.%';\n```",
    defaultQuery: "SELECT email FROM raw_customers;",
    examples: [
      {
        title: "Basic Validator",
        description: "Ensure @ exists.",
        sql: "SELECT email FROM raw_customers WHERE email LIKE '%@%';"
      }
    ],
    exercises: [
      {
        id: "contact-validation-1",
        title: "Strip All Symbols",
        description: "Remove `(`, `)`, `-`, and spaces from `phone` in `raw_customers`.",
        expectedSql: "SELECT id, REPLACE(REPLACE(REPLACE(REPLACE(phone, '(', ''), ')', ''), '-', ''), ' ', '') AS clean_phone FROM raw_customers;",
        hint: "Nest 4 REPLACE blocks.",
        solution: "SELECT id, REPLACE(REPLACE(REPLACE(REPLACE(phone, '(', ''), ')', ''), '-', ''), ' ', '') AS clean_phone FROM raw_customers;"
      },
      {
        id: "contact-validation-2",
        title: "Require @ symbol",
        description: "Select `id` and `email` where the email contains `@`.",
        expectedSql: "SELECT id, email FROM raw_customers WHERE email LIKE '%@%';",
        hint: "Use `LIKE '%@%'`.",
        solution: "SELECT id, email FROM raw_customers WHERE email LIKE '%@%';"
      },
      {
        id: "contact-validation-3",
        title: "Length Validation",
        description: "Remove dashes from `phone`, then SELECT ONLY rows where character length is exactly 10.",
        expectedSql: "SELECT id, REPLACE(phone, '-', '') AS clean_phone FROM raw_customers WHERE LENGTH(REPLACE(phone, '-', '')) = 10;",
        hint: "Use `LENGTH(REPLACE(...)) = 10`.",
        solution: "SELECT id, REPLACE(phone, '-', '') AS clean_phone FROM raw_customers WHERE LENGTH(REPLACE(phone, '-', '')) = 10;"
      },
      {
        id: "contact-validation-4",
        title: "Trim AND Structure Valid Emails",
        description: "Select `LOWER(TRIM(email))` filtered for containing both `@` AND `.` structures from `raw_customers`.",
        expectedSql: "SELECT LOWER(TRIM(email)) AS email FROM raw_customers WHERE email LIKE '%@%' AND email LIKE '%.%';",
        hint: "Use AND in WHERE combining LIKE checks.",
        solution: "SELECT LOWER(TRIM(email)) AS email FROM raw_customers WHERE email LIKE '%@%' AND email LIKE '%.%';"
      }
    ]
  },
  {
    id: "type-casting-conversion",
    title: "39. Type Casting",
    description: "Convert string columns into appropriate numeric and date formats for analytics using CAST.",
    tables: ["dirty_products", "raw_orders"],
    content: "## Type Conversion\n\nData ingestion systems typically dump everything as `VARCHAR` text strings. You cannot sum up a text column! You convert text data back into logic-capable types via `CAST()`.\n\n### The CAST Operator\n```sql\nSELECT CAST(price AS numeric) FROM dirty_products;\n```\nOnce explicitly cast to numerical format, you can run functions against the data!\n```sql\nSELECT SUM(CAST(price AS numeric)) FROM dirty_products;\n```\n\n### Order of Operations\nIf a string has a `$` and you try to CAST it to `numeric`, it will crash. You must `REPLACE` the `$` first, *then* cast the result!",
    defaultQuery: "SELECT CAST(price AS numeric) FROM dirty_products;",
    examples: [
      {
        title: "Text to Number",
        description: "Read text strings mathematically.",
        sql: "SELECT CAST('50' AS INT) * 2;"
      }
    ],
    exercises: [
      {
        id: "casting-1",
        title: "Cast Price Column",
        description: "Select `id` and cast `price` to `numeric` in `dirty_products` as `numeric_price`.",
        expectedSql: "SELECT id, CAST(price AS numeric) AS numeric_price FROM dirty_products;",
        hint: "Use `CAST(col AS type)`.",
        solution: "SELECT id, CAST(price AS numeric) AS numeric_price FROM dirty_products;"
      },
      {
        id: "casting-2",
        title: "Total Clean Value",
        description: "Find the total sum of `price` (`SUM(...)`), but cast it to `numeric` first inside the sum equation.",
        expectedSql: "SELECT SUM(CAST(price AS numeric)) AS total_value FROM dirty_products;",
        hint: "Wrap CAST inside SUM.",
        solution: "SELECT SUM(CAST(price AS numeric)) AS total_value FROM dirty_products;"
      },
      {
        id: "casting-3",
        title: "Cast to Dates",
        description: "Select `id` and cast `created_at` in `raw_orders` to a `DATE` format.",
        expectedSql: "SELECT id, CAST(created_at AS DATE) AS order_date FROM raw_orders;",
        hint: "CAST ... AS DATE.",
        solution: "SELECT id, CAST(created_at AS DATE) AS order_date FROM raw_orders;"
      },
      {
        id: "casting-4",
        title: "Clean then Cast",
        description: "From `dirty_products`, remove `$` from `price`, THEN cast the result to numeric. Keep `id`.",
        expectedSql: "SELECT id, CAST(REPLACE(price, '$', '') AS numeric) AS true_price FROM dirty_products;",
        hint: "CAST(REPLACE(...) AS numeric).",
        solution: "SELECT id, CAST(REPLACE(price, '$', '') AS numeric) AS true_price FROM dirty_products;"
      }
    ]
  },
  {
    id: "date-cleaning",
    title: "40. Date Cleaning",
    description: "Parse, extract, and standardize datetime timestamps.",
    tables: ["raw_orders"],
    content: "## Date Extraction\n\nTime series analysis demands grouping logs identically by month or year rather than milliseconds. We extract numeric units strictly using ANSI Standard date mechanisms.\n\n### Extracting Dedicated Time Limits\n```sql\nSELECT EXTRACT(YEAR FROM created_at) AS order_year FROM raw_orders;\n```\n\n### Grouping by Month\nYou can group completely based on the extracted values. This calculates exactly how many purchases were made in January vs February.\n```sql\nSELECT EXTRACT(MONTH FROM created_at) AS month, COUNT(*) \nFROM raw_orders \nGROUP BY EXTRACT(MONTH FROM created_at);\n```",
    defaultQuery: "SELECT EXTRACT(YEAR FROM created_at) FROM raw_orders;",
    examples: [
      {
        title: "Find event month",
        description: "Extract the month numeric value.",
        sql: "SELECT EXTRACT(MONTH FROM created_at) FROM raw_orders;"
      }
    ],
    exercises: [
      {
        id: "dates-1",
        title: "Order Year",
        description: "Extract the YEAR from `created_at` in `raw_orders` as `order_year` alongside `id`.",
        expectedSql: "SELECT id, EXTRACT(YEAR FROM created_at) AS order_year FROM raw_orders;",
        hint: "Use `EXTRACT(YEAR FROM col)`.",
        solution: "SELECT id, EXTRACT(YEAR FROM created_at) AS order_year FROM raw_orders;"
      },
      {
        id: "dates-2",
        title: "Monthly Aggregation",
        description: "Extract `MONTH` from `created_at`, output it with `COUNT(*)` from `raw_orders`, grouped by the month.",
        expectedSql: "SELECT EXTRACT(MONTH FROM created_at) AS month, COUNT(*) AS count FROM raw_orders GROUP BY EXTRACT(MONTH FROM created_at);",
        hint: "Group by the exact extraction statement.",
        solution: "SELECT EXTRACT(MONTH FROM created_at) AS month, COUNT(*) AS count FROM raw_orders GROUP BY EXTRACT(MONTH FROM created_at);"
      },
      {
        id: "dates-3",
        title: "Exclude Historic",
        description: "Select `id` and `created_at` from `raw_orders` where the extracted YEAR is > 2020.",
        expectedSql: "SELECT id, created_at FROM raw_orders WHERE EXTRACT(YEAR FROM created_at) > 2020;",
        hint: "Use EXTRACT in the WHERE clause.",
        solution: "SELECT id, created_at FROM raw_orders WHERE EXTRACT(YEAR FROM created_at) > 2020;"
      },
      {
        id: "dates-4",
        title: "Truncate to Pure Date",
        description: "Cast `created_at` simply as a `DATE` type in `raw_orders` to remove time precision. Select `id`, Date as `day`.",
        expectedSql: "SELECT id, CAST(created_at AS DATE) AS day FROM raw_orders;",
        hint: "CAST(... AS DATE).",
        solution: "SELECT id, CAST(created_at AS DATE) AS day FROM raw_orders;"
      }
    ]
  },
  {
    id: "conditional-logic",
    title: "41. Conditional Cleaning",
    description: "Write dynamic cleansing rules utilizing CASE WHEN to categorize unstructured info.",
    tables: ["dirty_products", "raw_orders", "raw_customers"],
    content: "## Logic Flow\n\n### The CASE WHEN Generator\n`CASE WHEN` statements are the SQL equivalent of if/else code blocks. They let you conditionally map or bin unstructured statuses mathematically.\n```sql\nSELECT \n  CASE \n    WHEN status = 'F' THEN 'Failed'\n    WHEN status = 'P' THEN 'Pending'\n    ELSE status \n  END AS translated_status\nFROM raw_orders;\n```\n\n### Bucketing Analytics\nInstead of dealing with 10,000 unique price tags, Machine Learning sets often prefer classification buckets ('Tier 1', 'Tier 2').\n```sql\nSELECT CASE WHEN price > 100 THEN 'Expensive' ELSE 'Cheap' END FROM dirty_products;\n```",
    defaultQuery: "SELECT status FROM raw_orders LIMIT 10;",
    examples: [
      {
        title: "Tiered Pricing",
        description: "Bucket numeric values.",
        sql: "SELECT CASE WHEN price > 100 THEN 'Expensive' ELSE 'Cheap' END FROM dirty_products;"
      }
    ],
    exercises: [
      {
        id: "cond-1",
        title: "Manual Fallback",
        description: "Use `CASE WHEN` to check if `phone` in `raw_customers` `IS NULL`. If so, return 'Missing', else return `phone`.",
        expectedSql: "SELECT id, CASE WHEN phone IS NULL THEN 'Missing' ELSE phone END AS safe_phone FROM raw_customers;",
        hint: "CASE WHEN x IS NULL THEN '...' ELSE '...' END.",
        solution: "SELECT id, CASE WHEN phone IS NULL THEN 'Missing' ELSE phone END AS safe_phone FROM raw_customers;"
      },
      {
        id: "cond-2",
        title: "Normalize Status",
        description: "In `raw_orders`, if `status` is 'ship' or 'shipped_out', return 'shipped'. Else return original status.",
        expectedSql: "SELECT id, CASE WHEN status IN ('ship', 'shipped_out') THEN 'shipped' ELSE status END AS updated_status FROM raw_orders;",
        hint: "Use IN within WHEN clause.",
        solution: "SELECT id, CASE WHEN status IN ('ship', 'shipped_out') THEN 'shipped' ELSE status END AS updated_status FROM raw_orders;"
      },
      {
        id: "cond-3",
        title: "Bucket Prices",
        description: "Categorize `price` in `dirty_products`. `> 100` is 'High', `< 10` is 'Low', else is 'Medium'. Return `id` and logic tier.",
        expectedSql: "SELECT id, CASE WHEN price > 100 THEN 'High' WHEN price < 10 THEN 'Low' ELSE 'Medium' END AS tier FROM dirty_products;",
        hint: "Chain WHEN statements.",
        solution: "SELECT id, CASE WHEN price > 100 THEN 'High' WHEN price < 10 THEN 'Low' ELSE 'Medium' END AS tier FROM dirty_products;"
      },
      {
        id: "cond-4",
        title: "Cap Extreme Values",
        description: "In `dirty_products`, if `price < 0`, replace it with `0`. Else keep `price`. Output `id` and `safe_price`.",
        expectedSql: "SELECT id, CASE WHEN price < 0 THEN 0 ELSE price END AS safe_price FROM dirty_products;",
        hint: "Compare price < 0.",
        solution: "SELECT id, CASE WHEN price < 0 THEN 0 ELSE price END AS safe_price FROM dirty_products;"
      }
    ]
  },
  {
    id: "handling-outliers",
    title: "42. Handling Outliers",
    description: "Detect and remove extreme anomalous deviations using fixed numeric thresholds.",
    tables: ["dirty_products"],
    content: "## Removing Extreme Spikes\n\nData corruption guarantees bad sensor reads or typo inputs. Huge negative integers or single-row spikes into the millions throw off aggregate data models (like `AVG`) heavily.\n\n### Static Filter Bounds\nOne strategy is to apply aggressive hardcaps immediately on all analytical searches.\n```sql\nSELECT * FROM dirty_products WHERE price BETWEEN 1 AND 5000;\n```\nThis prevents negative numbers and absurdly high million-dollar variables from heavily skewing models.\n\n### Filtering Before Aggregating\nNever average the raw uncleaned metric table; average ONLY rows satisfying the capped outlier bounds.",
    defaultQuery: "SELECT max(price) FROM dirty_products;",
    examples: [
      {
        title: "Bounded analytics",
        description: "Keep averages realistic.",
        sql: "SELECT AVG(price) FROM dirty_products WHERE price < 1000;"
      }
    ],
    exercises: [
      {
        id: "outliers-1",
        title: "Cap Value Search",
        description: "Keep records from `dirty_products` where `price` is at most 1000.",
        expectedSql: "SELECT * FROM dirty_products WHERE price <= 1000;",
        hint: "WHERE price <= 1000.",
        solution: "SELECT * FROM dirty_products WHERE price <= 1000;"
      },
      {
        id: "outliers-2",
        title: "Between Two Extremes",
        description: "Select `id`, `price` from `dirty_products` keeping ONLY rows between `1` and `500`.",
        expectedSql: "SELECT id, price FROM dirty_products WHERE price BETWEEN 1 AND 500;",
        hint: "Use BETWEEN x AND y.",
        solution: "SELECT id, price FROM dirty_products WHERE price BETWEEN 1 AND 500;"
      },
      {
        id: "outliers-3",
        title: "Count Detected Deviations",
        description: "Count how many rows in `dirty_products` cross `> 500`.",
        expectedSql: "SELECT COUNT(*) FROM dirty_products WHERE price > 500;",
        hint: "COUNT with a WHERE > 500 filter.",
        solution: "SELECT COUNT(*) FROM dirty_products WHERE price > 500;"
      },
      {
        id: "outliers-4",
        title: "Safe Average",
        description: "Calculate `AVG()` of `price` from `dirty_products`, EXCLUDING values > `1000`.",
        expectedSql: "SELECT AVG(price) AS accurate_avg FROM dirty_products WHERE price <= 1000;",
        hint: "Filter out values first to affect the AVG calculation softly.",
        solution: "SELECT AVG(price) AS accurate_avg FROM dirty_products WHERE price <= 1000;"
      }
    ]
  },
  {
    id: "data-cleaning-window-functions",
    title: "43. Window Deduplication",
    description: "Use analytical mapping like ROW_NUMBER to deduplicate while strictly managing order.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Advanced Deduplication\n\n`DISTINCT` eliminates identical duplicates, but what if user attributes overlap? E.g. A user changed their address, so you have two rows, but you ONLY want the MOST RECENT address.\n\n### The ROW_NUMBER() Engine\nPartitions the results scoped by uniquely identifying domain boundaries, ordering dynamically inside that boundary!\n```sql\nSELECT email, \n       ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at DESC) AS ranking\nFROM raw_customers;\n```\nBy nesting this into a CTE (Common Table Expression), you can just `SELECT * WHERE ranking = 1` to instantly drop all duplicates EXCEPT the absolute latest record for each email!",
    defaultQuery: "SELECT id, email, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at) FROM raw_customers;",
    examples: [
      {
        title: "Ranking events",
        description: "Find latest event number.",
        sql: "SELECT ROW_NUMBER() OVER(PARTITION BY id ORDER BY created_at DESC) FROM raw_orders;"
      }
    ],
    exercises: [
      {
        id: "window-1",
        title: "Basic Generation",
        description: "Select `email`, `created_at` from `raw_customers`. Attach `ROW_NUMBER()` ordered by `created_at` DESC as `rn`.",
        expectedSql: "SELECT email, created_at, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at DESC) AS rn FROM raw_customers;",
        hint: "Syntax is `OVER(PARTITION BY ... ORDER BY ...)`.",
        solution: "SELECT email, created_at, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at DESC) AS rn FROM raw_customers;"
      },
      {
        id: "window-2",
        title: "Find First Occurrence",
        description: "Apply `ROW_NUMBER()` partitioning `email` ordered by `created_at` ASCENDING to tag the earliest record 1 in `raw_customers`.",
        expectedSql: "SELECT email, created_at, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at ASC) AS rn FROM raw_customers;",
        hint: "By ordering ASC, the first created retains row index 1.",
        solution: "SELECT email, created_at, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at ASC) AS rn FROM raw_customers;"
      },
      {
        id: "window-3",
        title: "Limit to First via CTE",
        description: "Assume a CTE `RankedRecs` exists with `id`, `email`, and `rn` (row number). `SELECT id, email FROM RankedRecs WHERE rn = 1;`",
        expectedSql: "WITH RankedRecs AS (SELECT id, email, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at DESC) as rn FROM raw_customers) SELECT id, email FROM RankedRecs WHERE rn = 1;",
        hint: "Write the CTE `WITH x AS (...)` preceding the SELECT.",
        solution: "WITH RankedRecs AS (SELECT id, email, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at DESC) as rn FROM raw_customers) SELECT id, email FROM RankedRecs WHERE rn = 1;"
      },
      {
        id: "window-4",
        title: "Most recent order",
        description: "Use `ROW_NUMBER` over `raw_orders` partitioned by `customer_id` ordered `created_at` DESC to yield `rn`. Select only where `rn=1` inside a CTE named Target.",
        expectedSql: "WITH Target AS (SELECT id, customer_id, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS rn FROM raw_orders) SELECT * FROM Target WHERE rn = 1;",
        hint: "Follow exact CTE syntax isolating rn=1.",
        solution: "WITH Target AS (SELECT id, customer_id, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS rn FROM raw_orders) SELECT * FROM Target WHERE rn = 1;"
      }
    ]
  },
  {
    id: "joining-for-correction",
    title: "44. Correction Joins",
    description: "Fill missing data gaps by doing lookups against central source-of-truth reference tables.",
    tables: ["raw_orders", "raw_customers"],
    content: "## Relational Correction\n\nSometimes single tables don't have enough logic. You fill missing gaps dynamically by performing lookups against trusted central dictionary tables through `JOIN`s.\n\n### Backfilling Nulls Confidently\nAssume raw_orders lacked a fallback email for the user. We JOIN them together, but resolve priority natively using `COALESCE(o.email, c.email)`.\n\n### Anti-Joins for Garbage Collection\nFinding \"Orphaned Records\": Find orders pointing to fake or deleted customers.\n```sql\nSELECT o.id \nFROM raw_orders o \nLEFT JOIN raw_customers c ON o.customer_id = c.id \nWHERE c.id IS NULL;\n```",
    defaultQuery: "SELECT o.* FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;",
    examples: [
      {
        title: "Find Ghost Data",
        description: "Identify bad foreign keys mapping nowhere.",
        sql: "SELECT o.id FROM raw_orders o LEFT JOIN raw_customers c ON o.customer_id = c.id WHERE c.id IS NULL;"
      }
    ],
    exercises: [
      {
        id: "joins-1",
        title: "Anti-Join Mismatches",
        description: "Select `id` from `raw_orders` where the `customer_id` doesn't exist in `raw_customers`. (Use LEFT JOIN WHERE c.id IS NULL).",
        expectedSql: "SELECT o.id FROM raw_orders o LEFT JOIN raw_customers c ON o.customer_id = c.id WHERE c.id IS NULL;",
        hint: "Link ON o.customer_id = c.id and test for IS NULL.",
        solution: "SELECT o.id FROM raw_orders o LEFT JOIN raw_customers c ON o.customer_id = c.id WHERE c.id IS NULL;"
      },
      {
        id: "joins-2",
        title: "Enforce Validity",
        description: "Select `id`, `price` from `raw_orders` enforcing it matches existing `raw_customers` using INNER JOIN.",
        expectedSql: "SELECT o.id, o.amount FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;",
        hint: "Simply `JOIN` automatically filters orphaned keys.",
        solution: "SELECT o.id, o.amount FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;"
      },
      {
        id: "joins-3",
        title: "Pull Trusted Info",
        description: "Join `raw_orders` to `raw_customers`. Pull `o.id` and the trusted `c.email` from the raw_customers table.",
        expectedSql: "SELECT o.id, c.email FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;",
        hint: "Select specific aliases `o.id, c.email`.",
        solution: "SELECT o.id, c.email FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;"
      },
      {
        id: "joins-4",
        title: "Lookup Join",
        description: "Select `o.id`. Use COALESCE on `o.email` but rely on `c.email` if missing. JOIN `raw_orders o` to `raw_customers c`.",
        expectedSql: "SELECT o.id, COALESCE(o.email, c.email) AS valid_email FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;",
        hint: "Pass both aliases to COALESCE.",
        solution: "SELECT o.id, COALESCE(o.email, c.email) AS valid_email FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;"
      }
    ]
  },
  {
    id: "validation-queries",
    title: "45. Validation Queries",
    description: "Write sanity-check aggregations auditing dataset health flags across massive populations.",
    tables: ["raw_customers", "dirty_products"],
    content: "## Assessing Data Health\n\nData engineers write pipelines that execute daily. Instead of checking tables manually, they add validation queries summing up the total volume of \"failures\" as automated testing hooks.\n\n### Summarizing Deficiencies using CASE\nWe map failures to integer `1` and passes to integer `0`, then `SUM` all of them up mathematically.\n```sql\nSELECT \n  SUM(CASE WHEN phone IS NULL OR email IS NULL THEN 1 ELSE 0 END) AS defective_records \nFROM raw_customers;\n```\nIf this query returns > 100, the pipeline alarms the engineering team!",
    defaultQuery: "SELECT COUNT(*) FROM raw_customers WHERE email IS NULL;",
    examples: [
      {
        title: "Null Count",
        description: "Verify mapping coverage.",
        sql: "SELECT COUNT(*) FROM raw_customers WHERE name IS NULL;"
      }
    ],
    exercises: [
      {
        id: "val-1",
        title: "Count Hard Nulls",
        description: "Return `COUNT(*)` as `missing_prices` from `dirty_products` where `price` IS NULL.",
        expectedSql: "SELECT COUNT(*) AS missing_prices FROM dirty_products WHERE price IS NULL;",
        hint: "Simple WHERE price IS NULL.",
        solution: "SELECT COUNT(*) AS missing_prices FROM dirty_products WHERE price IS NULL;"
      },
      {
        id: "val-2",
        title: "Auditing Specific Fields",
        description: "SUM up instances in `raw_customers` matching `phone IS NULL OR email IS NULL` via CASE WHEN returning 1 or 0.",
        expectedSql: "SELECT SUM(CASE WHEN phone IS NULL OR email IS NULL THEN 1 ELSE 0 END) AS defective FROM raw_customers;",
        hint: "Use SUM and CASE WHEN resolving boolean logic.",
        solution: "SELECT SUM(CASE WHEN phone IS NULL OR email IS NULL THEN 1 ELSE 0 END) AS defective FROM raw_customers;"
      },
      {
        id: "val-3",
        title: "Distribution Review",
        description: "Group by `status` in `raw_orders` taking `COUNT(*)` to identify erroneous values.",
        expectedSql: "SELECT status, COUNT(*) FROM raw_orders GROUP BY status;",
        hint: "Group by target field.",
        solution: "SELECT status, COUNT(*) FROM raw_orders GROUP BY status;"
      },
      {
        id: "val-4",
        title: "Multi-Flag Status",
        description: "Return `COUNT(*)` and `SUM(CASE WHEN price < 0 THEN 1 ELSE 0 END)` from `dirty_products` simultaneously.",
        expectedSql: "SELECT COUNT(*), SUM(CASE WHEN price < 0 THEN 1 ELSE 0 END) FROM dirty_products;",
        hint: "Separate query items with a comma.",
        solution: "SELECT COUNT(*), SUM(CASE WHEN price < 0 THEN 1 ELSE 0 END) FROM dirty_products;"
      }
    ]
  },
  {
    id: "creating-tables",
    title: "46. Creating Clean Tables",
    description: "Solidify final cleaned extractions to structural reporting tiers using CTAS.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Finalizing Outputs\n\nOnce calculations, mappings, strings, and types are perfected via standard `SELECT` views, we don't want to re-run the massive query forever. We write the results natively back into the server as completely hardened static tables.\n\n### The CTAS Method\n`CREATE TABLE AS SELECT` establishes exact schemas and imports data instantly matching whatever logic was nested within.\n```sql\nCREATE TABLE clean_users AS \n  SELECT id, LOWER(email) AS email \n  FROM raw_customers \n  WHERE email IS NOT NULL;\n```\nAll data within `clean_users` is now perfectly clean and ready to query by data scientists!",
    defaultQuery: "CREATE TABLE staging AS SELECT id FROM raw_customers;",
    examples: [
      {
        title: "CTAS materialization",
        description: "Build table exactly replicating inner select output schema.",
        sql: "CREATE TABLE valid_goods AS SELECT * FROM dirty_products WHERE price > 0;"
      }
    ],
    exercises: [
      {
        id: "ct-1",
        title: "Materialize CTAS",
        description: "Execute `CREATE TABLE safe_emails AS` and select `id`, `LOWER(email)` from `raw_customers`.",
        expectedSql: "CREATE TABLE safe_emails AS SELECT id, LOWER(email) FROM raw_customers;",
        hint: "Wrap SELECT code.",
        solution: "CREATE TABLE safe_emails AS SELECT id, LOWER(email) FROM raw_customers;"
      },
      {
        id: "ct-2",
        title: "Store Trimmed Items",
        description: "Create table `cleaned_items` passing `id`, `TRIM(name)` from `dirty_products`.",
        expectedSql: "CREATE TABLE cleaned_items AS SELECT id, TRIM(name) FROM dirty_products;",
        hint: "Standard CTAS.",
        solution: "CREATE TABLE cleaned_items AS SELECT id, TRIM(name) FROM dirty_products;"
      },
      {
        id: "ct-3",
        title: "Insert Select",
        description: "Write `INSERT INTO clean_orders SELECT * FROM raw_orders WHERE amount IS NOT NULL;`",
        expectedSql: "INSERT INTO clean_orders SELECT * FROM raw_orders WHERE amount IS NOT NULL;",
        hint: "Directly transcribe request.",
        solution: "INSERT INTO clean_orders SELECT * FROM raw_orders WHERE amount IS NOT NULL;"
      },
      {
        id: "ct-4",
        title: "All-In-One Schema Generation",
        description: "Write `CREATE TABLE final_prod AS` selecting `id`, `REPLACE(price,'$','')` aliased `price` from `dirty_products`.",
        expectedSql: "CREATE TABLE final_prod AS SELECT id, REPLACE(price,'$','') as price FROM dirty_products;",
        hint: "Use CREATE TABLE x AS Select...",
        solution: "CREATE TABLE final_prod AS SELECT id, REPLACE(price,'$','') as price FROM dirty_products;"
      }
    ]
  },
  {
    id: "incremental-cleaning",
    title: "47. Incremental Cleaning",
    description: "Design batch append pipelines applying dynamic limits.",
    tables: ["raw_orders"],
    content: "## Pipeline Engineering\n\nOver time, raw tables accumulate billions of rows. Doing a full `CREATE TABLE AS` over formatting the entire dataset every single hour scales dreadfully in cloud cost. You use Incremental appends instead.\n\n### Filter against Historical Maximums\nDetect the newest record currently in production directly inside a subquery, and only ingest raw items that are newer than that line.\n```sql\nINSERT INTO clean_store \nSELECT * FROM raw \nWHERE created_at > (SELECT MAX(created_at) FROM clean_store);\n```\nThis scales O(1) efficiently for daily chron-job batches.",
    defaultQuery: "SELECT max(created_at) FROM raw_orders;",
    examples: [
      {
        title: "Fetch Date Maximum",
        description: "A common subquery approach.",
        sql: "SELECT * FROM raw_orders WHERE created_at > (SELECT max(created_at) FROM raw_orders);"
      }
    ],
    exercises: [
      {
        id: "inc-1",
        title: "Extract Latest Date",
        description: "Select `MAX(created_at)` from `raw_orders`.",
        expectedSql: "SELECT MAX(created_at) FROM raw_orders;",
        hint: "Use MAX().",
        solution: "SELECT MAX(created_at) FROM raw_orders;"
      },
      {
        id: "inc-2",
        title: "Filter by Subquery Limit",
        description: "Select `id` from `raw_orders` where `created_at > (SELECT '2025-01-01');`",
        expectedSql: "SELECT id FROM raw_orders WHERE created_at > (SELECT '2025-01-01');",
        hint: "Use `>` targeting subquery.",
        solution: "SELECT id FROM raw_orders WHERE created_at > (SELECT '2025-01-01');"
      },
      {
        id: "inc-3",
        title: "Subquery Execution",
        description: "Select `*` from `raw_orders` where `created_at` > `(SELECT max(created_at) FROM valid_orders)`.",
        expectedSql: "SELECT * FROM raw_orders WHERE created_at > (SELECT max(created_at) FROM valid_orders);",
        hint: "Evaluate against nested MAX() subquery target.",
        solution: "SELECT * FROM raw_orders WHERE created_at > (SELECT max(created_at) FROM valid_orders);"
      },
      {
        id: "inc-4",
        title: "Safe Upsert Filtering",
        description: "Select `id`, `LOWER(email)` from `raw_customers` ONLY where `id NOT IN (SELECT id FROM finished_customers)`.",
        expectedSql: "SELECT id, LOWER(email) FROM raw_customers WHERE id NOT IN (SELECT id FROM finished_customers);",
        hint: "Use NOT IN alongside subquery.",
        solution: "SELECT id, LOWER(email) FROM raw_customers WHERE id NOT IN (SELECT id FROM finished_customers);"
      }
    ]
  },
  {
    id: "pipeline-operations",
    title: "48. Data Cleaning Pipelines",
    description: "Multi-stage formatting isolating raw landing ingestion from downstream operational layers.",
    tables: ["raw_customers", "raw_orders"],
    content: "## Structural Pipelining\n\nModern warehouses (Snowflake/BigQuery) establish multiple tiered zones: `RAW` (pure dump), `STAGING` (typed and formatted), and `PRODUCTION` (joined and validated).\n\n### Staging logic natively via VIEW\nBy creating a completely dynamic `VIEW`, every time an analyst runs a query against the view, it instantly executes the cleaning format layer underneath dynamically before answering the result.\n```sql\nCREATE VIEW staging_customers AS \n  SELECT id, TRIM(name) AS clean_name \n  FROM raw_customers;\n```\nIf raw_customers grows, staging_customers automatically reflects the identically formatted output indefinitely.",
    defaultQuery: "SELECT count(*) FROM staging_data;",
    examples: [
      {
        title: "Stage logic view",
        description: "Enforce standard formatting before analysis tables.",
        sql: "CREATE VIEW staging AS SELECT id, TRIM(name) FROM raw_customers;"
      }
    ],
    exercises: [
      {
        id: "pipe-1",
        title: "Create Initial Landing View",
        description: "Use `CREATE VIEW raw_st_customers AS` and `SELECT id, name FROM raw_customers;`.",
        expectedSql: "CREATE VIEW raw_st_customers AS SELECT id, name FROM raw_customers;",
        hint: "Use `CREATE VIEW`.",
        solution: "CREATE VIEW raw_st_customers AS SELECT id, name FROM raw_customers;"
      },
      {
        id: "pipe-2",
        title: "Stage Clean Data",
        description: "Select from `raw_st_customers`. Apply `TRIM(name)` mapping results directly via `CREATE VIEW intermediate_customers AS`.",
        expectedSql: "CREATE VIEW intermediate_customers AS SELECT id, TRIM(name) FROM raw_st_customers;",
        hint: "Write chained view implementation.",
        solution: "CREATE VIEW intermediate_customers AS SELECT id, TRIM(name) FROM raw_st_customers;"
      },
      {
        id: "pipe-3",
        title: "Consolidated Execution",
        description: "Select `*` from a CTE `RawItems` where inner select does `SELECT id FROM dirty_products WHERE price > 0;`.",
        expectedSql: "WITH RawItems AS (SELECT id FROM dirty_products WHERE price > 0) SELECT * FROM RawItems;",
        hint: "Establish pipeline tier locally.",
        solution: "WITH RawItems AS (SELECT id FROM dirty_products WHERE price > 0) SELECT * FROM RawItems;"
      },
      {
        id: "pipe-4",
        title: "Join Pipeline Phases",
        description: "Select `c.id`, `o.amount` by joining `intermediate_customers c` and `raw_orders o` on `c.id = o.customer_id`.",
        expectedSql: "SELECT c.id, o.amount FROM intermediate_customers c JOIN raw_orders o ON c.id = o.customer_id;",
        hint: "Execute join atop created structures.",
        solution: "SELECT c.id, o.amount FROM intermediate_customers c JOIN raw_orders o ON c.id = o.customer_id;"
      }
    ]
  },
  {
    id: "capstone-cleaning",
    title: "49. Full Data Cleaning Project",
    description: "Detect, transform, and finalize messy SAAS e-commerce files handling NULLs, bounds, dupes, and trims entirely dynamically.",
    tables: ["raw_customers", "raw_orders", "dirty_products"],
    content: "## Capstone: The E-Commerce Database Refresh\n\nIn the real world, tables present multiple data anomalies at once. You will write comprehensive monolithic SQL statements that cast strings, handle null boundaries, map outlier fallbacks, deduplicate records via GROUP BY, and execute strict condition sets all at the exact same execution step within standard CTAS tables.\n\n### Step 1: Discover. Step 2: Extract. Step 3: Mutate. Step 4: Validate. Step 5: Save.\nReview the Capstone instructions in your interactive exercises below. Consolidate your knowledge over the entirety of this dynamic curriculum layout. It's time to act like a real production Data Engineer.",
    defaultQuery: "SELECT * FROM raw_customers; -- Begin your investigation.",
    examples: [
      {
        title: "Combine multiple functions",
        description: "Real-world logic.",
        sql: "SELECT id, CASE WHEN price IS NULL THEN 0 ELSE CAST(price AS numeric) END FROM dirty_products;"
      }
    ],
    exercises: [
      {
        id: "capstone-1",
        title: "Step 1: Raw Audit",
        description: "Write query to count total `raw_customers` lacking phone info OR email info using CASE WHEN sum.",
        expectedSql: "SELECT SUM(CASE WHEN phone IS NULL OR email IS NULL THEN 1 ELSE 0 END) FROM raw_customers;",
        hint: "Review module 13.",
        solution: "SELECT SUM(CASE WHEN phone IS NULL OR email IS NULL THEN 1 ELSE 0 END) FROM raw_customers;"
      },
      {
        id: "capstone-2",
        title: "Step 2: Universal Standardizer",
        description: "Retrieve `id`. Standardize `email` utilizing `LOWER(TRIM(email))`. Deduplicate `raw_customers` selecting `MAX(created_at)` grouped by `email`.",
        expectedSql: "SELECT LOWER(TRIM(email)) AS email, MAX(created_at) FROM raw_customers GROUP BY LOWER(TRIM(email));",
        hint: "Apply transformations directly within your GROUP BY logic.",
        solution: "SELECT LOWER(TRIM(email)) AS email, MAX(created_at) FROM raw_customers GROUP BY LOWER(TRIM(email));"
      },
      {
        id: "capstone-3",
        title: "Step 3: Missing Lookups",
        description: "Select `o.id` fixing `o.status` with `COALESCE(status, 'unknown')`. Perform an INNER JOIN ensuring valid records exclusively cross `raw_customers c` via `o.customer_id = c.id`.",
        expectedSql: "SELECT o.id, COALESCE(o.status, 'unknown') FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;",
        hint: "Join and map COALESCE logic heavily.",
        solution: "SELECT o.id, COALESCE(o.status, 'unknown') FROM raw_orders o JOIN raw_customers c ON o.customer_id = c.id;"
      },
      {
        id: "capstone-4",
        title: "Step 4: Extreme Filtering",
        description: "Build robust table view. `SELECT id, CAST(REPLACE(price,'$','') as numeric) as price FROM dirty_products WHERE name IS NOT NULL;`",
        expectedSql: "SELECT id, CAST(REPLACE(price,'$','') as numeric) as price FROM dirty_products WHERE name IS NOT NULL;",
        hint: "Parse, convert, evaluate condition inside one query.",
        solution: "SELECT id, CAST(REPLACE(price,'$','') as numeric) as price FROM dirty_products WHERE name IS NOT NULL;"
      },
      {
        id: "capstone-5",
        title: "Step 5: CTAS Finalization",
        description: "Write `CREATE TABLE final_saas_products AS` wrapping a query stripping negative numbers: `SELECT id, name FROM dirty_products WHERE price > 0;`",
        expectedSql: "CREATE TABLE final_saas_products AS SELECT id, name FROM dirty_products WHERE price > 0;",
        hint: "Finish the workflow.",
        solution: "CREATE TABLE final_saas_products AS SELECT id, name FROM dirty_products WHERE price > 0;"
      }
    ]
  }
];
