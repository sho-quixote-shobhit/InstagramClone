import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { BallTriangle } from 'react-loader-spinner'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Home = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const { state, dispatch } = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {

            setloading(true)
            await axios.get('http://localhost:5000/posts/allposts', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }

            }).then(res => {
                setdata(res.data.allposts)
            })
            setloading(false)
        }
        fetchData();
    }, [])

    const handleTime = (createdAt) => {
        createdAt = new Date(createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const secondsDifference = Math.floor(timeDifference / 1000);

        const minutes = Math.floor(secondsDifference / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return createdAt.toDateString()
        }
        else if (days > 0) {
            return days + ' days ago'
        } else if (hours > 0) {
            return hours + ' hours ago'
        } else if (minutes > 0) {
            return minutes + ' minutes ago'
        } else {
            return secondsDifference + ' seconds ago'
        }
    }

    const likePost = async (postId) => {
        if (state.likedPosts.includes(postId)) {
            toast('Already liked!!', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        } else {
            await axios.put('http://localhost:5000/posts/like', { postId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                console.log('hi' + res.data)
                const newData = data.map(item => {
                    if (item._id === res.data.post._id) {
                        return res.data.post
                    } else {
                        return item
                    }
                })
                setdata(newData)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                dispatch({ type: "USER", payload: res.data.user })
                toast('Liked', {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
            })
        }
    }

    const unlikePost = async (postId) => {
        if (state.likedPosts.includes(postId)) {
            await axios.put('http://localhost:5000/posts/unlike', { postId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                const newData = data.map(item => {
                    if (item._id === res.data.post._id) {
                        return res.data.post
                    } else {
                        return item
                    }
                })
                setdata(newData)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                dispatch({ type: "USER", payload: res.data.user })
                toast('UnLiked', {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
            })

        }
    }

    const makecomment = async (e, postId) => {
        e.preventDefault();
        const text = e.target[0].value
        await axios.put('http://localhost:5000/posts/comment', { text, postId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            const newData = data.map(item => {
                if (item._id === res.data.post._id) {
                    return res.data.post
                } else {
                    return item
                }
            })
            setdata(newData)
        })
    }

    const handleDelete = (postId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDelete(postId)
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const confirmDelete = async (postId) => {
        await axios.delete(`http://localhost:5000/posts/delete/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            const newData = data.filter(item =>
                item._id !== res.data.post._id
            );
            setdata(newData);
            toast('Post Deleted!!', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
        });
    };

    const handleProfile = async (userId) => {
        if (state._id === userId) {
            navigate('/profile')
        } else {
            navigate(`/users/${userId}`)
        }
    }

    const handleFollows = async (userId) => {
        if (!state.following.includes(userId)) {
            await axios.put('http://localhost:5000/user/follow', { userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                dispatch({ type: "USER", payload: res.data.user })
            })
        } else {
            await axios.put('http://localhost:5000/user/unfollow', { userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                dispatch({ type: "USER", payload: res.data.user })
            })
        }
    }

    return (
        <>
            <div className='d-flex justify-content-center'>

                {loading && <BallTriangle
                    height={100}
                    width={100}
                    radius={5}
                    color="#4fa94d"
                    ariaLabel="ball-triangle-loading"
                    visible={true}
                />}
            </div>
            <div className='container d-flex flex-column justify-content-center align-items-center'>
                {data.map((post) => {
                    return (
                        <div className="card my-5 home-posts" key={post._id}>
                            <div className='d-flex flex-row justify-content-between align-items-center' >
                                <h4 onClick={() => { handleProfile(post.postedBy._id) }} style={{ cursor: 'pointer' }} className='ms-1 mt-1'>{post.postedBy.name}</h4>
                                {state._id === post.postedBy._id && <i style={{ cursor: 'pointer' }} onClick={() => { handleDelete(post._id) }} className="fa-solid fa-trash me-1"></i>}
                                {state._id !== post.postedBy._id && <button className={`btn-${state.following.includes(post.postedBy._id) ? 'danger' : 'success'} btn  p-0 px-1 me-1`} onClick={() => { handleFollows(post.postedBy._id) }}>{state.following.includes(post.postedBy._id) ? 'Unfollow' : 'Follow'}</button>}

                            </div>
                            <img src={post.photo} style={{ maxHeight: "600px" }} className="card-img-top" alt="post" />
                            <h6 className='mt-2 ms-1'>
                                {post.likes.length} &nbsp;
                                <i
                                    style={{ color: "red", fontSize: "15px" }}
                                    className='fa-heart fa-solid'
                                ></i>
                                <i onClick={() => { likePost(post._id) }} style={{ cursor: 'pointer' }} className={`text-${state.likedPosts.includes(post._id) ? 'muted' : ''} fa-regular ms-3 fa-thumbs-up`}></i>
                                <i onClick={() => { unlikePost(post._id) }} style={{ cursor: 'pointer' }} className="fa-regular mx-2 fa-thumbs-down"></i>

                            </h6>
                            <h5 className="card-title ms-1 m-1">{post.title}</h5>
                            <p className="card-text text-muted ms-1 m-1" style={{ fontSize: "15px" }}>{post.body}</p>
                            <p className='ms-1 m-0 text-muted' style={{ fontSize: "15px" }}>{handleTime(post.createdAt)}</p>

                            <form className='d-flex ms-1' onSubmit={(e) => { makecomment(e, post._id) }}>
                                <input className="form-control " type="text" placeholder='Leave a comment' />
                                <button className='btn btn-primary ms-1' type='submit'> <i className="fa-solid fa-arrow-right"></i></button>
                            </form>
                            <p key={7} className='ms-1 mb-0 mt-2 fw-bold' style={{ fontSize: "14px" }}>{post.comments.length} Comments</p>
                            {post.comments.map((comment) => {
                                return (
                                    <div key={comment._id} className='d-flex flex-row'>
                                        <p className='ms-1 p-0 m-0' style={{ fontSize: '12px', fontWeight: 'bold' }}>@{comment.createdBy.name} <span className='text-muted'>{comment.text}</span></p>
                                    </div>
                                )
                            })}

                        </div>
                    )
                })}

            </div>
        </>
    );
};

export default Home;