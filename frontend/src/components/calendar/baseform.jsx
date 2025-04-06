import './calendar.css'
import React, { useState, useEffect } from 'react';
// import EventForm from './eventform';

function BaseModal({ closeModal, events, setShowEventForm, setBaseForm, setSelectedEvent, date }) {

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setBaseForm(false);
        setShowEventForm(true);
      };


    const createNewEvent = () => {
        setBaseForm(false);
        setShowEventForm(true);
    }

    return (
        <>
            <h1>{date}</h1>
            {events && events.length > 0 ? (
            events.map((event, index) => (
                <button onClick={() => handleEventClick(event)} key={index}>
                {event.title}
                </button>
            ))
            ) : (
            <p>No events</p>
            )}
            <button onClick={createNewEvent}>Create New Event</button>
            <button onClick={closeModal}>Close Modal</button>
        </>
    );
};


export default BaseModal;