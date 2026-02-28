import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import QRCode from "qrcode";
import "./productSheets.css";

function ProductSheets() {
  const [products, setProducts] = useState([]);
  const [qrMap, setQrMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const generateQrs = useCallback(async (list) => {
    const map = {};
    for (const p of list) {
      map[p.id] = await QRCode.toDataURL(p.id, {
        width: 300,
        margin: 1,
      });
    }
    setQrMap(map);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await API.get("/products/getproduct");
    setProducts(res.data);
    generateQrs(res.data);
  }, [generateQrs]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* 🔍 SEARCH FILTER */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ✅ TOGGLE SELECTION */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* 🖨️ PRINT LOGIC */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sheet-page">
      <div className="print-only-header">
  <div className="print-store-name">
    अद्विका ऑटो अ‍ॅक्सेसरीज
  </div>
  <div className="print-store-tagline">
    किंमत योग्य, काम भारी...
  </div>
</div>
      {/* HEADER */}
      <div className="sheet-header">
        <h2>Product QR Sheets</h2>

        <div className="sheet-actions">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <button className="print-btn" onClick={handlePrint}>
            Print Selected
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="sheet-grid">
        {filteredProducts.length === 0 && (
          <div className="no-results">No products found</div>
        )}

        {filteredProducts.map((p) => {
          const isSelected = selectedIds.includes(p.id);

          return (
            <div
              key={p.id}
              className={`sheet-block ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSelect(p.id)}
            >
              {/* NAME */}
              <div className="block-name">
                {p.marathiName?.trim() || p.name}
              </div>

              {/* IMAGE */}
              <div className="block-image">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <span className="no-image">No Image</span>
                )}
              </div>

              {/* QR */}
              <div className="block-qr">
                {qrMap[p.id] && <img src={qrMap[p.id]} alt="QR" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductSheets;