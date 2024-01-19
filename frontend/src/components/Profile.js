import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const [profile, setprofile] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            await axios.get('http://localhost:5000/posts/myposts', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setprofile(res.data.myposts)
            })
        }
        fetchProfile();
    }, [])

    const handleEachPost = async (postId) => {
        navigate(`/post/${postId}`)
    }

    const handleEdit = (userId) => {
        navigate(`/${userId}/edit`)
    }

    return (
        <div className='container'>
            {profile.map((user) => {
                return (
                    <div key={user._id}>
                        <div  className='d-flex flex-row align-items-center mt-4'>
                            <img src={user.photo || 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg'} className='img-fluid' style={{ width: "120px", height: "120px", borderRadius: "50%" }} alt="" />
                            <div className='mx-5' style={{ minWidth: "20vw" }}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h3 className=''>{user.name}</h3>
                                    <i onClick={() => { handleEdit(user._id) }} style={{ cursor: "pointer" }} className="fa-solid fa-gear"></i>
                                </div>
                                <p>{user.email}</p>
                                <div className='d-flex justify-content-between'>
                                    <p style={{ fontSize: '100%' }} className='me-2'>{user.posts.length} Posts</p>
                                    <p style={{ fontSize: '100%' }} className='mx-2'>{user.followers.length} Followers</p>
                                    <p style={{ fontSize: '100%' }} className='ms-2'>{user.following.length} Following</p>
                                </div>
                            </div>
                        </div>
                        <hr key={1} className='border border-dark border-1' />
                        <div key={2} className='row'>

                            {user.posts.map((post) => {
                                return (
                                    
                                        <div key={post._id} className='col-lg-3 col-md-4 col-sm-12' onClick={() => { handleEachPost(post._id) }}>
                                            <div className="card d-flex justify-content-center align-items-center image-container my-3 m-auto" style={{ width: "12rem", cursor: "pointer" }}>
                                                <img src={post.photo} className="card-img-top img-fluid zoomed-image" style={{ width: "300px", height: "210px" }} alt="..." />
                                            </div>
                                        </div>
                                    )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Profile
