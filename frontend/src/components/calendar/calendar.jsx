import './calendar.css'
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import React, { useState, useEffect } from 'react';
// import EventModal from './eventmodal';
// import interactionPlugin from '@fullcalendar/interaction';


// calendar.jsx
import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal';

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLocked, setIsModalLocked] = useState(false); // Track if modal is locked for closing
  const [lockTimeout, setLockTimeout] = useState(null); // Store timeout ID

  const handleDateClick = (arg) => {
    setIsModalOpen(true);
    setIsModalLocked(true); // Lock modal when opened

    // Unlock modal after 1 second
    if (lockTimeout) clearTimeout(lockTimeout); // Clear any previous timeout
    const timeoutId = setTimeout(() => {
      setIsModalLocked(false); // Allow closing after 1 second
    }, 500); // .5 second delay
    setLockTimeout(timeoutId); // Store timeout ID
  };

  const closeModal = () => {
    if (isModalLocked) return; // Prevent closing if locked
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {
      closeModal(); // Only close if the modal is not locked
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />

      {/* Conditionally render the EventModal */}
      {isModalOpen && (
        <EventModal closeModal={closeModal} handleOverlayClick={handleOverlayClick} />
      )}
    </div>
  );
};

export default Calendar;


//     // State to hold the modal event data
//     const [selectedEvent, setSelectedEvent] = useState(null);
  
//     // Sample data to be displayed in the calendar
//     const events = [
//       {
//         title: "Meeting with Client",
//         start: "2025-04-01T10:00:00",
//         end: "2025-04-01T12:00:00",
//         description: "Discuss project requirements."
//       },
//       {
//         title: "Lunch with Team",
//         start: "2025-04-01T13:00:00",
//         end: "2025-04-01T14:00:00",
//         description: "Team lunch at the cafe."
//       }
//     ];
  
//     // Function to handle event click
//     const handleEventClick = (info) => {
//       setSelectedEvent(info.event.extendedProps); // Access event details
//     };

//     const handleDateClick = (info) => {
//         // Set selectedEvent to null or an empty object if you want to display a blank form
//         setSelectedEvent({ start: info.dateStr, end: info.dateStr }); // Date click sets the event time as the clicked date
//     };
  
//     // Function to close the modal
//     const closeModal = () => {
//       setSelectedEvent(null);
//     };
  
//     return (
//       <div>
//         <FullCalendar
//           plugins={[dayGridPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           eventClick={handleEventClick} 
//           dateClick={handleDateClick}
//         />
//         <EventModal 
//             event={selectedEvent} 
//             closeModal={closeModal} 
//         />
//       </div>
//     );
//   }
  

