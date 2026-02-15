import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./layout.css";

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Billing", path: "/billing" },
    { name: "Daily", path: "/daily" },
    { name: "Inventory", path: "/inventory" },
    { name: "Financials", path: "/financials" },
  ];

  return (
    <div className="layout">

      {/* Overlay (Mobile Only) */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">MyStore</div>

        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="main">

        {/* Topbar */}
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)}>
            ☰
          </button>
          <div className="page-name">
            {location.pathname.replace("/", "").toUpperCase()}
          </div>
        </header>

        {/* Content */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
