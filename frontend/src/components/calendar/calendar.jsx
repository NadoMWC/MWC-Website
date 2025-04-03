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

  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForDate, setEventsForDate] = useState([]);


  const handleDateClick = (info) => {
    const clickedDay = info.dateStr;


    setSelectedDate(clickedDay);  
    const filteredEvents = events.filter(event => event.start === selectedDate);
    setEventsForDate(filteredEvents);

    console.log("Date: ", {selectedDate})
    console.log("Filtered Events: ", {filteredEvents})
  
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


  const [events, setEvents] = useState([]);

  // Fetch events from the API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/calendar/view_events/'); // Use the correct API URL
        // Map the events to FullCalendar's format
        const calendarEvents = response.data.map(event => ({
          title: event.name, 
          address: event.address,
          phone: event.phone,
          email: event.email,
          cost: event.cost,
          start: event.date, 
          time: event.time,
          notes: event.notes

        }));
        setEvents(calendarEvents);  // Set mapped events data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);


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
            eventsForDate={eventsForDate}
             />
      )}
    </div>
  );
};

export default Calendar;