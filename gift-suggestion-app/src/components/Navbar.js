import '../css/Navbar.css';
import SearchBar from './Searchbar'
import { useNavigate, useSubmit } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCartShopping, faRightFromBracket, faGift, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useState, useEffect } from 'react';

function Navbar ({loggenIn}) {
    const navigate = useNavigate();
    const [usernameNav, setUsernameNav] = useState('User');
    
    const getUsername = async () => {
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
            setUsernameNav(data.firstName);
        } catch(err){
            console.log('Error in fetching username for navbar- ',err);
        }
    }

    const logout = async () => {
        try{
            const requestOptions = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }
            const res = await fetch('/logout',requestOptions);
            const data = await res.json();
            console.log(data);
            setUsernameNav('User');
            navigate('/login');
            if(!res.status === 200){
                const err = new Error(res.error);
                throw (JSON.stringify(err));
            }
        } catch(err){
            console.log('Error in logging out- ',err);
        }
    }

    useEffect(()=>{
        getUsername();
    })

    return (
        <>
            <div className='Navbar-body'>
                <FontAwesomeIcon icon={faUser} id="profile-icon" data-tooltip-content='Profile' className='Navbar-icons' onClick={() => navigate("profile", { replace: true })}/>
                <Tooltip anchorId="profile-icon" style={{ backgroundColor: "#fd625d", color: "#fff" }} />
                <FontAwesomeIcon icon={faGift} id="store-icon" data-tooltip-content="Store" className='Navbar-icons' onClick={() => navigate("store", { replace: true })}/>
                <Tooltip anchorId="store-icon" style={{ backgroundColor: "#fd625d", color: "#fff" }} />
                <FontAwesomeIcon icon={faCartShopping} id="cart-icon" data-tooltip-content="Cart" className='Navbar-icons' onClick={() => navigate("cart", { replace: true })}/>
                <Tooltip anchorId="cart-icon" style={{ backgroundColor: "#fd625d", color: "#fff" }} />
                <FontAwesomeIcon icon={faBookmark} id="bookmark-icon" data-tooltip-content="Bookmarks" className='Navbar-icons' onClick={() => navigate("cart", { replace: true })}/>
                <Tooltip anchorId="bookmark-icon" style={{ backgroundColor: "#fd625d", color: "#fff" }} />
                <FontAwesomeIcon icon={faRightFromBracket} id="logout-icon" data-tooltip-content="Logout" className='Navbar-icons' onClick={()=>logout()}/>
                <Tooltip anchorId="logout-icon" style={{ backgroundColor: "#fd625d", color: "#fff" }} />
                <span id='searchbar'><SearchBar/></span>
                <p id='hello-title'>Hello, {usernameNav}</p>  
            </div>
            
        </>
    );
}

export default Navbar; 