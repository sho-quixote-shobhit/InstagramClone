import React, { useEffect, useState , useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userContext } from '../App'

const UserProfile = () => {
    const { userId } = useParams();
    const [profile, setprofile] = useState([])
    const {state , dispatch} = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            await axios.get(`http://localhost:5000/user/${userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setprofile(res.data.profile)
            })
        }
        fetchProfile();
    }, [userId])

    const handleEachPost = async (postId) => {
        navigate(`/post/${postId}`)
    }

    const handleFollows = async(userId)=>{
        if(!state.following.includes(userId)){
            await axios.put('http://localhost:5000/user/follow' , {userId} , {headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem('jwt')
            }}).then(res => {
                localStorage.setItem('user' , JSON.stringify(res.data.user))
                dispatch({type : "USER" , payload : res.data.user})
            })
        }else{
            await axios.put('http://localhost:5000/user/unfollow' , {userId} , {headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem('jwt')
            }}).then(res => {
                localStorage.setItem('user' , JSON.stringify(res.data.user))
                dispatch({type : "USER" , payload : res.data.user})
            })
        }
    }

    return (
        <div className='container'>
            {profile.map((user) => {
                return (
                    <>
                        <div className='d-flex flex-row align-items-center'>
                            <img src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg" style={{ maxWidth: "15vw", maxHeight: "20vh" }} alt="" />
                            <div className='mx-5' style={{ minWidth: "20vw" }}>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h3 className=''>{user.name}</h3>

                                </div>

                                <div className='d-flex justify-content-between'>
                                    <p className='me-2'>{user.posts.length} Posts</p>
                                    <p className='mx-2'>{user.followers.length} Followers</p>
                                    <p className='ms-2'>{user.following.length} Following</p>
                                </div>
                                {state._id !== user._id && <button className = {`btn-${state.following.includes(user._id) ? 'danger' : 'success'} btn  p-0 px-1 me-1`} onClick={()=>{handleFollows(user._id)}}>{state.following.includes( user._id) ? 'Unfollow' : 'Follow'}</button>}
                            </div>
                        </div>
                        <hr className='border border-dark border-1' />
                        <div className='row'>

                            {user.posts.map((post) => {
                                return (
                                    <>
                                        <div key={post._id} className='col-lg-3 col-md-4 col-sm-12' onClick={() => { handleEachPost(post._id) }}>
                                            <div key={post._id} className="card d-flex justify-content-center align-items-center image-container my-3 m-auto" style={{ width: "12rem", cursor: "pointer" }}>
                                                <img src={post.photo} className="card-img-top img-fluid zoomed-image" style={{ width: "300px", height: "210px" }} alt="..." />
                                            </div>
                                        </div>
                                    </>)
                            })}
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default UserProfile