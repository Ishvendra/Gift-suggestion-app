import React from 'react';
import { elastic as Menu } from 'react-burger-menu';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = props => {
  const navigate = useNavigate();
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
        navigate('/login');
        if(!res.status === 200){
            const err = new Error(res.error);
            throw (JSON.stringify(err));
        }
    } catch(err){
        console.log('Error in logging out- ',err);
    }
}

  return (
    <div id="outer-container">
    <Menu right>
    <img id='sidebar-logo' src='https://cdn-icons-png.flaticon.com/512/8635/8635519.png' alt='logo'></img>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/profile">
        Profile
      </a>
      <a className="menu-item" href="/store">
        Store
      </a>
      <a className="menu-item" href="/store">
        Bookmarks
      </a>
      <a className="menu-item" href="/cart">
        Cart
      </a>
      <a className="menu-item" onClick={()=>logout()}>
        Logout
      </a>
    </Menu>
    <main id="page-wrap">
        </main>
    </div>
  );
};

export default Sidebar;