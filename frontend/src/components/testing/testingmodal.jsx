import '../calendar/calendar.css';
import React, { useState, useEffect } from 'react';

// New Modal component to display event details
function EventDetailsModal({ closeModal, event }) {
    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{event.title}</h2>
                <p><strong>Start:</strong> {event.start}</p>
                <p><strong>Cost:</strong> ${event.cost}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    );
}

function TestingModal({ closeModal, handleOverlayClick, events }) {
    const [selectedEvent, setSelectedEvent] = useState(null); // To store the selected event
    const [showEventModal, setShowEventModal] = useState(false); // To control showing the event modal

    // Define the handleEventClick function to set the selected event
    const handleEventClick = (event) => {
        setSelectedEvent(event); // Set the event in state to show in the modal
        setShowEventModal(true);  // Show the event details modal
    };

    // Function to close the event details modal
    const closeEventDetailsModal = () => {
        setShowEventModal(false); // Hide the event details modal
        setSelectedEvent(null);    // Clear the selected event
    };

    return (
        <div>
            {/* Original Modal */}
            {!showEventModal && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>Hello</p>

                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <button key={index} onClick={() => handleEventClick(event)}>
                                    {event.title} {/* Display the event title as a button */}
                                </button>
                            ))
                        ) : (
                            <p>No events for this day</p>
                        )}

                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {showEventModal && selectedEvent && (
                <EventDetailsModal
                    closeModal={closeEventDetailsModal}
                    event={selectedEvent}
                />
            )}
        </div>
    );
};

export default TestingModal;
