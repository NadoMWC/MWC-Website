import '../calendar/calendar.css';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';


function Testing() {
  const [CalendarEventModal, setCalendarEventModal] = useState(false);
  const [isModalLocked, setIsModalLocked] = useState(false); // Track if modal is locked for closing
  const [lockTimeout, setLockTimeout] = useState(null); // Store timeout ID
  const [eventsForDate, setEventsForDate] = useState([]);
  const [events, setEvents] = useState([]);


  const { user } = useAuth();
  useEffect(() => {
    console.log('User data:', user.user_id);
  }, [user]);

 // Fetch events from the API when the component mounts
 useEffect(() => {
  const fetchEvents = async () => {
    const token = localStorage.getItem('access_token');  // Get the JWT token from localStorage

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/calendar/view_events/', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
        },
      });

      // Map the events to FullCalendar's format
      const calendarEvents = response.data.map(event => ({
        title: event.name,
        start: event.date,
        cost: event.cost,
        description: event.notes,
        address: event.address,
        phone: event.phone,
        email: event.email,
        time: event.time
      }));

      setEvents(calendarEvents);  // Set mapped events data
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  fetchEvents();
}, []);


  const handleDateClick = (info) => {
    setCalendarEventModal(true); // Open Modal
    setIsModalLocked(true); 

    // Retrieve&store events info inside filteredEvents State Variable
    const clickedDate = info.dateStr 
    const filteredEvents = events.filter(event => event.start === clickedDate);
    setEventsForDate(filteredEvents)

    

    if (lockTimeout) clearTimeout(lockTimeout); 
    const timeoutId = setTimeout(() => {setIsModalLocked(false); }, 500); 
    setLockTimeout(timeoutId); 
  };


  const closeModal = () => {
    if (isModalLocked) return; 
    setCalendarEventModal(false); 
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {
      closeModal(); 
    }
  };

 
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events} // Load in Events from Database
        eventClick={handleDateClick} // Trigger CalendarEventModal & Store information inside eventsForDate useState Variable
        dateClick={handleDateClick} // Additionally lock modal to prevent closing for .5 seconds
      />
    </div>
  );
};

export default Testing;


