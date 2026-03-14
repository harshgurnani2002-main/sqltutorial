"use client";

/**
 * Animated JOIN visualization showing how rows from two tables connect.
 * Supports toggling between INNER, LEFT, RIGHT, FULL join types.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

const customers = [
  { customer_id: 1, name: 'Tech Corp' },
  { customer_id: 2, name: 'Global Importers' },
  { customer_id: 3, name: 'Local Shop' },
  { customer_id: 4, name: 'Online Store' },
  { customer_id: 5, name: 'Euro Traders' },
];

const orders = [
  { order_id: 101, customer_id: 1, amount: 2400 },
  { order_id: 102, customer_id: 2, amount: 425 },
  { order_id: 103, customer_id: 1, amount: 350 },
  { order_id: 104, customer_id: 3, amount: 450 },
  { order_id: 105, customer_id: 4, amount: 1200 },
];

function getJoinResult(type: JoinType) {
  const customerIds = new Set(customers.map(c => c.customer_id));
  const orderCustomerIds = new Set(orders.map(o => o.customer_id));

  const matchedCustomers = new Set<number>();
  const matchedOrders = new Set<number>();
  const result: { customer: string | null; order_id: number | null; amount: number | null; highlighted: boolean }[] = [];

  // Matched rows
  for (const c of customers) {
    const cOrders = orders.filter(o => o.customer_id === c.customer_id);
    if (cOrders.length > 0) {
      matchedCustomers.add(c.customer_id);
      for (const o of cOrders) {
        matchedOrders.add(o.order_id);
        result.push({ customer: c.name, order_id: o.order_id, amount: o.amount, highlighted: true });
      }
    }
  }

  // LEFT / FULL: unmatched customers
  if (type === 'LEFT' || type === 'FULL') {
    for (const c of customers) {
      if (!matchedCustomers.has(c.customer_id)) {
        result.push({ customer: c.name, order_id: null, amount: null, highlighted: false });
      }
    }
  }

  // RIGHT / FULL: unmatched orders (all our sample orders have matching customers, but keep pattern)
  if (type === 'RIGHT' || type === 'FULL') {
    for (const o of orders) {
      if (!matchedOrders.has(o.order_id)) {
        result.push({ customer: null, order_id: o.order_id, amount: o.amount, highlighted: false });
      }
    }
  }

  return { result, matchedCustomers, matchedOrders };
}

export default function JoinVisualization() {
  const [joinType, setJoinType] = useState<JoinType>('INNER');
  const { result, matchedCustomers, matchedOrders } = getJoinResult(joinType);

  const types: JoinType[] = ['INNER', 'LEFT', 'RIGHT', 'FULL'];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden my-4">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">JOIN Visualization</p>
        <div className="flex gap-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setJoinType(t)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                joinType === t
                  ? 'bg-brand-primary text-brand-bg'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Source tables side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Customers table */}
          <div className="rounded-lg border border-brand-primary/30 overflow-hidden">
            <div className="bg-brand-primary/10 px-3 py-1.5 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
              Customers
            </div>
            <div className="divide-y divide-slate-800">
              {customers.map((c) => {
                const matched = matchedCustomers.has(c.customer_id);
                const show = joinType === 'INNER'
                  ? matched
                  : joinType === 'RIGHT'
                    ? matched
                    : true; // LEFT and FULL show all
                return (
                  <motion.div
                    key={c.customer_id}
                    animate={{
                      opacity: show ? 1 : (joinType === 'RIGHT' || joinType === 'INNER' ? 0.25 : 1),
                      backgroundColor: matched ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                    className="px-3 py-1.5 flex items-center gap-2 text-[11px]"
                  >
                    <span className="font-mono text-slate-500 w-4">{c.customer_id}</span>
                    <span className={matched ? 'text-brand-primary font-medium' : 'text-slate-400'}>{c.name}</span>
                    {matched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Orders table */}
          <div className="rounded-lg border border-brand-secondary/30 overflow-hidden">
            <div className="bg-brand-secondary/10 px-3 py-1.5 text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
              Orders
            </div>
            <div className="divide-y divide-slate-800">
              {orders.map((o) => {
                const matched = matchedOrders.has(o.order_id);
                return (
                  <motion.div
                    key={o.order_id}
                    animate={{
                      opacity: 1,
                      backgroundColor: matched ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                    className="px-3 py-1.5 flex items-center gap-2 text-[11px]"
                  >
                    <span className="font-mono text-slate-500 w-6">{o.order_id}</span>
                    <span className="font-mono text-slate-500 w-4">→{o.customer_id}</span>
                    <span className={matched ? 'text-brand-secondary font-medium' : 'text-slate-400'}>
                      ${o.amount}
                    </span>
                    {matched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-secondary"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-3">
          <svg width="24" height="20" className="text-slate-600">
            <path d="M12 2 L12 14 M7 10 L12 16 L17 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Result table */}
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-800/60 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>{joinType} JOIN Result</span>
            <span className="text-slate-400 font-mono">{result.length} rows</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-mono text-slate-400 bg-slate-800/30">
                  <th className="px-3 py-1.5 border-b border-slate-800">customer</th>
                  <th className="px-3 py-1.5 border-b border-slate-800">order_id</th>
                  <th className="px-3 py-1.5 border-b border-slate-800">amount</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {result.map((r, i) => (
                    <motion.tr
                      key={`${r.customer}-${r.order_id}-${i}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-800/30"
                    >
                      <td className="px-3 py-1.5 text-[11px] border-b border-slate-800/50">
                        {r.customer ? (
                          <span className={r.highlighted ? 'text-brand-primary' : 'text-slate-400'}>{r.customer}</span>
                        ) : (
                          <span className="text-slate-600 italic">NULL</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-[11px] font-mono border-b border-slate-800/50">
                        {r.order_id ? (
                          <span className={r.highlighted ? 'text-brand-secondary' : 'text-slate-400'}>{r.order_id}</span>
                        ) : (
                          <span className="text-slate-600 italic">NULL</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-[11px] font-mono border-b border-slate-800/50 text-slate-300">
                        {r.amount !== null ? `$${r.amount}` : <span className="text-slate-600 italic">NULL</span>}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex gap-4 text-[10px] text-slate-500">
          <span><span className="inline-block w-2 h-2 rounded-full bg-brand-primary mr-1" />Matched customers</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-brand-secondary mr-1" />Matched orders</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-slate-600 mr-1" />Unmatched (NULL)</span>
        </div>
      </div>
    </div>
  );
}
