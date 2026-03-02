import React, { useEffect, useState } from "react";
import API from "../api";
import "./productImages.css";
import { Trash2 } from "lucide-react";

const UNIT_OPTIONS = [
  { value: "pcs", label: "नग (PCS)" },
  { value: "jodi", label: "जोडी (JODI)" },
  { value: "dozen", label: "डझन (DOZEN)" },
];

function ProductImages() {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(null);
  const [saving, setSaving] = useState(null);
  const [unitSaving, setUnitSaving] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [retryProduct, setRetryProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products/getproduct");
    setProducts(res.data);
  };

  /* 📸 IMAGE UPLOAD */
  const handleUpload = async (productId, file) => {
    if (!file) return;

    if (!navigator.onLine) {
      alert("You are offline. Please check internet connection.");
      return;
    }

    setUploading(productId);
    setError(null);
    setRetryProduct(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await API.post(`/products/${productId}/upload-image`, formData, {
        timeout: 60000,
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Upload failed due to slow or unstable internet.");
      setRetryProduct(productId);
    } finally {
      setUploading(null);
    }
  };

  /* 🗑️ DELETE IMAGE */
  const handleDelete = async (productId) => {
    if (!window.confirm("Delete product image?")) return;

    await API.delete(`/products/${productId}/delete-image`);
    fetchProducts();
  };

  /* 🇮🇳 SAVE MARATHI NAME */
  const handleMarathiSave = async (productId, marathiName) => {
    setSaving(productId);
    await API.put(`/products/${productId}/marathi-name`, {
      marathiName,
    });
    setSaving(null);
    fetchProducts();
  };

  /* 📦 SAVE DEFAULT UNIT */
  const handleUnitChange = async (productId, defaultUnit) => {
    try {
      setUnitSaving(productId);

      await API.put(`/products/${productId}/unit`, {
        defaultUnit,
      });

      // optimistic UI update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, defaultUnit } : p
        )
      );
    } catch (err) {
      alert("Failed to update unit");
    } finally {
      setUnitSaving(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.marathiName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-images-page">
      <h1>Product Images & Units</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search product (English / मराठी)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <div className="error-box">{error}</div>}
      </div>

      <div className="image-table">
        {filteredProducts.map((p) => (
          <div key={p.id} className="image-row">
            {/* ENGLISH NAME */}
            <div className="col name-col">{p.name}</div>

            {/* DEFAULT UNIT */}
            <div className="col unit-col">
              <select
                value={p.defaultUnit || "pcs"}
                onChange={(e) =>
                  handleUnitChange(p.id, e.target.value)
                }
                disabled={unitSaving === p.id}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>

              {unitSaving === p.id && (
                <span className="saving">Saving...</span>
              )}
            </div>

            {/* MARATHI NAME */}
            <div className="col marathi-col">
              <input
                type="text"
                placeholder="मराठी नाव"
                defaultValue={p.marathiName || ""}
                onBlur={(e) =>
                  handleMarathiSave(p.id, e.target.value)
                }
              />
              {saving === p.id && (
                <span className="saving">Saving...</span>
              )}
            </div>

            {/* IMAGE */}
            <div className="col image-col">
              {p.imageUrl ? (
                <div className="image-wrapper">
                  <img src={p.imageUrl} alt={p.name} />
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <label className="upload-btn">
                    {uploading === p.id
                      ? "Uploading..."
                      : "Upload Image"}
                    <input
                      id={`file-${p.id}`}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleUpload(p.id, e.target.files[0])
                      }
                    />
                  </label>

                  {retryProduct === p.id && (
                    <button
                      className="retry-btn"
                      onClick={() =>
                        document
                          .getElementById(`file-${p.id}`)
                          .click()
                      }
                    >
                      Retry Upload
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;