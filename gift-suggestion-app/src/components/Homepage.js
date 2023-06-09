import '../css/Homepage.css';
import Slider from './Slider.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVenus, faMars } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Homepage = ({setCriteria, loggedInUser}) => {
    const navigate = useNavigate();
    const [maleToggle, setMaleToggle] = useState(false);
    const [femaleToggle, setFemaleToggle] = useState(false);
    const [lowerRange, setLowerRange] = useState(0);
    const [upperRange, setUpperRange] = useState(100);
    const gender = '';
    console.log('from homepage- ',lowerRange,upperRange);

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
            // const data = await res.json();
            loggedInUser(true);
        } catch(err){
            console.log('Error in fetching user details- ',err);
            loggedInUser(false);
        }
    }

    useEffect(()=>{
        getProfileData();
    },[])

    const handleFemale = () => {
        var elt = document.getElementById("female");
        setMaleToggle(false);
        setFemaleToggle(!femaleToggle);
        if(femaleToggle){
            // elt.style.setProperty("-webkit-filter", "drop-shadow(0 0 10px #ff004b)");
            elt.style.borderBottom = "2px solid white";
            document.getElementById("male").style.borderBottom = "none";
            console.log("true")
        }else{
            // elt.style.setProperty("-webkit-filter", "none");
            elt.style.borderBottom = "none";
            console.log("false");
        }
    }

    const handleMale = () => {
        setFemaleToggle(false);
        setMaleToggle(!maleToggle);
        var elt = document.getElementById("male");
        if(maleToggle){
            // elt.style.setProperty("-webkit-filter", "drop-shadow(0 0 10px #0082ff)");
            elt.style.borderBottom = "2px solid white";
            document.getElementById("female").style.borderBottom = "none";
        } else{
            // elt.style.setProperty("-webkit-filter", "none");
            elt.style.borderBottom = "none";
        }
    }

    const handleSubmit = () => {
        setCriteria(lowerRange, upperRange, gender);
        navigate("store", { replace: true });
    }

    return(
        <>
            <div className='Outer-container'>
                <span className='Left-container'>
                    <p className='Left-container-content'>Age:</p>
                    <br />
                    <p className='Left-container-content'>Gender:</p>
                </span>
                <span className='Right-container'>
                    <div className='slider'>
                        <Slider lowerRange={setLowerRange} upperRange={setUpperRange}/>
                        <p id='marking'>{lowerRange}{upperRange?'-':''}{upperRange}{upperRange===100?'+':''}</p>
                        <p id='emoji1'>{lowerRange<10?'👶':lowerRange<20?'🧒':lowerRange<60?'👨':lowerRange<101?'👴':''}</p>
                        <p id='emoji2'>{upperRange<10?'👶':upperRange<20?'🧒':upperRange<60?'👨':upperRange<101?'👴':''}</p>
                        
                    </div>
                    <div className='genders'>
                        <FontAwesomeIcon onClick={()=>handleFemale()} icon={faVenus} className='Gender-icons' id='female'/>
                        <FontAwesomeIcon onClick={()=>handleMale()} icon={faMars} className='Gender-icons' id='male'/>
                    </div>
                </span>
            </div>
            <button 
            id='find-gift-btn'
            onClick={handleSubmit}
            >Find Gifts</button>
        </>
    )
}

export default Homepage;