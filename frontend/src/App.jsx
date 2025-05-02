import React,{useState} from 'react';
import { ThemeProvider } from '@emotion/react';
import {CssBaseline} from '@mui/material';
import {lightTheme,darkTheme} from "./theme.js"
import AdminLayout from './componenets/AdminLayout';
import Subscriber from './componenets/Subscriber.jsx';
import Home from './pages/Home.jsx';
import {createBrowserRouter,RouterProvider} from "react-router-dom"
const App=()=>{
   const theme = darkTheme;
   const router=createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/admin",
      element:<AdminLayout><Subscriber/></AdminLayout>
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