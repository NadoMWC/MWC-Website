import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ selectedEvent }) => {
  return (
    <div>
      <p>Window 2</p>
      {selectedEvent ? (
        <div>
          <h2>{selectedEvent.start}</h2>
          <p>Title: {selectedEvent.title}</p>
          <p>Time: {selectedEvent.time}</p>
          <p>Phone: {selectedEvent.phone}</p>
          <p>Address: {selectedEvent.address}</p>
          <p>Cost: {selectedEvent.cost}</p>
          <p>Email: {selectedEvent.email}</p>
          <p>Notes: {selectedEvent.notes}</p>
        </div>
      ) : (
        <p>No event selected</p>
      )}
    </div>
  );
};

export default EventForm;















