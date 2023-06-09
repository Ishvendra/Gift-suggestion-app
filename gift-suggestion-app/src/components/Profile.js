import '../css/Profile.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import UpdatePasswordModal from './UpdatePasswordModal';
import indianStates from '../indianStates.json';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const Profile = () => {
    
    const [profileDeets, setProfileDeets] = useState({
        _id: '', 
        firstName: '',
        lastName:'',
        email:'',
        dob:'',
        address: {
            street:'',
            area:'',
            city:'',
            state:'',
            pincode:''
        },
        phoneNo:'',
        profilePic:''});

    const [updatePasswordModal, setUpdatePasswordModal] = useState(false);

    const [file, setFile] = useState();
    const [fileDataURL, setFileDataURL] = useState(null);

    let name, value;
    const handleChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        console.log('value on handle change- ',e.target.value);
        if(name == 'area' || name == 'city' || name == 'state' || name == 'pincode' || name == 'street'){
            setProfileDeets({...profileDeets, address: {...profileDeets.address, [name]:value}})
        } else {
            setProfileDeets({...profileDeets, [name]:value})
        }
        console.log('state- ',profileDeets)
    }

    const updateUserDetails = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'PATCH',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({profileDeets})
        }
        fetch('/updateUserDetails',requestOptions)
        .then(res=> res.json())
        .then(data=> {
            if(data.error){
                alert(data.error);
            } else {
                alert(data.message);
            }
        })
        }
    const navigate = useNavigate();
    const options = indianStates;
    
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
            setProfileDeets(data);
            console.log('profile login data- ',data);
        } catch(err){
            console.log('Error in fetching user details- ',err);
            navigate('/login');
        }
    }

    const openUpdatePasswordModal = () => {
        setUpdatePasswordModal(true);
    }

    const handleClose = () => {
        setUpdatePasswordModal(false);
    }

    //profile picture
    const handleFileChange = (e) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
    };
    
    const handleUploadClick = () => {
        if (!file) {
            alert("Select a picture to upload");
            return;
        }
        const formData = new FormData();
        formData.append('firstName', profileDeets.firstName);
        formData.append('testImage', file);

        const requestOptions = {
            method: 'POST',
            body: formData
        }
        fetch('/uploadImg',requestOptions)
        .then(res=> res.json())
        .then(data=> {
            if(data.error){
                console.log('error msg- ', data);
                alert("Error: "+ data.error.message);
            } else {
                console.log('success msg', data);
                alert(data.message);
            }
        })
    };

    useEffect(() => {
        getProfileData();
        let fileReader, isCancel = false;
        if (file) {
          fileReader = new FileReader();
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result && !isCancel) {
              setFileDataURL(result)
            }
          }
          fileReader.readAsDataURL(file);
        }
        return () => {
          isCancel = true;
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
        }
    
    }, [file]);
    
    return (
        <><form onSubmit={updateUserDetails}>
            <div className='Profile-container'>
                
                <div className='Left-profile-container'>
                    <div className='Profile-title'>Profile</div>
                    <div className='Profile-text'>Update your personal information.</div>
                    <br />
                    <div className='First-name'>
                        <label>First name</label>
                        <br />
                        <input className='Name-input-left' 
                        name='firstName'
                        value={profileDeets.firstName}
                        onChange={handleChange}></input>
                    </div>
                    <div className='Last-name'>
                        <label>Last name</label>
                        <br />
                        <input placeholder='Doe' className='Name-input-left'
                        name='lastName'
                        value={profileDeets.lastName}
                        onChange={handleChange}></input>
                    </div>
                    <label className='Profile-text'>Email</label>
                    <br />
                    <input placeholder='example@gmail.com' className='General-input-left' 
                    value={profileDeets.email}
                    name='email'
                    onChange={handleChange}></input>
                    <br />
                    <label className='Profile-text'>Date of birth</label>
                    <br />
                    <input type="date" value={profileDeets.dob.slice(0,10)} className='General-input-left'
                    name='dob'
                    onChange={handleChange}></input>
                    <input type='button' className='pwd-btn' onClick={()=>openUpdatePasswordModal()} value='Change password'></input>
                    
                    <button className='Profile-submit-btn' type='submit'>Submit</button>
                </div>
                <div className='Right-profile-container'>
                    <label className='Profile-text Address'>Address</label>
                    <br />
                    <input className='General-input' placeholder='Street/apartment' 
                    value={profileDeets.address.street}
                    name='street'
                    onChange={handleChange}></input>
                    <input className='Name-input' placeholder='Sector/area' 
                    value={profileDeets.address.area}
                    name='area'
                    onChange={handleChange}></input>
                    <input className='Name-input Address-input-right' type="number" placeholder='Pincode' 
                    value={profileDeets.address.pincode}
                    name='pincode'
                    onChange={handleChange}></input>
                    <input className='Name-input' placeholder='City' 
                    value={profileDeets.address.city}
                    name='city'
                    onChange={handleChange}></input>
                    <select name='state' required className='State-input' value={profileDeets.address.state} onChange={handleChange}>
                        {options.map((option, key) => (
                            <option key={key} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label className='Profile-text'>Phone number</label>
                    <br />
                    <input className='General-input'  placeholder='1234567890'type='number' 
                    value={profileDeets.phoneNo}
                    name='phoneNo'
                    onChange={handleChange}></input>
                </div>
            </div>
            <label htmlFor='profile-picture' className='profile-pic-text' id='dp' data-tooltip-content="Upload pic in jpg or png format. Size less than 1mb.">Profile picture <FontAwesomeIcon icon={faCircleInfo} /></label>
            <Tooltip anchorId="dp" style={{ backgroundColor: "#fff", color: "black" }} />
            <div className='picture-container'>
                {fileDataURL?
                <img src={fileDataURL} alt='preview' className='picture-preview'></img>:
                <FontAwesomeIcon icon={faUser} className="profile-picture-icon"/>}
            </div>
            <input type='file' accept="image/*" className='upload-pic-btn' name='profile-picture' id='profile-picture' onChange={handleFileChange}></input>
            <input type='button' className='upload-pic-save-btn' onClick={handleUploadClick} value='Save'></input>
            </form>
            {updatePasswordModal?<UpdatePasswordModal handleClose={()=>handleClose()} />:''}
        </>
    );
}

export default Profile;