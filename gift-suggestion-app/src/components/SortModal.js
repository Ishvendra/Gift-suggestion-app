import React from 'react';
import Modal from 'react-modal';
import '../css/SortModal.css';

const customStyles = {
  content: {
    position: 'fixed',
    top: '42%',
    left: '990px',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '150px',
    height: '120px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 0px 8px 0 rgb(0, 0, 0), 0 0px 25px 0 rgb(0, 0, 0)',
  },overlay: {
    background: "rgb(0,0,0,0.5)"
  }
};

function SortModal({modalClose, open, category, sortedProducts, criteria}) {

  function closeModal() {
    modalClose(false);
  }

  const sortProducts = (sortCat) => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({sortCat, criteria})
    }

    fetch('/sortProducts',requestOptions)
    .then(res=> res.json())
    .then(products => {sortedProducts(products)
      console.log('from sort- ',products);
    });
  }

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Sort Modal"
      >
        <ul id='sort-list'>
            <li className='sort-li' onClick={()=>sortProducts('price')}>Price</li>
            <li className='sort-li' onClick={()=>sortProducts('rating')}>Popularity</li>
            <li className='sort-li' onClick={()=>sortProducts('rating')}>Rating</li>
            <li className='sort-li' onClick={()=>sortProducts('discountPercentage')}>Discount %</li>
        </ul>
      </Modal>
    </div>
  );
}

export default SortModal;