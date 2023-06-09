import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import '../css/Slider.css'

function Slider({lowerRange,upperRange}) {

    const handleChange = (e) => {
        lowerRange(e[0]);
        upperRange(e[1]);
    }

    return (
        <>
        <RangeSlider defaultValue={[0,100]} id="range-slider-gradient" onInput={(e)=>{handleChange(e)}}/>
        </>
    );
}

export default Slider;