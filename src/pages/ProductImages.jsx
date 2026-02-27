import React, { useEffect, useState } from "react";
import API from "../api";
import "./productImages.css";
import { Trash2 } from "lucide-react";

function ProductImages() {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(null);
  const [saving, setSaving] = useState(null);

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

    setUploading(productId);
    const formData = new FormData();
    formData.append("image", file);

    await API.post(`/products/${productId}/upload-image`, formData);
    setUploading(null);
    fetchProducts();
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

  return (
    <div className="product-images-page">
      <h1>Product Images</h1>

      <div className="image-table">
        {products.map((p) => (
          <div key={p.id} className="image-row">
            {/* ENGLISH NAME */}
            <div className="col name-col">{p.name}</div>

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
                <label className="upload-btn">
                  {uploading === p.id
                    ? "Uploading..."
                    : "Upload Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleUpload(p.id, e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;