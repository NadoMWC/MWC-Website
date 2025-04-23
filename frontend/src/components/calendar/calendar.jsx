import './calendar.css';
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal.jsx'
import axiosInstance from '../../api/axiosInstance.js'

function MyCalendar() {

  // React Hooks
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickedEventData, setClickedEventData] = useState(null);
  const [databaseEvents, setDatabaseEvents] = useState(null);
  const [clickedTime, setClickedTime] = useState(null);
  const [freezeClicks, setFreezeClicks] = useState(false)
  const calendarRef = useRef(null);

  // On component mount, run function to fetch and set events in state
  useEffect(() => { fetchAndSetEvents();}, []);

  // Handle Touchscreen Movement
  useEffect(() => {
    const calendarEl = document.getElementById('calendar');
    let startX = 0;
    let endX = 0;
  
    const handleTouchStart = (e) => {
      startX = e.changedTouches[0].screenX;
    };
  
    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].screenX;
      handleGesture();
    };
  
    const handleMouseDown = (e) => {
      startX = e.screenX;
    };
  
    const handleMouseUp = (e) => {
      endX = e.screenX;
      handleGesture();
    };
  
    const handleGesture = () => {
      const swipeThreshold = 50;
      const api = calendarRef.current?.getApi();
      const isSwipe = Math.abs(endX - startX) > swipeThreshold;
      if (isSwipe) {
        if (endX < startX - swipeThreshold) 
          {api?.next();} 
        else if (endX > startX + swipeThreshold) 
          {api?.prev();}
      }
    };
  
    calendarEl.addEventListener('touchstart', handleTouchStart);
    calendarEl.addEventListener('touchend', handleTouchEnd);
    calendarEl.addEventListener('mousedown', handleMouseDown);
    calendarEl.addEventListener('mouseup', handleMouseUp);
  
    return () => {
      calendarEl.removeEventListener('touchstart', handleTouchStart);
      calendarEl.removeEventListener('touchend', handleTouchEnd);
      calendarEl.removeEventListener('mousedown', handleMouseDown);
      calendarEl.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Retrieve data from DB, map it, and set it to state
  const fetchAndSetEvents = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) 
      {setError('No valid token found. Please log in again.'); return;}
    
    // If token exists, fetch events from database
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/calendar/view_events/', 
        {headers: { Authorization: `Bearer ${token}` },});
      
      // Map data from DB - Preparing for state upload
      const transformedEvents = response.data.map(event => ({
        id: event.id,
        title: event.name,
        address: event.address,
        phone: event.phone,
        start: event.start_time ? event.start_time.replace('Z', '') : null, // Transform from UTC time to Pacific time
        end: event.end_time ? event.end_time.replace('Z', '') : null, // Transform from UTC time to Pacific time
        windowsCost: event.windows_job.windows_cost,
        windowsNotes: event.windows_job.windows_notes,
        pressureWashingCost: event.pressure_job.pressure_washing_cost,
        pressureWashingNotes: event.pressure_job.pressure_washing_notes,
        miscCost: event.misc_job.misc_cost,
        miscNotes: event.misc_job.misc_notes,
        email: event.email,
        description: event.notes,
        color: event.event_color,
        display: 'block', // Set calendar events to block style
      }));
      setDatabaseEvents(transformedEvents); // Upload to state
    } 
    catch (error) 
      {setError('Failed to fetch events. Please try again later.');}
  };

  // Handle 2 clicks for TimeGridMonth -> TimeGridDay & TimeGridDay -> Event Form
  const calendarClick = (info) => {
    const clickedDay = info.dateStr;
    const currentView = info.view.type;
  
    if (currentView === 'dayGridMonth') {
      setFreezeClicks(true);
      setTimeout(() => setFreezeClicks(false), 400); // Prevent double click
      info.view.calendar.changeView('timeGridDay', clickedDay);
    }
    else if (currentView === 'timeGridDay') {
      const timeClicked = info.dateStr.slice(0, -6);
      setClickedTime(timeClicked);
      openModal();
    }
  };

  // Retrieve & display information from state & Open Modal
  function eventClick(info) {
    if (freezeClicks) return; // Prevent double click 
    const clickedId = parseInt(info.event.id, 10);
    const foundEvent = databaseEvents.find(event => event.id === clickedId);
    setClickedEventData(foundEvent);
    openModal();
  };

  function openModal () {
    setIsModalOpen(true);
  };

  function closeModal () {
    setClickedEventData(null)
    setClickedTime(null);
    setIsModalOpen(false);
  };




  return (
    <div id="calendar">

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={databaseEvents}
        eventClick={eventClick}
        dateClick={calendarClick}
        ref={calendarRef}
        headerToolbar={{
          left: 'title',
          center: 'searchBarPlaceHolder',
          right: 'dayGridMonth',
        }}
        customButtons={{
          searchBarPlaceHolder: {
            text: '🔍 Search',
            click: function () 
              {console.log('Searchbar Placeholder clicked!');}
            }
          }}
        buttonText={{dayGridMonth: 'Calendar'}}
      />

      {isModalOpen && 
        <EventModal 
          closeModal={closeModal}
          eventData={clickedEventData}
          startTime={clickedTime}
          calendarRef={calendarRef}
          updateEvents={fetchAndSetEvents}
          setDatabaseEvents={setDatabaseEvents}
        />
      }
          
    </div>
  );
};

export default MyCalendar;