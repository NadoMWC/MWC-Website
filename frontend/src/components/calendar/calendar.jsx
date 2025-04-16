import './calendar.css';
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal.jsx'
import axiosInstance from '../../api/axiosInstance.js'

function MyCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickedEventData, setClickedEventData] = useState(null);
  const [databaseEvents, setDatabaseEvents] = useState(null);
  const [clickedTime, setClickedTime] = useState(null);

  const calendarRef = useRef(null);

  // Handle date clicks (switch to day view from month view)
  const calendarClick = (info) => {
    const clickedDay = info.dateStr;
    const currentView = info.view.type;
  
    // If in Month View, Clicks will activate Day View & Enable Event Clicks
    if (currentView === 'dayGridMonth') {
      info.view.calendar.changeView('timeGridDay', clickedDay);
      enableEventClicks();
    }
  
    // Set Day View Click to Open Event Form Modal
    else if (currentView === 'timeGridDay') {
      const timeClicked = info.dateStr.slice(0, -6);
      setClickedTime(timeClicked);
      openModal();
    }
  };

  function eventClick(info) {
    const clickedId = parseInt(info.event.id, 10);
    const foundEvent = databaseEvents.find(event => event.id === clickedId);
    setClickedEventData(foundEvent);
    openModal();
    console.log(clickedId)
  };

  function openModal () {
    setIsModalOpen(true);
    console.log("OPENING Modal");
  };

  function closeModal () {
    setClickedEventData(null)
    setClickedTime(null);
    setIsModalOpen(false);
    console.log("CLOSING Modal");
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {closeModal();}
  };

  function enableEventClicks () {
    const events = document.querySelectorAll('.fc-event');
    events.forEach(event => {event.style.pointerEvents = 'auto';});
  };

  const fetchAndSetEvents = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No valid token found. Please log in again.');
      return;
    }
  
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/calendar/view_events/', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const transformedEvents = response.data.map(event => ({
        id: event.id,
        title: event.name,
        address: event.address,
        phone: event.phone,
        start: event.start_time ? event.start_time.replace('Z', '') : null,
        end: event.end_time ? event.end_time.replace('Z', '') : null,
        windowsCost: event.windows_job.windows_cost,
        windowsNotes: event.windows_job.windows_notes,
        pressureWashingCost: event.pressure_job.pressure_washing_cost,
        pressureWashingNotes: event.pressure_job.pressure_washing_notes,
        miscCost: event.misc_job.misc_cost,
        miscNotes: event.misc_job.misc_notes,
        email: event.email,
        description: event.notes,
        color: event.event_color,
      }));
  
      setDatabaseEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAndSetEvents();
  }, []);

  return (
    <div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={databaseEvents}
        eventClick={eventClick}
        dateClick={calendarClick}
        ref={calendarRef}
        headerToolbar={{
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />

      {isModalOpen && 
        <EventModal 
          closeModal={closeModal}
          handleOverlayClick={handleOverlayClick}
          eventData={clickedEventData}
          startTime={clickedTime}
          calendarRef={calendarRef}
          updateEvents={fetchAndSetEvents}
          setDatabaseEvents={setDatabaseEvents}
        />
      }
          
    </div>
  );
}

export default MyCalendar;