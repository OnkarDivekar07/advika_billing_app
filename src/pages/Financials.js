import { useEffect, useState } from "react";
import API from "../api";
import "./financials.css";

export default function Financials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const res = await API.get("/finance-summary");
      setData(res.data);
    } catch (err) {
      alert("Finance data load failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading finance...</p>;

  return (
    <div className="finance-page">
      <h1 className="finance-title">Financials</h1>

      <div className="finance-grid">

        <div className="finance-card cash">
          <p className="label">Cash Transactions</p>
          <h2>₹{data?.cashTotal || 0}</h2>
        </div>

        <div className="finance-card online">
          <p className="label">Online Transactions</p>
          <h2>₹{data?.onlineTotal || 0}</h2>
        </div>

      </div>
    </div>
  );
}