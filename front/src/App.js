import './App.css';
import InvoicePage from './Component/Invoice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewInvoicePage from './Component/NewInvoice';
import Invoicelist from './Component/Invoicelist';
import CustomerPage from './Component/Customer';
import AddCustomerForm from './Component/Addcustomerform';
import CustomerList from './Component/Customerlist';
import ItemsPage from './Component/Items';
import AddItem from './Component/Additem';
import ItemList from './Component/Itemlist';
import FirstTimePurchaseOrder from './Component/Purchaseorder';
import PurchaseOrderForm from './Component/NewpurchaseOrder';
import PurchaseOrderList from './Component/Purchaseorderlist';
import NewVendorForm from './Component/Addvendors';
import Vendors from './Component/Vendors';
import VendorListPage from './Component/Vendorslist';
import Quotation from './Component/Quotation';
import NewQuotation from './Component/AddQuatation';
import QuotationListPage from './Component/Quotationlist';
import Tax from './Component/Tax';
import AddTax from './Component/AddTax';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Taxlist from './Component/Taxlist';
import WorkOrder from './Component/WorkOrder';
import NewWorkOrder from './Component/AddWorkOrder';
import WorkOrderlist from './Component/Workorderlist';
import ProFormaInvoice from './Component/ProFormaInvoice';
import NewProFormaInvoice from './Component/AddproFrmainvoice';
import ProformaInvoicelist from './Component/Proformainvoicelist';
import FinancialYearSettings from './Component/Financialyearsetting';
import PaymentsSettings from './Component/Paymentsetting';
import AddPaymentsEntry from './Component/Addpaymententry';
import ReportsAndAnalytics from './Component/ReportandAnalytics';
import FinancialYearGuard from './Component/financial_year_check';
import AddFinancialYear from './Component/add_financial_year';
import FinancialYearMain from './Component/financial-year-home';
import Dashboard from './Component/Dashboard';
import { useState } from 'react';
import EditTax from './Component/EditTax';
import EditQuotationPage from './Component/EditQuotationPage';





function App() {
 
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      
      <Router>
           <FinancialYearGuard /> 
        <Routes>
          <Route path="/dashboard" element={<Dashboard></Dashboard>} />
          {/* <Route path="/invoice" element={<InvoicePage />} /> */}
          <Route path="/invoice" element={<Invoicelist></Invoicelist>} />
          <Route path="/new-invoice" element={<NewInvoicePage />} />
          <Route path="/invoice-list" element={<Invoicelist />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/add-customer" element={<AddCustomerForm />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/items" element={  <ItemsPage />} />
          <Route path="/add-items" element={<AddItem />} />
          <Route path="/item-list" element={<ItemList />} />
          {/* <Route path="/purchase-order" element={<FirstTimePurchaseOrder />} /> */}
          <Route path="/purchase-order" element={<PurchaseOrderList></PurchaseOrderList>} />
          <Route path="/add-purchase-order" element={<PurchaseOrderForm />} />
          <Route path="/purchase-order-list" element={<PurchaseOrderList />} />
          {/* <Route path="/vendors" element={<Vendors />} /> */}
          <Route path="/vendors" element={<VendorListPage/>} />
          <Route path="/add-vendor" element={<NewVendorForm />} />
          <Route path="/vendor-list" element={<VendorListPage />} />
          {/* <Route path="/Quotation" element={<Quotation />} /> */}
          <Route path="/Quotation" element={<QuotationListPage />} />
          <Route path="/add-Quotation" element={<NewQuotation />} />
          <Route path="/editQuotation/:id" element={<EditQuotationPage />} />
          <Route path="/Quotation-list" element={<QuotationListPage />} />
          <Route path="/Tax" element={<Tax />} />
          <Route path="/add-Tax" element={<AddTax />} />
          <Route path="/Tax-list" element={<Taxlist />} />
          {/* <Route path="/Work-Order" element={<WorkOrder />} /> */}
          <Route path="/Work-Order" element={<WorkOrderlist />} />
          <Route path="/add-Work-Order" element={<NewWorkOrder />} />
          <Route path="/Work-Order-list" element={<WorkOrderlist />} />
          {/* <Route path="/pro-forma-invoice" element={<ProFormaInvoice />} /> */}
          <Route path="/pro-forma-invoice" element={<ProformaInvoicelist />} />
          <Route path="/add-pro-forma-invoice" element={<NewProFormaInvoice />} />
          <Route path="/pro-forma-invoice-list" element={<ProformaInvoicelist />} />
          <Route path="/add-financial-year-settings" element={<FinancialYearMain></FinancialYearMain>} />
          <Route path="/Payment-settings" element={<PaymentsSettings />} />
          <Route path="/Add-Payment-settings" element={<AddPaymentsEntry />} />
          <Route path="/Report-and-analytics" element={<ReportsAndAnalytics />} />
          <Route path='/add/financial_year' element={<AddFinancialYear></AddFinancialYear>}/>
          <Route path="/edit-tax/:id" element={<EditTax />} />

        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
