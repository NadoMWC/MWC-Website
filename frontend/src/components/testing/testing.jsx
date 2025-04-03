import '../calendar/calendar.css';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TestingModal from './testingmodal.jsx';


function Testing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLocked, setIsModalLocked] = useState(false); // Track if modal is locked for closing
  const [lockTimeout, setLockTimeout] = useState(null); // Store timeout ID
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForDate, setEventsForDate] = useState([]);


  const handleDateClick = (info) => {
    const clickedDate = info.dateStr 
    const filteredEvents = events.filter(event => event.start === clickedDate);

    setEventsForDate(filteredEvents)
    console.log(clickedDate)
    console.log(filteredEvents)

    setIsModalOpen(true);
    setIsModalLocked(true);

    if (lockTimeout) clearTimeout(lockTimeout); 
    const timeoutId = setTimeout(() => {setIsModalLocked(false); }, 500); 
    setLockTimeout(timeoutId); 
  };


  const closeModal = () => {
    if (isModalLocked) return; 
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {
      closeModal(); 
    }
  };

  const events = [
    {
        "title": "Billy Bob",
        "start": "2025-04-05",
        "cost": 500,
        "description": "Very noisy person"
    },
    {
        "title": "Jane Doe",
        "start": "2025-04-05",
        "cost": 300,
        "description": "Prefers early morning appointments"
    },
    {
        "title": "Mike Johnson",
        "start": "2025-04-07",
        "cost": 700,
        "description": "Pays in cash"
    },
    {
        "title": "Sarah Lee",
        "start": "2025-04-10",
        "cost": 450,
        "description": "Has a dog that needs to be locked up"
    },
    {
        "title": "Tom Smith",
        "start": "2025-04-12",
        "cost": 600,
        "description": "Very particular about window spots"
    },
    {
        "title": "Emma Davis",
        "start": "2025-04-12",
        "cost": 400,
        "description": "Requests a discount for referrals"
    },
    {
        "title": "John Carter",
        "start": "2025-04-18",
        "cost": 550,
        "description": "Wants a follow-up appointment in May"
    },
    {
        "title": "Lucy Martinez",
        "start": "2025-04-20",
        "cost": 350,
        "description": "Prefers afternoon appointments"
    },
    {
        "title": "Robert Brown",
        "start": "2025-04-22",
        "cost": 800,
        "description": "Requires extra cleaning for skylights"
    },
    {
        "title": "Alice Cooper",
        "start": "2025-04-25",
        "cost": 500,
        "description": "Loyal customer, books every 3 months"
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
        <TestingModal 
            closeModal={closeModal} 
            handleOverlayClick={handleOverlayClick}
            events={eventsForDate}
             />
      )}
    </div>
  );
};

export default Testing;