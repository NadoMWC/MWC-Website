import './calendar.css'
import React, { useState, useEffect } from 'react';
import EventForm from './eventform';
import BaseModal from './baseform.jsx';

function EventModal({ closeModal, handleOverlayClick, events }) {
  const [currentForm, setCurrentForm] = useState('base'); // 'base' or 'event'

  const handleShowEventForm = () => setCurrentForm('event');
  const handleShowBaseForm = () => setCurrentForm('base');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {currentForm === 'base' && (
          <BaseModal
            closeModal={closeModal}
            events={events}
            setShowEventForm={handleShowEventForm}
            setBaseForm={handleShowBaseForm}
          />
        )}

        {currentForm === 'event' && (
          <EventForm
            closeModal={closeModal}
            events={events}
          />
        )}

      </div>
    </div>
  );
}

export default EventModal;








// {eventsForDate.length > 0 && (
//   <ul>
//       {eventsForDate.map((event, index) => (
//           <button onClick={() => setShowForm(true)} key={index}>{event.title}</button>
//       ))}
//   </ul>
// )}
// {eventsForDate.length === 0 && <p>No events for this date.</p>}

// {/* Form should show only on create event click, or if an event itself is clicked */}
// {showForm && <EventForm />}
// <button onClick={() => setShowForm(true)}>Create Event</button>
// <button onClick={closeModal}>Close</button>









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