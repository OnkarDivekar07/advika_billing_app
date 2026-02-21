import React, { useEffect, useRef, useState } from "react";
import API from "../api";
import QRCode from "qrcode";
import "./qr.css";

function QrGenerator() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrUrl, setQrUrl] = useState("");

  const qrRef = useRef();

  useEffect(() => {
    API.get("/products/getproduct").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleSelect = async (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);

    if (product) {
      const qr = await QRCode.toDataURL(product.id, {
        width: 300,
        margin: 1,
      });
      setQrUrl(qr);
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `${selectedProduct.name}-qr.png`;
    link.click();
  };

  return (
    <div className="qr-page">
      <h1>Product QR Generator</h1>

      <select
        className="qr-select"
        onChange={(e) => handleSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select Product
        </option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selectedProduct && (
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