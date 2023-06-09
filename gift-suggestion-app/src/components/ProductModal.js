import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../css/ProductModal.css';
import ImageSlider from './ImageSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    minHeight: '400px',
    backgroundColor: '#121214',
    color: '#d3d3d3',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 0px 8px 0 rgb(0, 0, 0), 0 0px 25px 0 rgb(0, 0, 0)',
  },overlay: {
    background: "rgb(0,0,0,0.9)"
  }
};

function ProductModal({open, modalClose, productDetail}) {

  const {description, images, title, price, rating, brand, category, discountPercentage, id} = productDetail;
  const [productInCart, setProductInCart] = useState(false);
  function closeModal() {
    modalClose(false);
  }

  function addToCart(){
    const requestOptions = {
      method: "PUT",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({id})
    }
    fetch('/addItemToCart',requestOptions)
    .then(res=>res.json())
    .then(data=>console.log(data));
    setProductInCart(true);
  }

  function removeFromCart(){
    const requestOptions = {
      method: "PUT",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({id})
    }
    fetch('/deleteItemFromCart',requestOptions)
    .then(console.log('trigged'));
    setProductInCart(false)
  }

  useEffect(()=>{
    // const requestOptions = {
    //   method: 'PUT',    
    //   headers:  { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({id})
    // }
    // fetch('/findItemInCart',requestOptions)
    // .then(res => res.json())
    // .then(product => {
    //   if(Object.values(product)[0].length == 1){
    //     setProductInCart(true);
    //   }
    // });
  },[])

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Product Modal"
        appElement={document.getElementById('root') || undefined}
      >
        <button className='Close-btn' onClick={closeModal}>X</button>
        {productInCart ? <>
        <FontAwesomeIcon id="remove-cart-tooltip" data-tooltip-content="Remove from cart" onClick={removeFromCart} icon={faTrashAlt} className='Cart-icon-remove'/>
        <Tooltip
          anchorId="remove-cart-tooltip"
          style={{ backgroundColor: "#fd625d", color: "#fff" }}
        /></>
        :<>
        <FontAwesomeIcon id="cart-tooltip" data-tooltip-content="Add to cart" onClick={addToCart} icon={faCartPlus} className='Cart-icon'/>
        <Tooltip
          anchorId="cart-tooltip"
          style={{ backgroundColor: "#fd625d", color: "#fff" }}
        /></>
        }
        
        <div className='Right-column'>
          
            {
              (typeof images[0] === 'undefined') ? (
                <p id='loading-image'>Loading image...</p>
              ) : (
                <ImageSlider images={images}/>
              )
            }
        </div>
        <div className='Left-column-2'>

        </div>
        <div className='Left-column'>
        <h1 className='Product-name'>{title}</h1>
        <h3 className='Text-header'>Description: </h3>
        <p className='Text-data'>{description}</p>
        <br />
        <h3 className='Text-header'>Price: </h3>
        <p className='Text-data'>₹{price}</p>
        <br />
        <h3 className='Text-header'>Rating: </h3>
        <p className='Text-data'>{rating}/5</p>
        <br />
        <h3 className='Text-header'>Brand: </h3>
        <p className='Text-data'>{brand}</p>
        <br />
        <h3 className='Text-header'>Category: </h3>
        <p className='Text-data'>{category}</p>
        <br />
        <h3 className='Text-header'>Discount: </h3>
        <p className='Text-data'>{discountPercentage}%</p>
        </div>
      </Modal>
    </div>
  );
}

export default ProductModal;