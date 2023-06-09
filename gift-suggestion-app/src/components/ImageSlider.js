import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import '../css/ImageSlider.css';

const ImageSlider = ({images}) => {

const settings = {
	infinite: true,
	dots: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	lazyLoad: true,
	autoplay: true,
    autoplaySpeed: 2000,

};
return (
	<>
        <div className="imgslider">
            <Slider {...settings}>
                    {images.map((item) => (
                        <div key={item}>
                        <img className="slider-image" src={item} alt='product sample' />
                        </div>
                    ))}
            </Slider>
        </div>
	</>
)
}
export default ImageSlider;
