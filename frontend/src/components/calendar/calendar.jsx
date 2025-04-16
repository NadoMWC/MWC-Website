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
  const [canCloseModal, setCanCloseModal] = useState(true);
  const [clickedEventData, setClickedEventData] = useState(null);
  const [databaseEvents, setDatabaseEvents] = useState(null);
  const [clickedTime, setClickedTime] = useState(null);
  const [date, setDate] = useState(null);
  const [clickBlock, setClickBlock] = useState(false);

  const calendarRef = useRef(null);
  const refreshCalendar = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) 
      {calendarApi.refetchEvents();}
  };

  // Handle date clicks (switch to day view from month view)
  const calendarClick = (info) => {
    // Prevent further clicks if clickBlock is active
    if (clickBlock) {
      return;
    }
  
    // Block clicks temporarily for 0.3 seconds after the action
    setClickBlock(true);
    
    const clickedDay = info.dateStr;
    const currentView = info.view.type;
    setDate(clickedDay.split('T')[0]);
  
    // If in Month View, Clicks will activate Day View & Enable Event Clicks
    if (currentView === 'dayGridMonth') {
      info.view.calendar.changeView('timeGridDay', clickedDay);
    }
  
    // Set Day View Click to Open Event Form Modal
    else if (currentView === 'timeGridDay') {
      enableEventClicks();
      const timeClicked = info.dateStr.slice(0, -6);
      setClickedTime(timeClicked);
      openModal();
    }
  
    // Unblock clicks after 0.3 seconds
    setTimeout(() => {
      setClickBlock(false);
    }, 300); // 0.3 seconds
  };

  function eventClick(info) {
    const eventId = info.event.id;
    const eventData = databaseEvents[eventId-1]; // Subtract 1 to Index Properly
    setClickedEventData(eventData);
    setIsModalOpen(true);
  }

  function openModal () {
    setIsModalOpen(true);
    setCanCloseModal(false);
    setTimeout(() => setCanCloseModal(true), 300);
    console.log("OPENING Modal")
  };

  function closeModal () {
    if (!canCloseModal) return;
    setIsModalOpen(false);
    setClickedEventData(null);
    console.log("CLOSING Modal")
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {closeModal();}
  };

  function enableEventClicks () {
    const events = document.querySelectorAll('.fc-event');
    events.forEach(event => {event.style.pointerEvents = 'auto';});
  }

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
        ref={calendarRef}
        initialView="dayGridMonth"
        events={databaseEvents}
        eventClick={eventClick}
        dateClick={calendarClick}
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
          date={date}
          startTime={clickedTime}
          calendarRef={calendarRef}
          refreshCalendar={refreshCalendar}
          updateEvents={fetchAndSetEvents}
          setDatabaseEvents={setDatabaseEvents}
        />
      }
          
    </div>
  );
}

export default MyCalendar;