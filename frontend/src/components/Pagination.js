import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';


const Pagination = ({ totalPages, paginate,showNextLink,showPrevLink, submit, isNoSkill, currentPage }) => {

  return (
    <nav className={`nav ${ showNextLink && (!submit && !isNoSkill) ? 'show' : 'hide'}`}>
      <ul className='pagination'>

        {/* ...........Prev button............. */}
        <li className={`page-item ${showPrevLink? 'show':'hide'}`}> 
          <button className='page-link' onClick={() => paginate(currentPage - 1)}>
          Prev
          </button>
        </li>


        {/* ...........Page nums in between............. */}
        {[...Array(20)].map((page, i) => (
          <li key={i} className='page-item'>
            <button onClick={() => paginate(i + 1)} className='page-link'>
              {i + 1}
            </button>
          </li>
        ))}

         {/* ...........Next button............. */}
        <li className="page-item">
          <button className='page-link' onClick={() => paginate(currentPage + 1)}>
            Next
         </button>
        </li>
      </ul>
    </nav>
  );
}; 


export default Pagination;
