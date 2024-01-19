import React, { useState ,  useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner'
import { userContext } from '../App';

const SignIn = () => {
    const {dispatch} = useContext(userContext)
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);

    const navigate = useNavigate();

    const handleSignIn = async()=>{
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
        if (!password || !email) {
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
        await axios.post('http://localhost:5000/auth/signin', { email, password }, { withCredentials: true }).then(res => {
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
            console.log(res.data)
            localStorage.setItem('jwt' , (res.data.token))
            localStorage.setItem('user' , JSON.stringify(res.data.user))
            dispatch({type : "USER" , payload : res.data.user})
            toast('LoggedIn Successfully!!!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            navigate('/')
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className='container d-flex justify-content-center'>

            <div className='mt-5' style={{minWidth : "40vw"}}>
                <h1 className='mb-4 card-title text-center navbar-brand'>Instagram</h1>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">Email</label>
                    <input type="email" id="form2Example1" className="form-control" value = {email} onChange={(e)=>{setemail(e.target.value)}} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                    <input type="password" id="form2Example2" className="form-control" required value = {password} onChange={(e)=>{setpassword(e.target.value)}} />
                </div>

                <button type="submit" className="btn btn-primary mb-4" onClick={handleSignIn}>{loading ? <TailSpin
                    visible={true}
                    height="23"
                    width="30"
                    color="#FFFFFF"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                /> : "SignIn" }</button>
                <p><Link to="/reset">Forgot password?</Link></p>
                <p>Don't have an account? <Link to='/signup'>Click here</Link> </p>
            </div>

        </div>
    )
}

export default SignIn