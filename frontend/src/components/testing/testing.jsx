import './testing.css';
import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function Testing() {
  const calendarRef = useRef(null);

  const handleDateClick = (info) => {
    console.log("Hello");
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.setOption('height', 700); // Set height dynamically
    }
  }, []);

  return (
    <div className='testing-calendar'>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        eventClick={handleDateClick} 
        dateClick={handleDateClick} 
      />
    </div>
  );
}

export default Testing;






// // Print the logged in admin Users ID
// const { user } = useAuth();
// useEffect(() => {
//   if (user && user.user_id) {
//     console.log('User data:', user.user_id);
//   }
// }, [user]);