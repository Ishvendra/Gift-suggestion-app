import '../css/Item.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

const Item = ({productDetail, handleOpen, idx}) => {

    const {title, price, description, thumbnail, images, rating, brand, category, discountPercentage, id} = productDetail;
    const originalPrice = Math.trunc((100 * price) / (100 - discountPercentage));
    var titleShort = '';
    if(title.length > 10){
        titleShort = title.substring(0, 8) + "...";
    }else{
        titleShort = title;
    }
    function openModal() {
        handleOpen(productDetail);
    }

    return(
        <>
            <div className='ItemContainer' onClick={()=>openModal()}>
                <div className='heart-container'>
                    <div className='heart-container-2'>
                    <input onClick={e => e.stopPropagation()} type="checkbox" id={idx} className='heart-input'/>
                    <label onClick={e => e.stopPropagation()} htmlFor={idx} className="heart">
                        <i data-icon="🧡"></i>
                    </label>
                    </div>
                </div>
                <img className='productImage' src={thumbnail} alt='product'></img>
                <h2 className='Title'>{titleShort}</h2>
                <p className='Price'>₹{price}</p>
                <p className='Old-price'>₹{originalPrice}</p>
                <p className='Discount'>({Math.trunc(discountPercentage)}% OFF)</p>
                <p className='Rating'>{rating} <FontAwesomeIcon icon={faStar} className='star-icon'/></p>
            </div>
        </>
    )
}

export default Item;