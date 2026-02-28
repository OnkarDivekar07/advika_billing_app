import React, { useState, useEffect } from "react";
import API from "../api";
import "./style.css";

function Billing() {
  const [items, setItems] = useState([
    { productId: "", item_name: "", quantity: 1, price: 0, total: 0 },
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
      updated[index].total =
        Number(updated[index].quantity) * Number(updated[index].price);
    }

    setItems(updated);
  };

  const handleProductSelect = (index, name) => {
    const product = products.find((p) => p.name === name);
    const updated = [...items];

    updated[index].item_name = name;

    if (product) {
      updated[index].productId = product.id;
      updated[index].total =
        updated[index].quantity * product.price;
    } else {
      updated[index].productId = "";
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", item_name: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getValidItems = () => {
    return items.filter(
      (item) =>
        item.productId &&
        Number(item.quantity) > 0 &&
        Number(item.price) > 0
    );
  };

  const submitBilling = async () => {
    const validItems = getValidItems();

    if (validItems.length === 0) {
      alert("Please add at least one valid item before submitting.");
      return;
    }

    const finalTotal = validItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await API.post("/transactions/billingTranction", [
      ...validItems,
      {
        total_amount: finalTotal,
        payment_method: paymentMethod,
      },
    ]);

    alert("Transaction submitted!");
    setItems([
      { productId: "", item_name: "", quantity: 1, price: 0, total: 0 },
    ]);
    setPaymentMethod("cash");
  };

  const sendStockEmail = async () => {
    await API.post("/sendemail/email");
    alert("Stock email sent!");
  };
  const runMarathiBackfill = async () => {
  const confirmRun = window.confirm(
    "⚠️ Run Marathi Name Backfill?\nThis should be done only once."
  );

  if (!confirmRun) return;

  try {
    const res = await API.post("/api/internal/backfill-marathi", {
      secret: "BACKFILL_OK"
    });

    alert(
      `✅ Backfill Complete\n\nUpdated: ${res.data.updated}\nSkipped: ${res.data.skipped}\nTotal Checked: ${res.data.total}`
    );
  } catch (err) {
    console.error(err);
    alert(
      "❌ Backfill failed\n" +
        (err.response?.data?.error || err.message)
    );
  }
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
        {/* 🔥 TEMP INTERNAL TOOL – REMOVE AFTER USE */}
  <button
    className="danger-btn"
    onClick={runMarathiBackfill}
    style={{ marginLeft: "10px" }}
  >
    Backfill Marathi Names
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
                      handleProductSelect(index, e.target.value)
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
              >
                ❌
              </button>
            )}

            <label>Item Name</label>
            <input
              list="productList"
              value={item.item_name}
              onChange={(e) =>
                handleProductSelect(index, e.target.value)
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

        <div className="payment-radio">
          <label className={`radio-btn ${paymentMethod === "cash" ? "active" : ""}`}>
            <input
              type="radio"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            💵 Cash
          </label>

          <label className={`radio-btn ${paymentMethod === "online" ? "active" : ""}`}>
            <input
              type="radio"
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

      {/* ================= SUMMARY ================= */}
      <div className="summary desktop-only">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="grand-total">
          Grand Total: ${totalAmount.toFixed(2)}
        </div>
       {/* ================= PAYMENT METHOD (DESKTOP) ================= */}
<div className="payment-radio" style={{ marginTop: "15px" }}>
  <label className={`radio-btn ${paymentMethod === "cash" ? "active" : ""}`}>
    <input
      type="radio"
      name="payment-desktop"
      checked={paymentMethod === "cash"}
      onChange={() => setPaymentMethod("cash")}
    />
    💵 Cash
  </label>

  <label className={`radio-btn ${paymentMethod === "online" ? "active" : ""}`}>
    <input
      type="radio"
      name="payment-desktop"
      checked={paymentMethod === "online"}
      onChange={() => setPaymentMethod("online")}
    />
    💳 Online
  </label>
</div>
        <div className="footer-actions">
          <button className="success-btn" onClick={submitBilling}>
            Submit Transaction
          </button>
        </div>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <datalist id="productList">
        {products.map((p) => (
          <option key={p.id} value={p.name} />
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