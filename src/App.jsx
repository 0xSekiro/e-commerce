import React, { useEffect, useState } from 'react'
import SignUp from './Components/SignUp/SignUp'
import{ Navigate, RouterProvider, createBrowserRouter, createHashRouter} from "react-router-dom"
import Login from './Components/Login/Login'
import { Provider } from 'react-redux'
import Test from './Components/Test/Test'
import jwtDecode from 'jwt-decode'






export default function App() {

    
    useEffect(function(){


  
        if(localStorage.getItem("userToken") !=null && currentUser == null) {
        
            getUserDataDecoded()
        }
        
            },[])
        
        
    const [currentUser, setCurrentUser] = useState(null)


    function getUserDataDecoded() {
        let userToken = localStorage.getItem("userToken")
        let decodedToken = jwtDecode(userToken)
        setCurrentUser (decodedToken)
      


    }


    const router = createBrowserRouter ([
        {path:"",element :<SignUp/>},

        {path:"/register",element :<SignUp/>},
        {path:"/login",element :<Login getUserDataDecoded={getUserDataDecoded}/>},
        {path:"/test",element :<Test/>},


])

   

    return <>
    
        <RouterProvider router={router}></RouterProvider>

    
    
    
    </>








}
