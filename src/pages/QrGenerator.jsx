import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../api";
import QRCode from "qrcode";
import "./qr.css";

function QrGenerator() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [search, setSearch] = useState("");

  const qrRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/getproduct");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search text
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // Handle product selection (UUID safe)
  const handleSelect = async (productId) => {
    if (!productId) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProduct(product);

    try {
      const qr = await QRCode.toDataURL(product.id, {
        width: 300,
        margin: 1,
      });
      setQrUrl(qr);
    } catch (err) {
      console.error("QR generation failed", err);
    }
  };

  // Download QR
  const downloadQR = () => {
    if (!qrUrl || !selectedProduct) return;

    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `${selectedProduct.name}-qr.png`;
    link.click();
  };

  return (
    <div className="qr-page">
      <h1>Product QR Generator</h1>

      {/* Search */}
      <input
        type="text"
        className="qr-search"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Dropdown */}
      <select
        className="qr-select"
        value={selectedProduct?.id || ""}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="" disabled>
          Select Product
        </option>

        {filteredProducts.length === 0 && (
          <option disabled>No products found</option>
        )}

        {filteredProducts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* QR Preview */}
      {selectedProduct && qrUrl && (
        <>
          <div className="qr-wrapper" ref={qrRef}>
            <div className="qr-name">{selectedProduct.name}</div>
            <img src={qrUrl} alt="QR Code" className="qr-img" />
          </div>

          <button className="primary-btn" onClick={downloadQR}>
            Download QR
          </button>
        </>
      )}
    </div>
  );
}

export default QrGenerator;