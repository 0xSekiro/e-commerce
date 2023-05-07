
export default function ResetPassword() {
return <>

<div className="container  justify-content-center mt-5 pt-5 logINS">
<div className="inner-signUp w-50 ">
      <div className="row">
      <div className="col-md-12">
        <h3>Reset Your Password</h3>
        
        <form >
        
        <label className='my-2' htmlFor="nPassword">New Password</label>
        <input   type="password" id='nPassword' className='form-control ' />

        <label className='my-2' htmlFor="cPassword">Confirm New Password</label>
        <input   type="Password" id='cPassword' className='form-control '  />

   
        <button type='button' className='btn btn-success mt-3 load-bt'>Confirm</button>
        
   

        </form>
        </div>

        
      </div>

    </div>
</div>

</>
}
