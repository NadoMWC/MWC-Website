import './calendar.css'
import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal';

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLocked, setIsModalLocked] = useState(false); // Track if modal is locked for closing
  const [lockTimeout, setLockTimeout] = useState(null); // Store timeout ID
  const [modalData, setModalData] = useState(null);


  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;  // The clicked date in 'YYYY-MM-DD' format
    const clickedEvent = events.find(event => event.start === clickedDate);

    setModalData(clickedEvent || { title: "No Event", description: "No event scheduled for this day." });
    
    setIsModalOpen(true);
    setIsModalLocked(true);

    if (lockTimeout) clearTimeout(lockTimeout); // Clear any previous timeout
    const timeoutId = setTimeout(() => {
      setIsModalLocked(false); // Allow closing after 1 second
    }, 500); // .5 second delay
    setLockTimeout(timeoutId); // Store timeout ID

    if (clickedEvent) {
      console.log("Event found:", clickedEvent);
    } else {
      console.log("No event for this date.");
    }
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




  const events = [
    {
      title: "Meeting with Client",
      start: "2025-04-05",
      description: "Discuss project requirements and deadlines."
    },
    {
      title: "Team Standup",
      start: "2025-04-10",
      description: "Daily team standup meeting."
    },
    {
      title: "Product Launch",
      start: "2025-04-15",
      description: "Launching the new website."
    }
  ];



  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleDateClick}
        dateClick={handleDateClick}
      />

      {/* Conditionally render the EventModal */}
      {isModalOpen && (
        <EventModal 
            closeModal={closeModal} 
            handleOverlayClick={handleOverlayClick}
            eventData={modalData}
             />
      )}
    </div>
  );
};

export default Calendar;

