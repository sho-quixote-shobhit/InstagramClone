import React, { useState, useContext } from 'react'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';


const EditProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [newname, setnewname] = useState(user.name)
    const [photo, setphoto] = useState(null)
    const [photoUrl, setphotoUrl] = useState('')
    const [imgloading, setimgloading] = useState(false)
    const [oldpassword, setoldpassword] = useState('')
    const [newpassword, setnewpassword] = useState('')
    const [confirmnewpass, setconfirmnewpass] = useState('')
    const [showoldpass, setshowoldpass] = useState(false)
    const [shownewpass, setshownewpass] = useState(false)
    const [loading, setloading] = useState(false)
    const [removepp, setremovepp] = useState(false)

    const { dispatch } = useContext(userContext)
    const navigate = useNavigate()
    const handleProfilePic = async (e) => {
        if (!photo) {
            toast('Add an image', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        const formData = new FormData();
        formData.append('key', 'c060d25b69b68bc751a850dde2affec8')
        formData.append('image', photo)
        setimgloading(true)
        await axios.post('https://api.imgbb.com/1/upload', formData, { timeout: 60000 }).then(res => {
            setphotoUrl(res.data.data.url)
        })
        setimgloading(false)
    }

    const handleshownew = () => {
        if (shownewpass) {
            setshownewpass(false);
        } else {
            setshownewpass(true)
        }
    }

    const handleshowold = () => {
        if (showoldpass) {
            setshowoldpass(false)
        } else {
            setshowoldpass(true)
        }
    }

    const handleEdit = async () => {
        setloading(true)
        if (!newname) {
            toast('Username can not be blank!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }

        else if (oldpassword && !newpassword) {
            toast('Enter a new password!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }
        else if (oldpassword && newpassword.length < 8) {
            toast('Password must be 8 characters', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }
        else if(!oldpassword && newpassword){
            toast('Enter the old password!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            setloading(false)
            return;
        }
        else if (newpassword !== confirmnewpass) {
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

        await axios.post('http://localhost:5000/user/editprofile', { newname, newpassword, oldpassword, photoUrl, removepp }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
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
                if (newpassword) {
                    setloading(false)
                    localStorage.clear();
                    dispatch({ type: 'CLEAR' })
                    toast('Password changed!! Signin', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        theme: "light",
                    });
                    navigate('/signin')
                } else {
                    setloading(false)
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    dispatch({ type: "USER", payload: res.data.user })
                    toast('Profile Updated!!', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        theme: "light",
                    });
                    navigate('/profile')
                }

            }
        })
    }
    const handleRemovePp = () => {
        if (removepp) {
            setremovepp(false)
        } else {
            setremovepp(true)
        }
    }

    return (
        <div className='container d-flex flex-column align-items-center'>

            <div className='mt-5' style={{ minWidth: "40vw" }}>
                <h2 className='mb-4 card-title text-center'>Edit Profile</h2>
                <div className="form-outline mb-4">
                    <label className="form-label fw-bold" htmlFor="form2Example1">New UserName</label>
                    <input type="text" className="form-control" value={newname} onChange={(e) => { setnewname(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label fw-bold" >Change Profile Picture</label>
                    <div className='d-flex flex-row'>
                        <input type="file" accept='.jpg, .png, .webp , .jpeg' id="form2Example2" className="form-control" onChange={(e) => { setphoto(e.target.files[0]) }} required />
                        <button disabled={photoUrl || removepp} className='btn btn-success ms-1' onClick={handleProfilePic}>{imgloading ? <TailSpin
                            visible={true}
                            height="15"
                            width="15"
                            color="#FFFFFF"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                        /> : photoUrl ? (
                            <span>&#10003;</span>
                        ) : (
                            "Add"
                        )}</button>
                    </div>
                    <div className="form-check">
                        <input disabled={photoUrl} className="form-check-input" type="checkbox" value="" style={{ cursor: 'pointer' }} onChange={() => { handleRemovePp() }} />
                        <label className={`form-check-label text-${photoUrl ? 'muted' : ''}`}>
                            Remove Current Profile Picture
                        </label>
                    </div>
                    <h5 className='mt-3'>Change Password</h5>
                    <label className="form-label fw-bold" >Old Password</label>
                    <div className="form-outline d-flex flex-row align-items-center">
                        <input type={showoldpass ? 'text' : 'password'} className="form-control" required value={oldpassword} onChange={(e) => { setoldpassword(e.target.value) }} />
                        <i onClick={() => { handleshowold() }} className="fa-regular fa-eye btn btn-secondary ms-1"></i>
                    </div>
                    <p><a href="/reset">Forgot password?</a></p>
                    <label className="form-label fw-bold m-0" >New Password</label>
                    <p style={{ fontSize: '12px' }} className='m-0'>(Minimum 8 characters)</p>
                    <div className="form-outline mb-4  d-flex flex-row align-items-center">
                        <input type={shownewpass ? 'text' : 'password'} className="form-control" required value={newpassword} onChange={(e) => { setnewpassword(e.target.value) }} />
                        <i onClick={() => { handleshownew() }} className="fa-regular fa-eye btn btn-secondary ms-1"></i>
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label fw-bold" >Confirm New Password</label>
                        <input type="password" className="form-control" required value={confirmnewpass} onChange={(e) => { setconfirmnewpass(e.target.value) }} />
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
        </div>
    )
}

export default EditProfile