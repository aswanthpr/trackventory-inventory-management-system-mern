
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import {Layout} from "./pages/Layout/Layout"
import InventoryPage from "./pages/Inventory/InventoryMgt"
import SalesMgt from "./pages/Sales/SalesMgt"
import CustomerMgt from "./pages/customer/CustomerMgt"

function App() {


  return (
    <>
 <div className="flex flex-col items-center justify-center min-h-svh">
    <Routes>
    <Route path="/login" element={<Login/>}/>

    <Route path="/" element={<Layout/>}>
 <Route index element={<InventoryPage/>}/>
 <Route  path="/sales-mgt" element={<SalesMgt/>}/>
 <Route path="/customer-mgt" element={<CustomerMgt/>}/>

 {/* <Route  element={}/>  */}
    </Route>
    </Routes>
    </div>
    </>
  )
}

export default App
