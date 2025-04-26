import './calendar.css';
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance.js'
import { useAuth } from '../../context/AuthContext.jsx';
import Email from './email_logo.jpg';
import Location from './location_logo.png';
import Phone from './phone_logo.jpg';
import Notes from './notes_logo.jpg';
import Colors from './color_palette.jpg';

// Pass in props to the Event Modal & Form
function EventModal({ closeModal, eventData, startTime, updateEvents, setDatabaseEvents, calendarRef }) {
  
  // React hooks
  const [modalClickLock, setModalClickLock] = useState(true); // Prevent double clicks
  const [animateOut, setAnimateOut] = useState(false); 
  const { user } = useAuth(); // Store&access user id (Logged in user)

  const [startY, setStartY] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);

  const modalRef = useRef(null);

  // Track & handle scroll
  const handleScroll = () => {
    if (modalRef.current) 
          {setScrollTop(modalRef.current.scrollTop);}
  };

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;
  
    modalEl.addEventListener("scroll", handleScroll);
    modalEl.addEventListener("touchstart", handleTouchStart);
    modalEl.addEventListener("touchend", handleTouchEnd);
  
    return () => {
      modalEl.removeEventListener("scroll", handleScroll);
      modalEl.removeEventListener("touchstart", handleTouchStart);
      modalEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollTop, startY]);

  const handleTouchEnd = (e) => {
    if (startY === null) return;

    const endY = e.changedTouches[0].clientY;
    const diff = endY - startY;
    const SWIPE_THRESHOLD = 350; // pixels

    if (diff > SWIPE_THRESHOLD && scrollTop === 0) 
      {handleClose(); }

    setStartY(null);
  };

  // On component mount, ensure no double clicks for .4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {setModalClickLock(false);}, 400);
    return () => clearTimeout(timer);
  }, []);

  // Close Modal if clicked outside main content area
  const handleOverlayClick = (e) => {
    if (modalClickLock) {return;}
    handleClose();
  };

  // Constantly update state so it's always ready for submission
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Track checkbox state changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Ensure a clean state reset and view change
  const clearAndReloadEvents = () => {
    handleClose();
    setDatabaseEvents(null);
    updateEvents();
    calendarRef.current?.getApi().changeView('dayGridMonth');
  };
  
  // Set default end time 1hr later than startTime
  const calculateEndTime = (startTime) => {
    const format = new Date(startTime);
    format.setHours(format.getHours() - 6);  // Subtract 6 to account for Pacific time related to UTC time
    return format.toISOString().slice(0, 19);
  };
  
  // Set default color based on logged in user
  const getUserColor = (userId) => {
    const colorMap = {
      1: '#477e11',   // Drew Event Color  -  Basil Green
      2: '#ffa500',   // Jason Event Color -  Gold Orange
      3: '#3f96fc',   // Wray Event Color  -  Standard Light Blue
    };  
    return colorMap[userId] || '#0000ff'; // Default fallback color
  }

  // Store data in state - Used to submit properly formatted data
  const [formData, setFormData] = useState({
    name: eventData?.title || '',
    address: eventData?.address || '',
    phone: eventData?.phone || '',
    start_time: eventData?.start || startTime || '',
    end_time: eventData?.end || calculateEndTime(startTime) || '',
    windows_cost: eventData?.windowsCost || '',
    windows_notes: eventData?.windowsNotes || '',
    pressure_washing_cost: eventData?.pressureWashingCost || '',
    pressure_washing_notes: eventData?.pressureWashingNotes || '',
    misc_cost: eventData?.miscCost || '', 
    misc_notes: eventData?.miscNotes || '',
    email: eventData?.email || '',
    notes: eventData?.description || '', 
    event_color: eventData?.color || getUserColor(user?.user_id) || '',
    event: eventData?.id || '',
    windows: !!eventData?.windowsCost,
    pressureWashing: !!eventData?.pressureWashingCost,
    misc: !!eventData?.miscCost,
  });

  // Update Form state whenever Event Data is modified/updated
  useEffect(() => {
    if (eventData) {
      setFormData({
        name: eventData.title || '',
        address: eventData.address || '',
        phone: eventData.phone || '',
        start_time: eventData.start || startTime || '',
        end_time: eventData.end || calculateEndTime(startTime) || '',
        windows_cost: eventData.windowsCost || '',
        windows_notes: eventData.windowsNotes || '',
        pressure_washing_cost: eventData.pressureWashingCost || '',
        pressure_washing_notes: eventData.pressureWashingNotes || '',
        misc_cost: eventData.miscCost || '',
        misc_notes: eventData.miscNotes || '',
        email: eventData.email || '',
        notes: eventData.description || '',
        event_color: eventData.color || getUserColor(user?.user_id) || '',
        event: eventData.id || '',
        windows: !!eventData.windowsCost,
        pressureWashing: !!eventData.pressureWashingCost,
        misc: !!eventData.miscCost,
      });
    }
  }, [eventData]); // Makes sure this hook runs when eventData is updated

  // Create & Update event in database 
  const handleSubmit = async (e) => {

    // If valid token exist, attempt to Create or Update
    e.preventDefault();
    const token = localStorage.getItem('access_token'); 
    if (token) {

      // Create event if event data does not exist
      if (!eventData) {
        try {
          const response = await axiosInstance.post(
            'http://127.0.0.1:8000/api/calendar/create_events/',
            formData,
            {headers: {Authorization: `Bearer ${token}`}});

          // Success - Event created - Now clear state and reload calendar
          if (response.status === 200 || response.status === 201) 
            {clearAndReloadEvents();} 
          else 
            {console.error('Unexpected response status when creating event:', response.status);}
          }
        catch (error) 
          {console.error('Failed to create event:', error.response?.data || error.message);}
        }
      
      // Update event if event data does exists
      else {
        try {
          const response = await axiosInstance.put(
            `http://127.0.0.1:8000/api/calendar/update_events/${eventData.id}/`,
            formData,
            {headers: {Authorization: `Bearer ${token}`}});

            // Success - clear state and reload calendar
            if (response.status === 200 || response.status === 204)
              {clearAndReloadEvents();} 
            else 
              {console.error('Unexpected response status when updating event:', response.status);}
            }
        catch (error) 
          {console.error('Failed to update event:', error.response?.data || error.message);}}
        } 
    else 
      {console.log("No valid token found")}
  };

  // Delete event from database
  const handleDeleteEvent = async () => {
    // If token exist, attempt to delete
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await axiosInstance.delete(`http://127.0.0.1:8000/api/calendar/delete_events/${eventData.id}/`,
          {headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'}});

        // Success - Event deleted - Clear/update state & reload calendar
        if (response.status === 204 || response.status === 200) 
          {clearAndReloadEvents();} 
        else 
          {console.error('Unexpected Response:', response)}
        }
      catch (error) 
          {console.error('Delete failed:', error.response?.data || error.message);}
        }
    else 
      {console.log("No Valid Token Found")}
  };

  // Close Modal & Handle open/close animation state
  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      closeModal(); 
    }, 500); // match CSS animation duration
  };



  const google_colors_rgb = {
    Tomato: "rgb(234, 67, 53)",
    Tangerine: "rgb(251, 188, 5)",
    Banana: "rgb(255, 241, 118)",
    Basil: "rgb(52, 168, 83)",
    Sage: "rgb(173, 204, 96)",
    Peacock: "rgb(3, 155, 229)",
    Blueberry: "rgb(26, 115, 232)",
    Lavendar: "rgb(140, 124, 255)",
    Grape: "rgb(123, 31, 162)",
    Flamingo: "rgb(233, 30, 99)",
    Graphite: "rgb(97, 97, 97)"
  };


  const [colorsListOpen, setColorsListOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div  className={`modal-content ${animateOut ? "modal-exit" : "modal-enter"}`} 
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}>
        <form className="form-container" style={{ pointerEvents: modalClickLock ? "none" : "auto" }} onSubmit={handleSubmit}> 
          
          <div className='top-page-nav'>
            <button className='top-button' type="button" onClick={handleClose}>Close</button>
            <button className='top-button' type="submit">Save</button>
          </div>

          <div className='form-row-name'>
              <input className='form-input-field' placeholder="Add title/name" type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-div'>
              <input className='form-input-field-time' type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
          </div>

          <div className='form-row-div'>
              <input className='form-input-field-time' type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-div'>
            <img className="form-image-logo" src={Location}></img>
              <input className='form-input-field-info' placeholder="Add location" type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-div'>
            <img className="form-image-logo" src={Phone}></img>
              <input className='form-input-field-info' placeholder="Add phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-div'>
            <img className="form-image-logo" src={Email}></img>
              <input className='form-input-field-info' placeholder="Add email" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-div'>
            <img className="form-image-logo" src={Notes}></img>
              <textarea className='form-input-field-notes' placeholder="Add notes" type="text" name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <hr></hr>

          <div className='form-row-color-div' onClick={() => setColorsListOpen(prev => !prev)}>
            <div className='form-color-main-row'>
              <img className="form-image-logo" src={Colors}></img>
              <div className="color-testing-container"></div>
              <div className="form-selected-color">Default Color</div>
            </div>
            {colorsListOpen && (
              <div className='colors-list'>
                {Object.entries(google_colors_rgb).map(([name, rgb]) => (
                  <div key={name} className='color-option' style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: rgb, marginRight: '8px', borderRadius: '4px' }}></div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            )}    
          </div>

          <hr></hr>

          <div className='.form-windows'>
            <label className='form-label'>Window Cleaning</label>
              <input className='form-checkbox' type="checkbox" name="windows" checked={formData.windows} onChange={handleCheckboxChange} />
                {formData.windows && (
                  <div>

                    <div className='form-row-div'>
                    <label style={{ fontSize: '30px' }}>$</label>
                        <input className='form-cost-field' placeholder="" type="text" name="windows_cost" value={formData.windows_cost} onChange={handleChange} />
                    </div>
                    <div className='form-textarea'>
                        <textarea className='form-textarea-notes' placeholder="Description" type="text" name="windows_notes" value={formData.windows_notes} onChange={handleChange} />
                    </div>

                  </div>
                )}
          </div>

          <hr></hr>

          <div className='.form-row-div'>
            <label className='form-label'>Pressure Washing</label>
              <input className='form-checkbox' type="checkbox" name="pressureWashing" checked={formData.pressureWashing} onChange={handleCheckboxChange} />
                {formData.pressureWashing && (
                  <div>
                    <div className='form-row-div'>
                      <label style={{ fontSize: '30px' }}>$</label>
                        <input className='form-cost-field' placeholder="" type="text" name="pressure_washing_cost" value={formData.pressure_washing_cost} onChange={handleChange} />
                    </div>
                    <div className='form-row-div'>
                        <textarea className='form-textarea-notes' placeholder="Description" type="text" name="pressure_washing_notes" value={formData.pressure_washing_notes} onChange={handleChange} />
                    </div>
                  </div>
                )}
          </div>

          <hr></hr>

          <div className='.form-row-div'>
            <label className='form-label'>Miscellaneous Work</label>
              <input className='form-checkbox' type="checkbox" name="misc" checked={formData.misc} onChange={handleCheckboxChange} />
                {formData.misc && (
                  <div>
                    <div className='form-row-div'>
                      <label style={{ fontSize: '30px' }}>$</label>
                        <input className='form-cost-field' placeholder="" type="text" name="misc_cost" value={formData.misc_cost} onChange={handleChange} />
                    </div>
                    <div className='form-row-div'>
                        <textarea className='form-textarea-notes' placeholder="Description" type="text" name="misc_notes" value={formData.misc_notes} onChange={handleChange} />
                    </div>
                  </div>                   
                )}
          </div>

          <hr></hr>

          {/* If event exists - Add Remove Event/Delete button */}
          {eventData && (
            <button className='delete-event-button' type="button" onClick={handleDeleteEvent}>Remove Event</button>)
          }

          <div className='form-spacer'></div>  {/* Spacer for bottom of page */}
        </form>
      </div>
    </div>
  );
};

export default EventModal;