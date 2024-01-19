import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { userContext } from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const SinglePost = () => {
    const { postId } = useParams();
    const [post, setpost] = useState([])
    const { state, dispatch } = useContext(userContext)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchPost = async () => {
            await axios.post('http://localhost:5000/posts/one', { postId }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            }).then(res => {
                setpost(res.data.post)
            })
        }
        fetchPost();
    }, [postId])

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
                console.log(res.data)
                const newData = post.map(item => {
                    if (item._id === res.data.post._id) {
                        return res.data.post
                    } else {
                        return item
                    }
                })
                setpost(newData)
                localStorage.setItem('user' , JSON.stringify(res.data.user))
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
                console.log(res.data)
                const newData = post.map(item => {
                    if (item._id === res.data.post._id) {
                        return res.data.post
                    } else {
                        return item
                    }
                })
                setpost(newData)
                localStorage.setItem('user' , JSON.stringify(res.data.user))
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

    const makecomment = async (e, postId) => {
        e.preventDefault();
        const text = e.target[0].value
        await axios.put('http://localhost:5000/posts/comment', { text, postId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => {
            console.log(res.data)
            const newData = post.map(item => {
                if (item._id === res.data.post._id) {
                    return res.data.post
                } else {
                    return item
                }
            })
            setpost(newData)
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
            const newData = post.filter(item =>
                item._id !== res.data.post._id
            );
            setpost(newData);
            toast('Post Deleted!!', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            navigate('/profile')
        });
    };

    return (
        <div className='container d-flex flex-column justify-content-center align-items-center'>
            {post.map((post) => {
                return (
                    <div className="card my-5 home-posts" key={post._id}>
                        <div className='d-flex flex-row justify-content-between align-items-center' >
                            <h4 className='ms-1 mt-1'>{post.postedBy.name}</h4>
                            {state._id === post.postedBy._id && <i style={{ cursor: 'pointer' }} onClick={() => { handleDelete(post._id) }} className="fa-solid fa-trash me-1"></i>}
                        </div>
                        <img src={post.photo} style={{ maxHeight: "600px" }} className="card-img-top" alt="post" />
                        <h6 className='mt-2 ms-1'>
                            {post.likes.length} &nbsp;
                            <i
                                style={{ color: "red", fontSize: "15px" }}
                                className='fa-heart fa-solid'
                            ></i>
                            <i onClick={() => { likePost(post._id) }} style={{ cursor: 'pointer' }} className={`text-${state.likedPosts.includes(postId) ? 'muted' : ''} fa-regular ms-3 fa-thumbs-up`}></i>
                            <i onClick={() => { unlikePost(post._id) }} style={{ cursor: 'pointer' }} className="fa-regular mx-2 fa-thumbs-down"></i>
                        </h6>
                        <h5 className="card-title ms-1 m-1">{post.title}</h5>
                        <p className="card-text text-muted ms-1 m-1" style={{ fontSize: "15px" }}>{post.body}</p>
                        <p className='ms-1 m-0 text-muted' style={{ fontSize: "15px" }}>{handleTime(post.createdAt)}</p>

                        <form className='d-flex ms-1 mt-3 ' onSubmit={(e) => { makecomment(e, post._id) }}>
                            <input className="form-control " type="text" placeholder='Leave a comment' />
                            <button className='btn btn-primary ms-1' type='submit'> <i className="fa-solid fa-arrow-right"></i></button>
                        </form>
                        <p className='ms-1 mb-0 mt-2 fw-bold' style={{ fontSize: "14px" }}>{post.comments.length} Comments</p>
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
    )
}

export default SinglePost
