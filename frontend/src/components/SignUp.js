import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner'

const SignUp = () => {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmpass, setconfirmpass] = useState('')
    const [loading, setloading] = useState(false)

    const navigate = useNavigate();

    const handleSignUp = async () => {
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
        if(password.length < 8){
            toast('Password must be 8 characters', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        setloading(true)
        if (password !== confirmpass) {
            toast('Password do not matched!!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }

        if (!password || !name || !email || !confirmpass) {
            toast('Add all the fields', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }

        await axios.post('http://localhost:5000/auth/signup', { name, email, password }, { withCredentials: true }).then(res => {
            if (res.data.error) {
                toast(res.data.error, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
                setloading(false)
                return;
            }
            toast(res.data.msg, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            navigate('/signin')
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className='container d-flex justify-content-center'>

            <div className='mt-5' style={{ minWidth: "40vw" }}>
                <h1 className='mb-4 card-title text-center navbar-brand'>Instagram</h1>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">UserName</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => { setname(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => { setemail(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Password &nbsp;</label>
                    <span style={{fontSize : "13px"}}>(Minimum 8 characters)</span>
                    <input type="password" className="form-control" required value={password} onChange={(e) => { setpassword(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Confirm Password</label>
                    <input type="password" value={confirmpass} onChange={(e) => { setconfirmpass(e.target.value) }} className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary mb-4" onClick={handleSignUp}>{loading ? <TailSpin
                    visible={true}
                    height="23"
                    width="30"
                    color="#FFFFFF"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                /> : "SignUp" }</button>

                <p>Already have an account? <Link to='/signin'>CLick here</Link> </p>
            </div>

        </div>
    )
}

export default SignUp