import React from 'react';
import Modal from 'react-modal';
import '../css/FilterModal.css';

const customStyles = {
  content: {
    position: 'fixed',
    top: '52%',
    left: '1060px',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    minHeight: '20  0px',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 0px 8px 0 rgb(0, 0, 0), 0 0px 25px 0 rgb(0, 0, 0)',
  },overlay: {
    background: "rgb(0,0,0,0.5)"
  }
};

function FilterModal({modalClose, open, category, filterProducts}) {

  function closeModal() {
    modalClose(false);
  }

  const filteredProducts = (cat) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({cat})
    }

    fetch('/filterProducts',requestOptions)
    .then(res => res.json())
    .then(products => {filterProducts(products)}) 
  }

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Filter Modal"
      >
        <b>Categories</b>
        <hr />
        <ul id='filter-list'>
          {category.map(cat=><li onClick={()=>filteredProducts(cat)} key={cat} className='filter-items'>{cat}</li>)}
        </ul>
      </Modal>
    </div>
  );
}

export default FilterModal;