import './calendar.css'
// import React, { useState, useEffect } from 'react';
// import EventForm from './eventform';

function BaseModal({ closeModal, events, setShowEventForm, setBaseForm }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (event) => {
        setBaseForm(false);
        setShowEventForm(true);
        setSelectedEvent(event);
        setSelectedEvent(index);
      };

    return (
        <>
            <p>Window 1</p>
            {events && events.length > 0 ? (
            events.map((event, index) => (
                <button onClick={() => handleEventClick(event)} key={index}>
                View {event.title}
                </button>
            ))
            ) : (
            <p>No events</p>
            )}
            <button onClick={closeModal}>Close Modal</button>
        </>
    );
};


export default BaseModal;