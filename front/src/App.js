import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Invoicelist from './Component/Invoicelist';
import NewInvoicePage from './Component/NewInvoice';
import CustomerPage from './Component/Customer';
import AddCustomerForm from './Component/Addcustomerform';
import CustomerList from './Component/Customerlist';
import ItemsPage from './Component/Items';
import AddItem from './Component/Additem';
import ItemList from './Component/Itemlist';
import PurchaseOrderForm from './Component/NewpurchaseOrder';
import PurchaseOrderList from './Component/Purchaseorderlist';
import NewVendorForm from './Component/Addvendors';
import VendorListPage from './Component/Vendorslist';
import NewQuotation from './Component/AddQuatation';
import QuotationListPage from './Component/Quotationlist';
import Tax from './Component/Tax';
import AddTax from './Component/AddTax';
import Taxlist from './Component/Taxlist';
import NewWorkOrder from './Component/AddWorkOrder';
import WorkOrderlist from './Component/Workorderlist';
import NewProFormaInvoice from './Component/AddproFrmainvoice';
import ProformaInvoicelist from './Component/Proformainvoicelist';
import PaymentsSettings from './Component/Paymentsetting';
import AddPaymentsEntry from './Component/Addpaymententry';
import ReportsAndAnalytics from './Component/ReportandAnalytics';
import AddFinancialYear from './Component/add_financial_year';
import FinancialYearMain from './Component/financial-year-home';
import EditTax from './Component/EditTax';
import EditQuotationPage from './Component/EditQuotationPage';
import EditInvoicePage from './Component/EditInvoicePage';
import EditPurchaseOrderPage from './Component/EditPurchaseOrderPage';
import EditVendorDialog from './Component/EditVendor';
import EditWorkOrderPage from './Component/EditWorkOrder';





function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice" element={<Invoicelist />} />
          <Route path="/new-invoice" element={<NewInvoicePage />} />
          <Route path="/invoice-list" element={<Invoicelist />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/add-customer" element={<AddCustomerForm />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/add-items" element={<AddItem />} />
          <Route path="/item-list" element={<ItemList />} />
          <Route path="/purchase-order" element={<PurchaseOrderList />} />
          <Route path="/add-purchase-order" element={<PurchaseOrderForm />} />
          <Route path="/purchase-order-list" element={<PurchaseOrderList />} />
          <Route path="/edit-purchase/:id" element={<EditPurchaseOrderPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          <Route path="/add-vendor" element={<NewVendorForm />} />
          <Route path="/vendor-list" element={<VendorListPage />} />
          <Route path="/edit-vendor/:id" element={<EditVendorDialog />} />
          <Route path="/Quotation" element={<QuotationListPage />} />
          <Route path="/add-Quotation" element={<NewQuotation />} />
          <Route path="/editQuotation/:id" element={<EditQuotationPage />} />
          <Route path="/Quotation-list" element={<QuotationListPage />} />
          <Route path="/Tax" element={<Tax />} />
          <Route path="/add-Tax" element={<AddTax />} />
          <Route path="/Tax-list" element={<Taxlist />} />
          <Route path="/Work-Order" element={<WorkOrderlist />} />
          <Route path="/add-Work-Order" element={<NewWorkOrder />} />
          <Route path="/Work-Order-list" element={<WorkOrderlist />} />
          <Route path="/edit-work-order/:id" element={<EditWorkOrderPage />} />
          <Route path="/pro-forma-invoice" element={<ProformaInvoicelist />} />
          <Route path="/add-pro-forma-invoice" element={<NewProFormaInvoice />} />
          <Route path="/pro-forma-invoice-list" element={<ProformaInvoicelist />} />
          <Route path="/add-financial-year-settings" element={<FinancialYearMain />} />
          <Route path="/Payment-settings" element={<PaymentsSettings />} />
          <Route path="/Add-Payment-settings" element={<AddPaymentsEntry />} />
          <Route path="/Report-and-analytics" element={<ReportsAndAnalytics />} />
          <Route path='/add/financial_year' element={<AddFinancialYear />} />
          <Route path="/edit-tax/:id" element={<EditTax />} />
          <Route path="/edit-invoice/:id" element={<EditInvoicePage />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
