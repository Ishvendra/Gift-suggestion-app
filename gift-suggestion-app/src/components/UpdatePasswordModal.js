import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../css/UpdatePasswordModal.css';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    minHeight: '350px',
    backgroundColor: '#121214',
    color: '#d3d3d3',
    textAlign: 'center',
    alignContent: 'center',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 0px 8px 0 rgb(0, 0, 0), 0 0px 25px 0 rgb(0, 0, 0)',
  },overlay: {
    background: "rgb(0,0,0,0.9)"
  }
};

function UpdatePasswordModal({ handleClose }) {

  function closeModal() {
    handleClose(false);
  }

  const [password, setPassword] = useState({current:'', newPassword:'', confirmedNew:''});
  var name, value;

  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;
    setPassword({...password, [name]:value});
    console.log(password)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(password.new == password.confirmedNew){

      const requestOptions = {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({password})
      }

      fetch('/updatePassword', requestOptions)
      .then(res=>res.json())
      .then(data=>{})

    } else {
      alert("New password and confirmed password do not match!")
    }
  }

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Product Modal"
        appElement={document.getElementById('root') || undefined}
      >
        <div>
            <button id='pwd-modal-close-btn' onClick={closeModal}>X</button>
            <h2 id='pwd-modal-title'>Update your password</h2>
            <br />
            <div className='pwd-modal-container'>
                <form onSubmit={handleSubmit}>
                    <label className='pwd-modal-label'>Current password</label>
                    <br />
                    <input className='pwd-modal-input' required type='password'  name='current' value={password.current} onChange={handleChange} />
                    <br />
                    <label id='pwd' className='pwd-modal-label' data-tooltip-content="Enter a combination of atleast 6 numbers and letters.">New password <FontAwesomeIcon icon={faCircleInfo} /></label>
                    <Tooltip anchorId="pwd" style={{ backgroundColor: "#fff", color: "black" }} />
                    <br />
                    <input className='pwd-modal-input' required type='password' name='newPassword' value={password.newPassword} onChange={handleChange} />
                    <br />
                    <label className='pwd-modal-label'>Confirm new password</label>
                    <br />
                    <input className='pwd-modal-input' required type='password'  name='confirmedNew' value={password.confirmedNew} onChange={handleChange} />
                    <br />
                    <button id='pwd-modal-btn' type='submit'>Save</button>
                </form>
            </div>
            
            
        </div>
        
      </Modal>
    </div>
  );
}

export default UpdatePasswordModal;