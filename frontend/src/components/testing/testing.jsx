import './testing.css';
import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function Testing() {

  return (
    <div className='testing-calendar-container'>
      <FullCalendar
        className='testing-calendar'
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
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



