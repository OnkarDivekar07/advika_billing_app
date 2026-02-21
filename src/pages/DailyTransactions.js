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
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No transactions found for today
                  </td>
                </tr>
              ) : (
                transactions.map((txn, index) => (
                  <tr key={txn.id || index}>
                    <td>{txn.id}</td>
                    <td>
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
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