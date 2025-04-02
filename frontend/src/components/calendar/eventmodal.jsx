// This will ultimately wind up becoming the file that controls most of the operations? Or atleast this component will.

import './calendar.css'
import React, { useState, useEffect } from 'react';

function EventModal({ closeModal, handleOverlayClick, eventData }) {
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{eventData?.title}</h3>
        <p>{eventData?.description}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;


