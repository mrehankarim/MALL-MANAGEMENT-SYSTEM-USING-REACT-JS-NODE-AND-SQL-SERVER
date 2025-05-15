import React,{useState} from 'react';
import { ThemeProvider } from '@emotion/react';
import {CssBaseline} from '@mui/material';
import {lightTheme,darkTheme} from "./theme.js"
import SubscribersPage from './pages/admin/SubscribersPage.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx'
import StoreRentPage from './pages/customer/StoreRentPage.jsx'
import StoreBillsPage from './pages/customer/StoreBillsPage.jsx'
import { store } from './redux/store.js';
import {Provider } from "react-redux"
import ProtectedRoute from './componenets/ProtectedRoute.jsx';
import AllSubscribersPage from './pages/admin/AllSubscribersPage.jsx';
import FeedbackPage from './pages/admin/FeedbackPage.jsx';
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import SubAdminDashboardPage from './pages/subadmin/SubAdminDashboardPage.jsx';
import ShopsPage from './pages/subadmin/ShopsPage.jsx';
import CustomersPage from './pages/subadmin/CustomersPage.jsx';
import StoresPage from './pages/subadmin/StoresPage.jsx';
import MonthlyRentsPage from './pages/subadmin/MonthlyRentsPage.jsx';
import EmployeesPage from './pages/subadmin/EmployeesPage.jsx'
import EmployeePayrollsPage from './pages/subadmin/EmployeePayrollsPage.jsx'
import EmployeeAttendancePage from './pages/subadmin/EmployeeAttendancePage.jsx'

const App=()=>{
   const theme = darkTheme;
   const router=createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/admin/subscriber",
      element:<SubscribersPage/>
    },
    {
      path:"/admin/dashboard",
      element:<Dashboard/>
    },
    {
      path:"/customer/dashboard",
      element:<CustomerDashboard/>
    },
    {
      path:"/customer/store-rent",
      element:<StoreRentPage/>
    },
    {
      path:"/customer/store-bills",
      element:<StoreBillsPage/>
    },
    {
      path:"/admin/subscribers",
      element:<SubscribersPage/>
    },
    {
      path:"/admin/allsubscribers",
      element:<AllSubscribersPage/>
    },
    {
      path:"/admin/feedbacks",
      element:<FeedbackPage/>
    },
    {
      path:"/owner/dashboard",
      element:<SubAdminDashboardPage/>
    },
    {
      path:"/owner/shops",
      element:<ShopsPage/>
    },
    {
      path:"/owner/storeowners",
      element:<CustomersPage/>
    },
    {
      path:"owner/stores",
      element:<StoresPage/>
    },
    {
      path:"owner/rents",
      element:<MonthlyRentsPage/>
    },
    {
      path:"owner/employees",
      element:<EmployeesPage/>
    },
    {
      path:"owner/employee-payrolls",
      element:<EmployeePayrollsPage/>
    },
    {
      path:"owner/employees-attendance",
      element:<EmployeeAttendancePage/>
    }
   ])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <RouterProvider router={router}>   
       {/* <AdminLayout username={"mrehankarim"}><Subscriber></Subscriber></AdminLayout> */}
    
    </RouterProvider>
    </ThemeProvider>

    
  );
}
export default App