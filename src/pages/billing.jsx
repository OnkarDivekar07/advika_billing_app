import React, { useState, useEffect } from "react";
import API from "../api";
import "./style.css";

function Billing() {
  const [items, setItems] = useState([
    { item_name: "", quantity: 1, price: 0, total: 0 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [totalAmount, setTotalAmount] = useState(0);

  const [metrics, setMetrics] = useState({
    dailyProfit: 0,
    dailySales: 0,
    monthlyProfit: 0,
    monthlySales: 0,
  });

  const [products, setProducts] = useState([]);

  // ================= CALCULATE TOTAL =================
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setTotalAmount(total);
  }, [items]);

  // ================= FETCH DATA =================
  useEffect(() => {
    API.get("/transactions/showall").then((res) => {
      setMetrics(res.data);
    });

    API.get("/products/getproduct").then((res) => {
      setProducts(res.data);
    });
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "quantity" || field === "price") {
      updated[index].total = updated[index].quantity * updated[index].price;
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { item_name: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submitBilling = async () => {
    await API.post("/transactions/billingTranction", [
      ...items,
      { total_amount: totalAmount, payment_method: paymentMethod },
    ]);
    alert("Transaction submitted!");
    setItems([{ item_name: "", quantity: 1, price: 0, total: 0 }]);
    setPaymentMethod("cash");
  };

  const sendStockEmail = async () => {
    await API.post("/sendemail/email");
    alert("Stock email sent!");
  };

  return (
    <div className="billing-container">
      <h1 className="page-title">Billing Dashboard</h1>

      {/* ================= METRICS ================= */}
      <div className="stats">
        <Metric title="Daily Sales" value={metrics.dailySales} />
        <Metric title="Daily Profit" value={metrics.dailyProfit} />
        <Metric title="Monthly Sales" value={metrics.monthlySales} />
        <Metric title="Monthly Profit" value={metrics.monthlyProfit} />
      </div>

      {/* ================= ACTION ================= */}
      <div className="actions">
        <button className="success-btn" onClick={sendStockEmail}>
          Send Stock Email
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    list="productList"
                    value={item.item_name}
                    onChange={(e) =>
                      handleChange(index, "item_name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleChange(index, "price", +e.target.value)
                    }
                  />
                </td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                  <button
                    className="danger-btn"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "20px" }}>
          <button className="primary-btn" onClick={addItem}>
            + Add Item
          </button>
        </div>
      </div>

      {/* ================= MOBILE FORM ================= */}
      <div className="mobile-only">
        {items.map((item, index) => (
          <div key={index} className="mobile-card">
            {items.length > 1 && (
              <button
                className="mobile-remove"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                ❌
              </button>
            )}

            <label>Item Name</label>
            <input
              list="productList"
              value={item.item_name}
              onChange={(e) =>
                handleChange(index, "item_name", e.target.value)
              }
            />

            <label>Quantity</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleChange(index, "quantity", +e.target.value)
              }
            />

            <label>Price</label>
            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                handleChange(index, "price", +e.target.value)
              }
            />

            <div className="mobile-total">
              Total: ${item.total.toFixed(2)}
            </div>
            <hr />
          </div>
        ))}

        <button
          className="primary-btn"
          onClick={addItem}
          style={{ width: "100%", marginTop: "10px" }}
        >
          + Add Item
        </button>

        {/* ================= PAYMENT METHOD ================= */}
        <div className="payment-radio">
          <label
            className={`radio-btn ${
              paymentMethod === "cash" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            💵 Cash
          </label>

          <label
            className={`radio-btn ${
              paymentMethod === "online" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            💳 Online
          </label>
        </div>

        <button
          className="success-btn"
          onClick={submitBilling}
          style={{ width: "100%", marginTop: "15px" }}
        >
          Submit Transaction
        </button>
      </div>

      {/* ================= SUMMARY (DESKTOP ONLY) ================= */}
      <div className="summary desktop-only">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="grand-total">
          Grand Total: ${totalAmount.toFixed(2)}
        </div>

        <div className="footer-actions">
          <button className="success-btn" onClick={submitBilling}>
            Submit Transaction
          </button>
        </div>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <datalist id="productList">
        {products.map((p, i) => (
          <option key={i} value={p.name} />
        ))}
      </datalist>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="amount">${Number(value).toFixed(2)}</div>
    </div>
  );
}

export default Billing;