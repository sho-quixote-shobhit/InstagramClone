import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userContext } from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Navbar = () => {
    const { state, dispatch } = useContext(userContext)
    const navigate = useNavigate();

    const [show, setShow] = useState(false)

    const [search, setsearch] = useState('')
    const [searchedUsers, setsearchedUsers] = useState([])
    const handleClose = () => {
        setShow(false)
        setsearchedUsers([])
        setsearch('')
    }
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        confirmAlert({
            title: 'Logout!!',
            message: 'Are you sure you want to logout instagram?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmlogout()
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const confirmlogout = () => {
        localStorage.clear();
        dispatch({ type: 'CLEAR' })
        toast('Logged Out Successfully!!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "light",
        });
        navigate('/signin')
    }

    const renderList = () => {
        if (state) {
            return [
                <li key={4} className='d-flex align-items-center mx-1'><i onClick={handleShow} className="fa-solid fa-magnifying-glass btn "></i></li>,
                <li className="nav-item mx-1" key={1}>
                    <Link className="nav-item btn" aria-current="page" to="/profile">My Profile </Link>
                </li>,
                <li className="nav-item  mx-1" key={2}>
                    <Link className="nav-item btn" aria-current="page" to="/create">Create </Link>
                </li>,
                <li className="nav-item mx-1" key={3}>
                    <button className='btn' onClick={handleLogout} >Logout</button>
                </li>
            ]
        } else {
            return [
                <li className="nav-item" key={1}>
                    <Link className="nav-link active" aria-current="page" to="/signup">SignUp </Link>
                </li>,
                <li className="nav-item" key={2}>
                    <Link className="nav-link active" aria-current="page" to="/signin">SignIn </Link>
                </li>
            ]
        }
    }

    const handlesearch = async () => {
        axios.post('http://localhost:5000/user/getusers', { search }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            setsearchedUsers(res.data.users)
        })
    }

    const handleProfile = (userId) => {
        setShow(false)
        setsearch('')
        setsearchedUsers([])
        navigate(`/users/${userId}`)
    }

    return (
        <>
            {/* modal for searching */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Search for users </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="form-outline mb-4">
                        <input placeholder='search here' type="email" className="form-control" value={search} onChange={(e) => { setsearch(e.target.value) }} />
                    </div>
                    {searchedUsers.length > 0 && <p className='fw-bold' style={{ fontSize: "14px" }}>Results</p>}
                    {searchedUsers.map((user) => {
                        return (
                            <div key={user._id}>
                                <ul>
                                    <div className='p-2' style={{ border: "1px solid black", borderRadius: "10px", cursor: "pointer" }} onClick={() => { handleProfile(user._id) }}>
                                        <li style={{ listStyleType: "none" }}>{user.name}</li>
                                        <p className='p-0 m-0' style={{ fontSize: "12px" }} >{user.email}</p>
                                    </div>
                                </ul>
                            </div>
                        )
                    })}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlesearch}>
                        Search
                    </Button>
                </Modal.Footer>
            </Modal>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand" to={state ? "/" : "/signin"}>Instagram</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">
                        </div>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {renderList()}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
