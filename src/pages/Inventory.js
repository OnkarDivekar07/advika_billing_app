import React, { useEffect, useState } from "react";
import API from "../api";
import "./style.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newProduct, setNewProduct] = useState({
  name: "",
  quantity: "",
  price: "",
  lower_threshold: "",
  upper_threshold: "",
});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products/getproduct");
    setProducts(res.data || []);
  };
const removeProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to remove this product?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/products/removeproduct/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  } catch (error) {
    console.error("Error removing product:", error);
    alert("Failed to remove product");
  }
};
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const updateProduct = async (product) => {
    await API.put(`/products/updateproduct/${product.id}`, product);
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
    updateProduct(updated[index]);
  };

  const addProduct = async () => {
  if (!newProduct.name.trim()) {
    alert("Product name required");
    return;
  }

  const payload = {
    ...newProduct,
    quantity: Number(newProduct.quantity),
    price: Number(newProduct.price),
    lower_threshold: Number(newProduct.lower_threshold),
    upper_threshold: Number(newProduct.upper_threshold),
  };

  await API.post("/products/addproduct", payload);

  setShowForm(false);
  setNewProduct({
    name: "",
    quantity: "",
    price: "",
    lower_threshold: "",
    upper_threshold: "",
  });

  fetchProducts();
};
 const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="billing-container">
      <h1 className="page-title">Inventory</h1>
    <input
  type="text"
  className="search-input"
  placeholder="Search product by name..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
      {/* ===== TOTAL VALUE ===== */}
      <div className="inventory-total">
        Total Inventory Value: ₹{totalInventoryValue.toFixed(2)}
      </div>

      {/* ===== ADD PRODUCT ===== */}
      <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
        + Add Product
      </button>

      {showForm && (
        <div className="add-product-card">
          <input
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Lower Threshold"
            value={newProduct.lower_threshold}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                lower_threshold: +e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Upper Threshold"
            value={newProduct.upper_threshold}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                upper_threshold: +e.target.value,
              })
            }
          />
          <button className="success-btn" onClick={addProduct}>
            Save Product
          </button>
        </div>
      )}

      {/* ===== INVENTORY TABLE ===== */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Min</th>
              <th>Max</th>
              <th>Action</th>
            </tr>
          </thead>
     <tbody>
  {filteredProducts.map((p) => {
  const index = products.findIndex(prod => prod.id === p.id);
    const low = p.quantity <= p.lower_threshold;
    const high = p.quantity >= p.upper_threshold;

    return (
      <tr
        key={p.id}
        className={low ? "row-danger" : high ? "row-success" : ""}
      >
        <td>
          <input
            value={p.name}
            title={p.name}
            onChange={(e) =>
              handleChange(index, "name", e.target.value)
            }
          />
        </td>

        <td>
          <input
            type="number"
            value={p.quantity}
            onChange={(e) =>
              handleChange(index, "quantity", +e.target.value)
            }
          />
        </td>

        <td>
          <input
            type="number"
            value={p.price}
            onChange={(e) =>
              handleChange(index, "price", +e.target.value)
            }
          />
        </td>

        <td>₹{(p.quantity * p.price).toFixed(2)}</td>

        <td>
          <input
            type="number"
            value={p.lower_threshold}
            onChange={(e) =>
              handleChange(index, "lower_threshold", +e.target.value)
            }
          />
          {low && <span className="down">▼</span>}
        </td>

        <td>
          <input
            type="number"
            value={p.upper_threshold}
            onChange={(e) =>
              handleChange(index, "upper_threshold", +e.target.value)
            }
          />
          {high && <span className="up">▲</span>}
        </td>

        <td>
          <button
            className="danger-btn"
            onClick={() => removeProduct(p.id)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;