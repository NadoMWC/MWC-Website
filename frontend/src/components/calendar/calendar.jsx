import './calendar.css'
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal';
import axios from 'axios';

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLocked, setIsModalLocked] = useState(false); // Track if modal is locked for closing
  const [lockTimeout, setLockTimeout] = useState(null); // Store timeout ID
  const [modalData, setModalData] = useState(null);


  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;  // The clicked date in 'YYYY-MM-DD' format
    const clickedEvent = events.find(event => event.start === clickedDate);

    setModalData(clickedEvent || { title: "No Events Today"});
    
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
    if (isModalLocked) return; 
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {
      closeModal(); 
    }
  };




  const [events, setEvents] = useState([]);

  // Fetch events from the API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/calendar/view_events/'); // Use the correct API URL
        // Map the events to FullCalendar's format
        const calendarEvents = response.data.map(event => ({
          title: event.name,  // Map customer_name to title
          start: event.date,           // Map date to start
          address: event.address,
        }));
        setEvents(calendarEvents);  // Set mapped events data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);



  // const events = [
  //   {
  //     title: "Meeting with Client",
  //     start: "2025-04-05",
  //     description: "Discuss project requirements and deadlines.",
  //     jobCost: 500
  //   },
  //   {
  //     title: "Team Standup",
  //     start: "2025-04-10",
  //     description: "Daily team standup meeting.",
  //     jobCost: 500
  //   },
  //   {
  //     title: "Product Launch",
  //     start: "2025-04-15",
  //     description: "Launching the new website.",
  //     jobCost: 500
  //   },
  //   {
  //     title: "Meeting with Client #2",
  //     start: "2025-04-15",
  //     description: "Diswqrwercuss project requirements and deadlinedsqwerqes.",
  //     jobCost: 500
  //   }
  // ];

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