import { BrowserRouter, Routes, Route, useNavigate , useLocation } from 'react-router-dom'
import React, { useEffect, createContext, useReducer , useContext } from 'react'
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import SinglePost from './components/SinglePost';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import Reset from './components/Reset';
import ResetPassword from './components/ResetPassword';
import { reducer, initialState } from './reducers/userReducer'

export const userContext = createContext();

const Routing = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const {dispatch} = useContext(userContext)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({type : "USER" , payload : user})
        } else {
            if(!location.pathname.startsWith('/reset'))
                navigate('/signin')
        }
    } , [])

    return (
        <>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/signin" element={<SignIn />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/create" element={<CreatePost />} />
                <Route exact path="/post/:postId" element={<SinglePost />}/>
                <Route exact path="/users/:userId" element={<UserProfile />}/>
                <Route exact path="/:userId/edit" element={<EditProfile />}/>
                <Route exact path="/reset" element={<Reset />} />
                <Route exact path="/reset/:token" element={<ResetPassword />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                theme="light"
            />
        </>
    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <div className=''>
            <userContext.Provider value = {{state , dispatch}}>
                <BrowserRouter>
                    <Navbar />
                    <Routing />
                </BrowserRouter>
            </userContext.Provider>
        </div>
    );
}

export default App;
