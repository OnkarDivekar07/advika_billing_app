import { Routes, Route, Navigate } from "react-router-dom";

import Billing from "./pages/billing";
import Login from "./pages/LoginSignup";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import DailyTransactions from "./pages/DailyTransactions";
import Inventory from "./pages/Inventory";
import Financials from "./pages/Financials";
import ProductSheets from "./pages/ProductSheets";
import Layout from "./components/Layout";
import QrGenerator from "./pages/QrGenerator";
import ProductImages from "./pages/ProductImages";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />

      {/* Dashboard Routes with Sidebar */}
      <Route
        path="/billing"
        element={
          <Layout>
            <Billing />
          </Layout>
        }
      />

      <Route
        path="/daily"
        element={
          <Layout>
            <DailyTransactions />
          </Layout>
        }
      />

      <Route
        path="/inventory"
        element={
          <Layout>
            <Inventory />
          </Layout>
        }
      />

      <Route
        path="/financials"
        element={
          <Layout>
            <Financials />
          </Layout>
        }
      />
     <Route
        path="/qrgenerator"
        element={
          <Layout>
            <QrGenerator />
          </Layout>
        }
      />
      <Route
  path="/product-sheets"
  element={
    <Layout>
      <ProductSheets />
    </Layout>
  }
/>
<Route
  path="/product-images"
  element={
    <Layout>
      <ProductImages />
    </Layout>
  }
/>
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;
