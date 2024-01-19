import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner'

const Reset = () => {

    const [email, setemail] = useState('')
    const [loading, setloading] = useState(false)

    const handleReset = async()=>{
        /* eslint-disable */ 
        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
            toast('Enter a valid Email!!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        setloading(true)
        await axios.post('http://localhost:5000/auth/resetPassword' , {email}).then(res => {
            if(res.data.error){
                toast('Enter a valid Email!!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
                setloading(false)
                return;
            }
            toast(res.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
        })
    }

    return (
        <div className='container d-flex justify-content-center'>

            <div className='mt-5' style={{minWidth : "40vw"}}>
                <h1 className='mb-4 card-title text-center navbar-brand'>Instagram</h1>

                <div className="form-outline mb-4">
                    <label className="form-label" >Your Email for verification</label>
                    <input type="email" className="form-control" value = {email} onChange={(e)=>{setemail(e.target.value)}} />
                </div>

                <button type="submit" className="btn btn-primary mb-4" onClick={()=>{handleReset()}}>{loading ? <TailSpin
                    visible={true}
                    height="23"
                    width="30"
                    color="#FFFFFF"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                /> : "Reset password" }</button>
            </div>

        </div>
    )
}

export default Reset