import './calendar.css';
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import TestModal from './testmodal.jsx'

function MyCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [canCloseModal, setCanCloseModal] = useState(false);
  const [clickedEventData, setClickedEventData] = useState(null);


  // Handle date clicks (switch to day view from month view)
  const calendarClick = (info) => {
    const clickedDay = info.dateStr;
    const currentView = info.view.type;
  
    // If in Month View, Clicks will activate Day View & Enable Event Clicks
    if (currentView === 'dayGridMonth') {
      info.view.calendar.changeView('timeGridDay', clickedDay);
      enableEventClicks()
    }

    // Set Day View Click to Open Event Form Modal
    else if (currentView === 'timeGridDay') {
      openModal();
    }
  };

  function eventClick(info) {
    const eventDetails = {
      title: info.event.title,
      address: info.event.extendedProps.address,
      cost: info.event.extendedProps.cost,
      start: info.event.start,
      end: info.event.end,
    };
    setClickedEventData(eventDetails); // Pass event data to state
    setIsModalOpen(true); // Open modal
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
    setTimeout(() => { enableEventClicks(); }, 250); 
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

  // Event data
  const events = [
    {
      title: 'Window Cleaning - Home',
      address: '123 Maple St, Springfield, IL',
      cost: 150,
      start: '2025-04-10T09:00:00',
      end: '2025-04-10T11:00:00',
    },
    {
      title: 'Pressure Washing - Office Building',
      address: '456 Oak Ave, Springfield, IL',
      cost: 300,
      start: '2025-04-11T10:30:00',
      end: '2025-04-11T13:00:00',
    },
    {
      title: 'Miscellaneous Cleaning - Warehouse',
      address: '789 Pine Rd, Springfield, IL',
      cost: 200,
      start: '2025-04-12T08:00:00',
      end: '2025-04-12T10:00:00',
    },
    {
      title: 'Window Cleaning - Condo',
      address: '321 Birch Blvd, Springfield, IL',
      cost: 100,
      start: '2025-04-13T14:00:00',
      end: '2025-04-13T16:00:00',
    },
    {
      title: 'Pressure Washing - Patio',
      address: '654 Cedar Dr, Springfield, IL',
      cost: 120,
      start: '2025-04-14T11:00:00',
      end: '2025-04-14T12:30:00',
    },
    {
      title: 'Gutter Cleaning - Garage',
      address: '111 Elm St, Springfield, IL',
      cost: 90,
      start: '2025-04-10T10:30:00', 
      end: '2025-04-10T12:00:00',
    },
    {
      title: 'Roof Inspection',
      address: '222 Walnut St, Springfield, IL',
      cost: 180,
      start: '2025-04-11T08:00:00', 
      end: '2025-04-11T09:30:00',
    },
    {
      title: 'Deck Cleaning',
      address: '333 Cherry Ln, Springfield, IL',
      cost: 140,
      start: '2025-04-12T14:00:00',
      end: '2025-04-12T15:30:00',
    },
  ];






  return (
    <div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={eventClick}
        dateClick={calendarClick}
        headerToolbar={{
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />

      {isModalOpen && 
        <TestModal 
          closeModal={closeModal}
          handleOverlayClick={handleOverlayClick}
          eventData={clickedEventData}
          />
      }
          

    </div>
  );
}

export default MyCalendar;