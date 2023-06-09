import '../css/Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });

    let name, value;

    const handleChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user, [name]:value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({user})
        }
        fetch('/loginUser',requestOptions)
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                alert(data.error)
            } else {
                // alert(data.message);
                navigate('/',{replace:true});
            }
        })
    }

    const signupPage = () => {
        navigate('../signup',{replace:true});
    }

    return (
        <>
        <div className='login-page'>
            <form onSubmit={handleSubmit}>
                <FontAwesomeIcon icon={faUser} className="login-icons"/>
                <input required name='email' placeholder='username' className='login-input' value={user.email} onChange={handleChange}></input>
                <br/>
                <FontAwesomeIcon icon={faKey} className="login-icons"/>
                <input required name='password' placeholder='password' type="password" className='login-input' value={user.password} onChange={handleChange}></input>
                <br/>
                <button className="cta" type='submit'>
                <span>Login</span>
                <svg width="13px" height="10px" viewBox="0 0 13 10">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
                </button>
            </form>
            <p id='signup-text'>Don't have an account? <p id='signup-link' onClick={signupPage}>Sign Up</p></p>
        </div>
        </>
    )
}

export default Login;