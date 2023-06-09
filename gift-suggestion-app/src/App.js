import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar.js';
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import Store from './components/Store';
import Notfound from './components/Notfound';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Cart from './components/Cart';
import { useState,useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [criteria, setCriteria] = useState([0,100,undefined]);
  const [loggenIn, setLoggedIn] = useState();
  const criteriaValues = (slider1, slider2, gender) => {
    setCriteria([slider1, slider2, gender]);
  }  
  console.log('test- ',userImage);

  const loggedInUser = (data) => {
    console.log('test- ',userImage);
    setLoggedIn(data);
    getProfileData();
  }

  const getProfileData = async () => {
    try{
        const requestOptions = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include"
        }
        const res = await fetch('/getProfileDetails',requestOptions);
        if(res.status != 200){
            const err = new Error(res.error);
            throw (JSON.stringify(err));
        }
        const data = await res.json();
        // const convertedImg = data.profileImage.data.data.toString('base64');
        const base64string = btoa(String.fromCharCode(...new Uint8Array(data.profileImage.data.data)));
        setUserImage(base64string);
        console.log('App: image data- ',data.profileImage.data.data);
    } catch(err){
        console.log('Error in fetching user image- ',err);
        navigate('/login');
    }
  }

  return (
    <div className="App">
      
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <Navbar loggenIn={loggenIn}/>  
      <div className="main-content">
      {
        userImage?
        <div className="pic-container">
            <img className="homepage-picture" src={`data:image/jpeg;base64,${userImage}`} alt='homepage-picture'></img>
        </div>
        :<></>
      }
        <div className='Logo' onClick={()=>{navigate('/')}}>
          Gift Suggestions
          <img className='Logo-img' src='https://cdn-icons-png.flaticon.com/512/8635/8635519.png' alt='logo'></img>
        </div>
        <div className='Header'>
        </div>
      </div>
      
       <Routes>
          <Route path="/" element={<Homepage setCriteria={criteriaValues} loggedInUser={loggedInUser}/>} />
          <Route path="store" element={<Store criteria={criteria}/>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
    </div>  
  );
}

export default App;
