
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { Layout } from "./pages/Layout/Layout";
import InventoryPage from "./pages/Inventory/InventoryMgt";
import SalesMgt from "./pages/Sales/SalesMgt";
import CustomerMgt from "./pages/customer/CustomerMgt"
import {ProtectedLogin,ProtectedRoute} from "./Auth/ProtectedRoute";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Routes>
       
        <Route path="/login" element={
           <ProtectedLogin>
          <Login />
            </ProtectedLogin>} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={
             <ProtectedRoute>
          
             <InventoryPage />
           </ProtectedRoute>
            } />
          <Route
            path="/sales-mgt"
            element={
              <ProtectedRoute>
                <SalesMgt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-mgt"
            element={
              <ProtectedRoute>
                <CustomerMgt />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;