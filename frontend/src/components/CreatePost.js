import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [imageurl, setimageurl] = useState('')
    const [loading, setloading] = useState(false)
    const [imgloading, setimgloading] = useState(false)

    const navigate = useNavigate();
    const imageUpload = async () => {
        if(!file){
            toast('Add a image', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        const formData = new FormData();
        //cloudinary
        // formData.append('file', file);
        // formData.append('upload_preset', 'instagram')
        // formData.append('cloud_name', 'vipershobhit')
        // setimgloading(true)
        // await axios.post('https://api.cloudinary.com/v1_1/vipershobhit/image/upload', {timeout: 60000} ,  formData).then(res => {
        //     setimageurl(res.data.secure_url)
        // })
        // setimgloading(false)

        //Using imgbb
        formData.append('key' , 'c060d25b69b68bc751a850dde2affec8')
        formData.append('image' , file)
        setimgloading(true)
        await axios.post('https://api.imgbb.com/1/upload', formData , {timeout : 60000}).then(res=>{
            console.log(res.data)
            setimageurl(res.data.data.url)
        })
        setimgloading(false)
    }

    const handleUpload = async () => {
        setloading(true)
        if(!title || !description || !imageurl){
            toast('Please fill all the fields!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        await axios.post(
            'http://localhost:5000/posts/createpost',
            { title, body: description, imageurl },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
            }
        ).then(res => {
            if(res.data.error){
                toast(res.data.error, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "light",
                });
                return;
            }
            toast('New Post Added!!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "light",
            });
            navigate('/')
        })
        setloading(false)
    };

    return (
        <div className='container d-flex justify-content-center'>
            <div className='mt-5' style={{ minWidth: "40vw" }}>
                <h1 className='mb-4 card-title text-center'>New Post</h1>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">Title</label>
                    <input type="text" id="form2Example1" className="form-control" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">Description</label>
                    <textarea rows={5} id="form2Example1" className="form-control" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Add Photo</label>
                    <div className='d-flex flex-row'>
                        <input type="file" accept='.jpg, .png, .webp , .jpeg' id="form2Example2" className="form-control" onChange={(e) => { setFile(e.target.files[0]) }} required />
                        <button disabled={imgloading || imageurl} className='btn btn-success ms-1' onClick={imageUpload}>{imgloading ? <TailSpin
                            visible={true}
                            height="15"
                            width="15"
                            color="#FFFFFF"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                        /> : imageurl ? (
                            <span>&#10003;</span> 
                        ) : (
                            "Add"
                        )}</button>
                    </div>

                </div>

                <button disabled={imageurl.length === 0} type="submit" className="btn btn-success mb-4" onClick={handleUpload}>{loading ? <TailSpin
                    visible={true}
                    height="23"
                    width="30"
                    color="#FFFFFF"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                /> : "Upload"}</button>
            </div>
        </div>
    );
};

export default CreatePost;
