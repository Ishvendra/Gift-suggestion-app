import '../css/CartItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus, faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import ProductModal from './ProductModal';

const CartItem = ({productDetail, deleteItem, totalPrice}) => {

    const [modal, setModal] = useState(false);
    const [itemQty, setItemQty] = useState(1);
    const {title, price, description, thumbnail, images, rating, brand, category, discountPercentage, id} = productDetail;
    const originalPrice = Math.trunc((100 * price) / (100 - discountPercentage));
    const discountDifference = originalPrice - price;
    function handleOpen() {
        setModal(true);
    }

    function handleClose() {
        setModal(false);
    }

    const deleteProduct = () => {
        console.log('delete')
        deleteItem(id);
    }

    const increaseQty = () => {
        if(itemQty<9){
            setItemQty(itemQty+1)
        }
    }

    const decreaseQty = () => {
        if(itemQty>1){
            setItemQty(itemQty-1)
        }
    }

    useEffect(()=>{
        // console.log('from cartItem- ',title);
        totalPrice(itemQty,price,id,discountDifference);
        console.log('cart item: item qty- ',itemQty);
    },[itemQty, id, price])

    return (
        <>
        <div className="item-body">
            <img className='cart-item-img' onClick={()=>handleOpen()} src={thumbnail} alt='product'></img>
            <p className='cart-item-title' onClick={()=>handleOpen()}>{title}</p>
            <p className='cart-item-desc'>{description}</p>
            <p className='cart-item-price' onClick={()=>handleOpen()}>₹{price}</p>
            <p className='cart-item-old-price'>₹{originalPrice}</p>
            <div className='qty-container'>
                <FontAwesomeIcon icon={faCircleMinus} className='decrease-qty' onClick={decreaseQty}/>
                <p className='display-qty'>{itemQty}</p>
                <FontAwesomeIcon icon={faCirclePlus} className='increase-qty' onClick={increaseQty}/>
            </div>
            <FontAwesomeIcon icon={faTrashCan} className='cart-item-delete' onClick={deleteProduct}/>
        </div>
        {modal?<ProductModal open={modal} modalClose={()=>handleClose()} productDetail={productDetail}/>:''}
        </>
    )
}

export default CartItem;