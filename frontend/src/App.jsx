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
import {createBrowserRouter,RouterProvider} from "react-router-dom"
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