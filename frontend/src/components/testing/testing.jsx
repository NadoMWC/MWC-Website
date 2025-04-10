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


// import './calendar.css'
// import { useState, useEffect, useRef } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import EventModal from './eventmodal';
// import axiosInstance from '../../api/axiosInstance.js';
// import { useAuth } from '../../context/AuthContext.jsx'


// function Calendar() {

//   // States
//   const calendarRef = useRef(null);  // Create the calendar reference
//   const [calendarView, setCalendarView] = useState('dayGridMonth'); // Set for calendar View (day/week/month)
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal Open/Hidden
//   const [isModalLocked, setIsModalLocked] = useState(false); // Prevent Immediate Close
//   const [lockTimeout, setLockTimeout] = useState(null); // Prevent Immediate Close
//   const [eventsForDate, setEventsForDate] = useState([]); // Stores events info for date clicked
//   const [clickedDate, setClickedDate] = useState([]) // Date clicked
//   const [events, setEvents] = useState([]); // Events loaded into calendar

//   // Fetch events from the API when the component mounts
//   useEffect(() => {
//     const fetchEvents = async () => {
//       const token = localStorage.getItem('access_token');

//       try {
//         const response = await axiosInstance.get('http://127.0.0.1:8000/api/calendar/view_events/', 
//           {headers: {'Authorization': `Bearer ${token}`}});

//         // Map the events to FullCalendar's format
//         const calendarEvents = response.data.map(event => ({
//           id: event.id,
//           title: event.name,
//           start: event.date,
//           cost: event.cost,
//           description: event.notes,
//           address: event.address,
//           phone: event.phone,
//           email: event.email,
//           time: event.time,
//           color: event.color}));

//         setEvents(calendarEvents);}

//         catch (error) {console.error("Error fetching events:", error);}}; 
//         fetchEvents();}, []);

//   const calendarClick = (info) => {
//     const clickedDay = info.dateStr;  // The clicked day in string format (YYYY-MM-DD)

//     // Get all events for the clicked day
//     const filteredEvents = events.filter(event => {
//       const eventStart = new Date(event.start).toISOString().split('T')[0];  // Compare only date part (YYYY-MM-DD)
//       return eventStart === clickedDay;
//     });

//     // If we are in 'dayGridMonth' and click on a date, switch to 'timeGridDay' and don't show modal immediately
//     if (calendarView === 'dayGridMonth') {
//       const calendarApi = calendarRef.current.getApi();
//       // Switch to day view
//       calendarApi.changeView('timeGridDay', clickedDay);
//       setClickedDate(clickedDay);  // Update the clicked date state
//       setEventsForDate(filteredEvents);  // Update events for that day
//     } 

//     // If we are already in 'timeGridDay' view, handle modal opening based on event presence
//     else if (calendarView === 'timeGridDay') {
//       if (filteredEvents.length === 0) {
//         // No events for the clicked day, so open the modal
//         setIsModalOpen(true);
//         setIsModalLocked(true);
//         setClickedDate(clickedDay);
//         setEventsForDate(filteredEvents);

//         // Prevent Modal Closing for .5 Seconds
//         if (lockTimeout) clearTimeout(lockTimeout);
//         const timeoutId = setTimeout(() => {
//           setIsModalLocked(false);
//         }, 500);
//         setLockTimeout(timeoutId);
//       } else {
//         // If there are events on the clicked day, just set the events and wait for another click
//         setEventsForDate(filteredEvents);
//       }
//     }
// };


//   const closeModal = () => {
//     if (isModalLocked) 
//     return; setIsModalOpen(false);
//   };

//   const handleOverlayClick = (e) => {
//     const modalContent = e.target.closest('.modal-content');
//     if (!modalContent) {closeModal();}
//   };

//   return (
//     <div>

//       {/* Render in the Calendar from FullCalendarJS */}
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
//         initialView="dayGridMonth"
//         events={events}
//         eventClick={calendarClick}
//         dateClick={calendarClick}
//         viewDidMount={(arg) => setCalendarView(arg.view.type)}
//         headerToolbar={{
//           left: 'prev,next today',
//           center: 'title',
//           right: 'dayGridMonth,timeGridWeek,timeGridDay'}}
//         />

//       {/* Conditionally render the EventModal */}
//       {isModalOpen && (
//         <EventModal 
//             closeModal={closeModal} 
//             handleOverlayClick={handleOverlayClick}
//             events={eventsForDate}
//             date={clickedDate}/>)}
            
//     </div>
//   );
// };

// export default Calendar;