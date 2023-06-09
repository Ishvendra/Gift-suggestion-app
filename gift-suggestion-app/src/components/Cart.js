import '../css/Cart.css';
import CartItem from './CartItem';
import { useState, useEffect } from 'react';

const Cart = ()=> {

    const [itemsInCart, setItemsInCart] = useState([]);
    const [prodDeleted, setProdDeleted] = useState(false);
    const [cartValue, setCartValue] = useState({});
    const [costContainerQty, setCostContainerQty] = useState(0);
    const [costContainerPrice, setCostContainerPrice] = useState(0);
    const [costContainerDiscount, setCostContainerDiscount] = useState(0);
    var totalSpend = 0;
    var totalQty = 0;
    var totalDiscountDifference = 0;

    const deleteItem = (id) => {
        const requestOptions = {
            method: 'PUT',    
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({id})
        }
        fetch('/deleteItemFromCart',requestOptions)
        .then(delete cartValue[id])
        .then(setProdDeleted(!prodDeleted));
    }

    const totalPrice = (itemQty, price, id, discountDifference) => {

        if(Object.keys(cartValue).includes(id)){
            setCartValue(prevState => ({
                ...prevState,
                [id]: [itemQty, price, discountDifference]
            }));
        }else{
            setCartValue(prevState => ({
                ...prevState,
                [id]: [itemQty, price, discountDifference]
            }));
        }
        
    }

    useEffect(()=>{
        totalSpend = 0;
        totalQty = 0;
        totalDiscountDifference = 0;
        Object.values(cartValue).forEach((val,idx)=>{
            totalSpend = totalSpend + (val[0]*val[1]);
            totalQty += val[0];
            totalDiscountDifference += val[0]*val[2];
        })
        setCostContainerQty(totalQty);
        setCostContainerPrice(totalSpend);
        setCostContainerDiscount(totalDiscountDifference);
    },[cartValue, prodDeleted])


    useEffect(()=>{
        fetch('/cartItems')
        .then(res=>res.json())
        .then(products=>setItemsInCart(products))
    },[prodDeleted])

    return(
        <div className='cart-container'>
            <div className='cart-title'>
                Shopping Cart
            </div>
            <div className='item-container'>
            {
                    (typeof itemsInCart.products === 'undefined' || itemsInCart.products.length == 0)?(
                        <img className='cart-empty' src={require('../media/cart-empty.png')} alt='404-error'></img>
                    ):(
                        itemsInCart.products.map((product,i)=>(
                            <CartItem key={i} productDetail={product} deleteItem={deleteItem} totalPrice={totalPrice}/>
                        ))
                    )
                }
            </div>
            <div className='cost-container'>
                <div className='cost-container-header'>
                    <p>ORDER DETAILS</p>
                </div>
                <br />
                <hr className='cart-hr'/>
                <div className='left-side-cart-1'>
                    <p>Price &#40;{costContainerQty}&#41; items</p>
                    <p>Discount</p>
                    <p>Delivery Charge</p>
                </div>
                <div className='right-side-cart-1'>
                    <p>Rs. {costContainerPrice}</p>
                    <p className='green-text'>Rs. {costContainerDiscount}</p>
                    <p className='green-text'><span id='free-text'>₹100</span>FREE</p>
                </div>
                <hr className='cart-hr hr2'/>
                <div className='left-side-cart-2'>
                    <p>Total Amount</p>
                </div>
                <div className='right-side-cart-2'>
                    <p>Rs. {costContainerPrice}</p>
                </div>
                <hr className='cart-hr hr3'/>
                <p className='footer-text green-text'> You will save Rs. {costContainerDiscount+100} on this order</p>
            </div>
            <button id='checkout-btn' disabled={true}>Place order</button>
        </div>
    )
}

export default Cart;