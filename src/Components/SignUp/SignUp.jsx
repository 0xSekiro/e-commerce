import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import $ from "jquery"
import { Link, useNavigate } from 'react-router-dom'

import * as Yup from "yup"
export default function SignUp() {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
   async function signUp(value){
  try {
    setisLoading(true)
    const {data} = await axios.post(`https://e-commerce-9w3i.onrender.com/api/v1/auth/sign-up`,value)
    console.log(data);
    if(data.status=="success") {
      $(".fa-check").fadeIn(500)
      $(".successMsg").fadeIn(1000 ,function() {

        navigate("/login")

      }) }

    setisLoading(false)

  } catch (error) {
    console.log("error",error);

    setisLoading(false)
    $(".errorMsg").fadeIn( 500,()=>{
      
      setTimeout(() => {
        $(".errorMsg").fadeOut(2000)
      }, 1000);

    })
 
  }
  }

let user = {
  "username":"",
  "email":"",
  "password":"",
  "passwordConfirm":""
}
let validation = Yup.object({
  username : Yup.string().required("username is required").min(3,"minimum 3 characters ").max(10,"maximum  10 characters"),
  email : Yup.string().required("email is required").email("email is invalid"),
  password : Yup.string().required("password is required").matches(/^[A-Za-z][a-z0-9]{8,10}$/," please enter 8 to 10 characters"),
  passwordConfirm:Yup.string().required("please confirm your password").oneOf([Yup.ref("password")],"confirm password and password don't match"),


})

 const formik = useFormik({
initialValues : user ,
onSubmit : function (values) {
  signUp(values)
},validationSchema:validation


})




return <>

<div style={{"textAlign":"center" , "display":"none"}} className='alert alert-danger errorMsg'>Email already in use</div>
<div style={{"textAlign":"center" ,"display":"none" }} className='alert alert-success successMsg'>Register successfully</div>


<div className="container d-flex justify-content-center mt-5 pt-5">
    <div className="inner-signUp w-50">
      <div className="row">
      <div className="col-md-12">
        <h3>Create account</h3>
        <form onSubmit={formik.handleSubmit}>
        <label className='my-2' htmlFor="username">username</label>
        <input onBlur={formik.handleBlur}  onChange={formik.handleChange}  value={formik.values.username} type="text" id='username' className='form-control '  />
        {formik.errors.username && formik.touched.username ? <div className='alert alert-danger'>{formik.errors.username}</div> : ""}
        <label className='my-2' htmlFor="email">email</label>
        <input  onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.email} type="Email" id='email' className='form-control ' />
        {formik.errors.email && formik.touched.email ? <div className='alert alert-danger'>{formik.errors.email}</div> : ""}

        <label className='my-2' htmlFor="password">Password</label>
        <input  onBlur={formik.handleBlur}   onChange={formik.handleChange} value={formik.values.password} type="Password" id='password' className='form-control '  />
        {formik.errors.password && formik.touched.password ? <div className='alert alert-danger'>{formik.errors.password}</div> : ""}

        <label className='my-2' htmlFor="passwordConfirm">Confirm Password</label>
        <input onBlur={formik.handleBlur}   onChange={formik.handleChange} value={formik.values.passwordConfirm} type="password" id='passwordConfirm' className='form-control ' />
        {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? <div className='alert alert-danger'>{formik.errors.passwordConfirm}</div> : ""}


        {isLoading? <button  className='btn btn-success ' type='button'><i className="fa-solid fa-spinner fa-spin  mt-3"></i></button>:<button type='submit' className='btn btn-success mt-3 load-bt'>Register</button>}
        <p className='my-3'>Already have an account ? <Link to="/login">Sign in</Link></p>  
        <button type="button" className="login-with-google-btn my-2" >
  Sign up with Google
</button>

        </form>
        </div>
     

        
      </div>

    </div>

</div>


</>
}
