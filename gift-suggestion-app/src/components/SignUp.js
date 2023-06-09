import '../css/SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import indianStates from '../indianStates.json';
const SignUp = () => {

    const navigate = useNavigate();
    const loginPage = () =>{
        navigate('../login',{replace:true})
    }

    const [user, setUser] = useState({
        firstName: '',
        lastName:'',
        email:'',
        password:'',
        dob:'',
        street:'',
        area:'',
        city:'',
        state:'',
        pincode:'',
        phoneNo:''
    })
    const options = indianStates;
    let name, value;

    const handleChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user, [name]:value})
    }

    const registerUser = (e) => {
        e.preventDefault();
        console.log(user);
        const requestOptions = {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({user})
        }
        fetch('/registerUser',requestOptions)
        .then(res=> res.json())
        .then(data=> {
            if(data.error){
                alert(data.error);
            } else {
                alert(data.message);
                loginPage();
            }
        })
        }

    return(
        <>
            <div className='signup-page'>
            <form onSubmit={registerUser}>
                <div className='Signup-container'>
                <div className='Left-signup-container'>
                    <div className='Signup-title'>Profile</div>
                    <div className='Signup-subheading'>Enter your personal information.</div>
                    <br />

                    <div className='First-name'>
                        <label htmlFor='firstName'>First name</label>
                        <br />
                        <input name='firstName' required type='text' id='firstName' placeholder='John' className='signup-input test' autoComplete='off'
                        value={user.firstName}
                        onChange={handleChange}
                        ></input>
                    </div>

                    <div className='Last-name'>
                        <label htmlFor='lastName'>Last name</label>
                        <br />
                        <input name='lastName' type='text' id='lastName' placeholder='Doe' className='signup-input test'
                        value={user.lastName}
                        onChange={handleChange}
                        ></input>
                    </div>

                    <br />
                    <label htmlFor='email' className='Signup-text'>Email</label>
                    <br />
                    <input name='email' required type='text' id='email' placeholder='example@gmail.com' className='General-input-left-signup signup-input'
                    value={user.email}
                    onChange={handleChange}
                    ></input>
                    <br />

                    <label htmlFor='password' className='Signup-text' id='pwd' data-tooltip-content="Enter a combination of atleast 6 numbers and letters.">Password <FontAwesomeIcon icon={faCircleInfo} /></label>
                    <br />
                    <input name='password' required type='password' id='password' placeholder='password' className='General-input-left-signup signup-input'
                    value={user.password}
                    onChange={handleChange}
                    ></input>
                    <Tooltip anchorId="pwd" style={{ backgroundColor: "#fff", color: "black" }} />
                    <br />

                    <label htmlFor='dob' className='Signup-text'>Date of birth</label>
                    <br />
                    <input name='dob' required type="date" id='dob' className='General-input-left-signup signup-input'
                    value={user.dob}
                    onChange={handleChange}
                    ></input>
                    
                    <button className="cta-2" type='submit'>
                        <span>Sign Up</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>
                <div className='Right-signup-container'>
                    <label className=''>Address</label>
                    <br />
                    <input name='street' required type='text' className='General-input-Signup' placeholder='House/street/apartment'
                    value={user.street}
                    onChange={handleChange}
                    ></input>
                    <input name='area' type='text' className='signup-input' placeholder='Sector/area'
                    value={user.area}
                    onChange={handleChange}
                    ></input>
                    <input name='pincode' required type='text' className='signup-input  Address-input-right-signup' placeholder='Pincode'
                    value={user.pincode}
                    onChange={handleChange}
                    ></input>
                    <input name='city' required type='text' className='signup-input' placeholder='City'
                    value={user.city}
                    onChange={handleChange}
                    ></input>
                    <select name='state' required value={user.state} onChange={handleChange} className='signup-input  Address-input-right-signup dropdown-state' placeholder='state'>
                        {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <br />
                    <label htmlFor='phoneNo' className='Signup-text'>Phone number</label>
                    <br />
                    <input name='phoneNo' required type='text' id='phoneNo' className='General-input-Signup'  placeholder='phone number'
                    value={user.phoneNo}
                    onChange={handleChange}
                    ></input>
                </div>
                </div>
            </form>
                <p className='login-text'>Already have an account? <p className='login-link' onClick={loginPage}>Login</p></p>
            </div>
        </>
    )
}
export default SignUp;