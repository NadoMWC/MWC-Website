import './calendar.css'
import React, { useState, useEffect } from 'react';
import EventForm from './eventform';

function EventModal({ closeModal, handleOverlayClick, eventData }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {showForm ? (
        <EventForm 
        existingInformation={eventData}/>
      ) : (
        <>
          <p>No events</p>
          <button onClick={() => setShowForm(true)}>Create Event</button>
        </>
      )}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;


















// // This will ultimately wind up becoming the file that controls most of the operations? Or atleast this component will.

// import './calendar.css'
// import React, { useState, useEffect } from 'react';

// function EventModal({ closeModal, handleOverlayClick, eventData, date, events}) {
//   console.log("EventData in Modal:", events);
//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <p>{date}</p>
//         {events.length > 0 ? (
//           <ul>
//             {events.map((event, index) => (
//               <li key={index}>{event.title}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No events for this day.</p>
//         )}
//         <p>{date}</p>
//         <button onClick={closeModal}>Create New Event</button>
//         <button onClick={closeModal}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default EventModal;