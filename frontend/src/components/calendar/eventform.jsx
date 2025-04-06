import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ events }) => {

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (index) => {
    setSelectedEvent(index);  // Set the selected event index
  };

  return (
    <div>
      <p>Window 2</p>
      {selectedEvent !== null && events[selectedEvent] ? (  // Check if selectedEvent is set and within bounds
        <div>
          <h2>{events[selectedEvent].start}</h2>
          <p>Title: {events[selectedEvent].title}</p>
          <p>Time: {events[selectedEvent].time}</p>
          <p>Phone: {events[selectedEvent].phone}</p>
          <p>Address: {events[selectedEvent].address}</p>
          <p>Cost: {events[selectedEvent].cost}</p>
          <p>Email: {events[selectedEvent].email}</p>
          <p>Notes: {events[selectedEvent].notes}</p>
        </div>
      ) : (
        <p>No event selected</p>
      )}
  
      <div>
        {events.map((event, index) => (
          <button key={index} onClick={() => handleEventClick(index)}>
            View {event.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EventForm;















