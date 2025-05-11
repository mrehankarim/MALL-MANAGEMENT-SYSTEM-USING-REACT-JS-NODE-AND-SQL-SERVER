import React,{useState} from 'react';
import { ThemeProvider } from '@emotion/react';
import {CssBaseline} from '@mui/material';
import {lightTheme,darkTheme} from "./theme.js"
import SubscribersPage from './pages/admin/SubscribersPage.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { store } from './redux/store.js';
import {Provider } from "react-redux"
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