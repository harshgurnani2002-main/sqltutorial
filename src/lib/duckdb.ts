import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;
let initPromise: Promise<duckdb.AsyncDuckDB> | null = null;
let dataSeeded = false;

export type InitProgress = {
  stage: string;
  percent: number;
};

export async function getDuckDB(
  onProgress?: (p: InitProgress) => void
): Promise<duckdb.AsyncDuckDB> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      onProgress?.({ stage: 'Selecting WASM bundle…', percent: 10 });

      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

      onProgress?.({ stage: 'Creating worker…', percent: 30 });

      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], {
          type: 'text/javascript',
        })
      );
      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      const newDb = new duckdb.AsyncDuckDB(logger, worker);

      onProgress?.({ stage: 'Instantiating engine…', percent: 50 });

      await newDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      onProgress?.({ stage: 'Engine ready', percent: 80 });

      db = newDb;
      return db;
    } catch (err) {
      initPromise = null;   // Allow retry
      throw err;
    }
  })();

  return initPromise;
}

/** Get (or create) a persistent connection for the session. */
async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  if (conn) return conn;
  const database = await getDuckDB();
  conn = await database.connect();
  return conn;
}

export async function executeQuery(
  query: string
): Promise<Record<string, unknown>[]> {
  const c = await getConnection();
  const result = await c.query(query);
  return result.toArray().map((row: any) => row.toJSON());
}

export async function initSampleData(
  onProgress?: (p: InitProgress) => void
): Promise<void> {
  if (dataSeeded) return;

  onProgress?.({ stage: 'Creating tables…', percent: 85 });
  const c = await getConnection();

  // ── employees ──────────────────────────────────────────
  await c.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id          INTEGER PRIMARY KEY,
      name        VARCHAR NOT NULL,
      department  VARCHAR NOT NULL,
      salary      INTEGER NOT NULL,
      manager_id  INTEGER,
      hire_date   DATE NOT NULL
    );
  `);
  await c.query(`
    INSERT INTO employees VALUES
      (1,  'Alice Johnson',   'Engineering', 95000,  NULL, '2019-03-15'),
      (2,  'Bob Smith',       'Engineering', 88000,  1,    '2020-07-01'),
      (3,  'Charlie Lee',     'Sales',       62000,  NULL, '2018-11-20'),
      (4,  'Diana Chen',      'Marketing',   71000,  NULL, '2021-01-10'),
      (5,  'Evan Wright',     'Sales',       58000,  3,    '2022-05-22'),
      (6,  'Fiona Garcia',    'Engineering', 102000, 1,    '2017-09-05'),
      (7,  'George Kim',      'Marketing',   67000,  4,    '2023-02-14'),
      (8,  'Hannah Patel',    'Engineering', 79000,  1,    '2021-08-30'),
      (9,  'Ian Brown',       'Sales',       54000,  3,    '2023-06-01'),
      (10, 'Julia Martinez',  'HR',          73000,  NULL, '2020-04-18');
  `);

  // ── customers ──────────────────────────────────────────
  await c.query(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY,
      name        VARCHAR NOT NULL,
      email       VARCHAR,
      country     VARCHAR NOT NULL,
      created_at  DATE NOT NULL
    );
  `);
  await c.query(`
    INSERT INTO customers VALUES
      (1, 'Tech Corp',        'info@techcorp.com',   'USA',       '2020-01-10'),
      (2, 'Global Importers', 'buy@globalimport.co', 'UK',        '2019-06-15'),
      (3, 'Local Shop',       'hello@localshop.ca',  'Canada',    '2021-03-22'),
      (4, 'Online Store',     'sales@onlinestore.au','Australia', '2020-11-05'),
      (5, 'Euro Traders',     NULL,                  'Germany',   '2022-07-19');
  `);

  // ── products ───────────────────────────────────────────
  await c.query(`
    CREATE TABLE IF NOT EXISTS products (
      product_id  INTEGER PRIMARY KEY,
      name        VARCHAR NOT NULL,
      category    VARCHAR NOT NULL,
      price       DECIMAL(10,2) NOT NULL,
      stock       INTEGER NOT NULL
    );
  `);
  await c.query(`
    INSERT INTO products VALUES
      (1, 'Laptop',    'Electronics', 1200.00, 50),
      (2, 'Monitor',   'Electronics', 350.00,  120),
      (3, 'Keyboard',  'Accessories', 85.00,   200),
      (4, 'Mouse',     'Accessories', 45.00,   300),
      (5, 'Headset',   'Accessories', 120.00,  90),
      (6, 'Webcam',    'Electronics', 75.00,   160),
      (7, 'Desk Lamp', 'Office',      55.00,   250),
      (8, 'Chair',     'Office',      450.00,  40);
  `);

  // ── orders ─────────────────────────────────────────────
  await c.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id    INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      quantity    INTEGER NOT NULL,
      amount      DECIMAL(10,2) NOT NULL,
      order_date  DATE NOT NULL
    );
  `);
  await c.query(`
    INSERT INTO orders VALUES
      (101, 1, 1, 2, 2400.00, '2023-01-15'),
      (102, 2, 3, 5, 425.00,  '2023-01-16'),
      (103, 1, 2, 1, 350.00,  '2023-02-10'),
      (104, 3, 4, 10,450.00,  '2023-02-14'),
      (105, 4, 1, 1, 1200.00, '2023-03-05'),
      (106, 2, 5, 3, 360.00,  '2023-03-12'),
      (107, 5, 6, 2, 150.00,  '2023-04-01'),
      (108, 1, 7, 4, 220.00,  '2023-04-18'),
      (109, 3, 8, 1, 450.00,  '2023-05-02'),
      (110, 4, 3, 8, 680.00,  '2023-05-20');
  `);

  onProgress?.({ stage: 'Data loaded ✓', percent: 100 });
  dataSeeded = true;
}
