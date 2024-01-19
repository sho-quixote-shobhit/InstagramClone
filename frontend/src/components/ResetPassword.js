import React, { useState  } from 'react'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate , useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [newpassword, setnewpassword] = useState('')
    const [confirmnewpass, setconfirmnewpass] = useState('')
    const [shownewpass, setshownewpass] = useState(false)
    const [loading, setloading] = useState(false)
    const {token} = useParams()

    const navigate = useNavigate()
    const handleshownew = () => {
        if (shownewpass) {
            setshownewpass(false);
        } else {
            setshownewpass(true)
        }
    }

    const handleEdit = async () => {
        setloading(true)
        if (newpassword !== confirmnewpass) {
            toast('Passwords do not match!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }

        await axios.post('http://localhost:5000/auth/newpassword', { newpassword , token }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.data.error) {
                toast(res.data.error, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
                setloading(false)
                return;
            } else {
                toast('Password Changed!!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
                setloading(false)
                navigate('/signin')
            }
        })
    }

    return (
        <div className='container d-flex flex-column align-items-center'>

            <div className='mt-5' style={{ minWidth: "40vw" }}>
                    <label className="form-label fw-bold m-0" >New Password</label>
                    <p style={{ fontSize: '12px' }} className='m-0'>(Minimum 8 characters)</p>
                    <div className="form-outline mb-4  d-flex flex-row align-items-center">
                        <input type={shownewpass ? 'text' : 'password'}  className="form-control" required value={newpassword} onChange={(e) => { setnewpassword(e.target.value) }} />
                        <i onClick={() => { handleshownew() }} className="fa-regular fa-eye btn btn-secondary ms-1"></i>
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label fw-bold" >Confirm New Password</label>
                        <input type="password"  className="form-control" required value={confirmnewpass} onChange={(e) => { setconfirmnewpass(e.target.value) }} />
                    </div>
                    {loading ? <TailSpin
                        visible={true}
                        height="20"
                        width="20"
                        color="#000000"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                    /> : <button onClick={() => { handleEdit() }} className='btn btn-primary'>Update</button>}
            </div>
        </div>
    )
}

export default ResetPassword