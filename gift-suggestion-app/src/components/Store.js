import '../css/Store.css';
import Item from './Item.js';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faSort, faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons'
import FilterModal from './FilterModal';
import SortModal from './SortModal';
import ProductModal from './ProductModal';

const Store = ({criteria}) => {

    const [modal, setModal] = useState(false);
    const [productDetail, setProductDetail] = useState([]);
    const [productData, setProductData] = useState([{}]);
    const [filterModal, setFilterModal] = useState(false);
    const [sortModal, setSortModal] = useState(false);
    const [productCategories, setProductCategories] = useState([]);
    const [filterReset, setFilterReset] = useState(false);
    const lowerAge = criteria[0];
    const upperAge = criteria[1];
    const gender = criteria[2];

    console.log('filter modal state- ', filterModal);

    const openModal = () => {
        setModal(true);
    }

    function handleOpenFilter() {
        setFilterModal(true);
    }

    function handleCloseFilter() {
        setFilterModal(false);
    }

    function handleOpenSort() {
        setSortModal(true);
    }

    function handleCloseSort() {
        setSortModal(false);
    }

    const handleOpen=(productDetail)=>{
        setProductDetail(productDetail);
        setModal(true);
    }

    function handleClose() {
        setModal(false);
    }

    const filterProducts = (prod) => {
        setProductData(prod);
    }

    const sortedProducts = (prod) => {
        setProductData(prod);
    }

    const handleReset = () => {
        const requestOptions = {
            method: 'PUT'
        };
        fetch('/resetFilterCategory',requestOptions)
        .then(setFilterReset(!filterReset));
    }

    useEffect(()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lowerAge, upperAge, gender})
        };
        fetch('/getProducts', requestOptions)
        .then(res => res.json())
        .then(
            products => {setProductData(products);
                let productArray = Object.values(products)[0];
                //set all distinct categories for the filter modal
                setProductCategories([...new Set(productArray.map(cat => cat.category))]);
                console.log('from store-',criteria);
            }
        ) 
    },[filterReset])
    return(
        <>
            <div className='Store-buttons'>
                <button className='Store-buttons-icon' id='reset-btn' onClick={handleReset}>Reset <FontAwesomeIcon icon={faRefresh} className='Store-icons'/></button> 
                <button className='Store-buttons-icon' onClick={handleOpenSort}>Sort<FontAwesomeIcon icon={faSort} className='Store-icons'/></button> 
                <button className='Store-buttons-icon' onClick={handleOpenFilter} >Filter<FontAwesomeIcon icon={faFilter} className='Store-icons'/></button>
                <button className='Store-buttons-icon'><FontAwesomeIcon icon={faArrowLeft} className='Store-icons'/></button>
                <button className='Store-buttons-icon'><FontAwesomeIcon icon={faArrowRight} className='Store-icons'/></button>
                {sortModal?<SortModal criteria={criteria} sortedProducts={sortedProducts} open={sortModal} modalClose={()=>handleCloseSort()}/>:''}
                {filterModal?<FilterModal filterProducts={filterProducts} open={filterModal} modalClose={()=>handleCloseFilter()} category={productCategories} />:''}
            </div>
            <div className='StoreContainer'>
                {
                    (typeof productData.products === 'undefined')?(
                        <p className='loading'>Loading...</p>
                    ):(
                        productData.products.map((product,idx)=>(
                            <Item key={idx} idx={idx} productDetail={product} handleOpen={handleOpen}/>
                        ))  
                    )
                }
            {modal?<ProductModal open={modal} modalClose={()=>handleClose()} productDetail={productDetail} />:''}
            </div> 
        </>
    )
}

export default Store;