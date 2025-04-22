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
  const suppressClickRef = useRef(false);

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
        suppressClickRef.current = true;
  
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 500); // Disable clicks for 0.5s
  
        if (endX < startX - swipeThreshold) {
          api?.next();
        } else if (endX > startX + swipeThreshold) {
          api?.prev();
        }
      }
    };
  
    const suppressClick = (e) => {
      if (suppressClickRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
  
    document.addEventListener('click', suppressClick, true); // use capture phase
  
    calendarEl.addEventListener('touchstart', handleTouchStart);
    calendarEl.addEventListener('touchend', handleTouchEnd);
    calendarEl.addEventListener('mousedown', handleMouseDown);
    calendarEl.addEventListener('mouseup', handleMouseUp);
  
    return () => {
      document.removeEventListener('click', suppressClick, true);
      calendarEl.removeEventListener('touchstart', handleTouchStart);
      calendarEl.removeEventListener('touchend', handleTouchEnd);
      calendarEl.removeEventListener('mousedown', handleMouseDown);
      calendarEl.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  
  
  

  // Handle date clicks (switch to day view from month view)
  const calendarClick = (info) => {
    const clickedDay = info.dateStr;
    const currentView = info.view.type;
  
    // If in Month View, Clicks will activate Day View & Enable Event Clicks
    if (currentView === 'dayGridMonth') {
      info.view.calendar.changeView('timeGridDay', clickedDay);
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
    console.log(info)
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
        display: 'block',
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
            text: 'Searchbar',
            click: function () {
              console.log('Searchbar Placeholder clicked!');
            },
          },
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