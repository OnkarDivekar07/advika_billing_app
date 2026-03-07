import React, { useEffect, useState } from "react";
import API from "../api";
import "./style.css";

function DailyTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyTransactions();
  }, []);

  const fetchDailyTransactions = async () => {
    try {
      const res = await API.get("/transactions/dailyalltransaction");
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching daily transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const rollbackTransaction = async (id) => {
    const confirmRollback = window.confirm(
      "Are you sure you want to rollback this transaction?"
    );

    if (!confirmRollback) return;

    try {
      await API.post(`/transactions/rollback/${id}`);

      alert("Transaction rolled back successfully");

      fetchDailyTransactions(); // refresh table
    } catch (error) {
      console.error("Rollback error:", error);
      alert("Rollback failed");
    }
  };

  return (
    <div className="billing-container">
      <h1 className="page-title">Daily Transactions</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading transactions...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Total Amount</th>
                <th>Profit</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No transactions found for today
                  </td>
                </tr>
              ) : (
                transactions.map((txn, index) => (
                  <tr key={txn.id || index}>
                    <td>{txn.id}</td>

                    <td>{new Date(txn.date).toLocaleDateString()}</td>

                    <td>{txn.itemsPurchased}</td>

                    <td>{txn.quantity}</td>

                    <td>₹{Number(txn.totalAmount).toFixed(2)}</td>

                    <td
                      style={{
                        color: txn.profit >= 0 ? "green" : "red",
                        fontWeight: "600",
                      }}
                    >
                      ₹{Number(txn.profit).toFixed(2)}
                    </td>

                    <td>
                      {txn.isReversed ? (
                        <span style={{ color: "gray", fontWeight: "600" }}>
                          Reversed
                        </span>
                      ) : (
                        <button
                          onClick={() => rollbackTransaction(txn.id)}
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            padding: "6px 10px",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                        >
                          Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DailyTransaction;