import './calendar.css';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js'
import { useAuth } from '../../context/AuthContext.jsx';

// Pass in props to the Event Modal & Form
function EventModal({ closeModal, eventData, startTime, updateEvents, setDatabaseEvents, calendarRef }) {
  
  // React hooks
  const [modalClickLock, setModalClickLock] = useState(true); // Prevent double clicks
  const { user } = useAuth(); // Store&access user id (Logged in user)

  // On component mount, ensure no double clicks for .4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {setModalClickLock(false);}, 400);
    return () => clearTimeout(timer);
  }, []);

  // Close Modal if clicked outside main content area
  const handleOverlayClick = (e) => {
    if (modalClickLock) {return;}
    closeModal();
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
    closeModal();
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form className="form-content" style={{ pointerEvents: modalClickLock ? "none" : "auto" }} onSubmit={handleSubmit}> 

          <div className='form-name'>
            <label>Name:</label>
              <input className='form-name-input' type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className='form-address'>
            <label>Address:</label>
              <input className='form-address-input' type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className='form-phone'>
            <label>Phone:</label>
              <input className='form-phone-input' type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className='form-start-time'>
            <label>Start Time:</label>
              <input className='form-start-time-input' type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
          </div>

          <div className='form-end-time'>
            <label>End Time:</label>
              <input className='form-end-time-input' type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
          </div>

          <div className='job-cost-type-container'>
            <label>Job Type:</label>

              <div className='form-windows'>
                <label>Windows</label>
                  <input className='form-windows-checkbox' type="checkbox" name="windows" checked={formData.windows} onChange={handleCheckboxChange} />
                    {formData.windows && (
                      <div className='form-windows-inputs'>
                        <label>Cost:</label>
                          <input className='form-windows-cost-input' type="text" name="windows_cost" value={formData.windows_cost} onChange={handleChange} />
                        <label>Notes:</label>
                          <input className='form-windows-notes-input' type="text" name="windows_notes" value={formData.windows_notes} onChange={handleChange} />
                      </div>)}
              </div>

            <div className='form-pressure-washing'>
              <label>Pressure Washing</label>
                <input className='form-pressure-washing-checkbox' type="checkbox" name="pressureWashing" checked={formData.pressureWashing} onChange={handleCheckboxChange} />
                  {formData.pressureWashing && (
                    <div className='form-pressure-washing-inputs'>
                      <label>Cost:</label>
                        <input className='form-pressure-washing-cost-input' type="text" name="pressure_washing_cost" value={formData.pressure_washing_cost} onChange={handleChange} />
                      <label>Notes:</label>
                        <input className='form-pressure-washing-notes-input' type="text" name="pressure_washing_notes" value={formData.pressure_washing_notes} onChange={handleChange} />
                    </div>)}
            </div>

            <div className='form-misc-work'>
              <label>Misc Work</label>
                <input className='form-misc-work-checkbox' type="checkbox" name="misc" checked={formData.misc} onChange={handleCheckboxChange} />
                  {formData.misc && (
                    <div className='form-misc-work-inputs'>
                      <label>Cost:</label>
                        <input className='form-misc-work-cost-input' type="text" name="misc_cost" value={formData.misc_cost} onChange={handleChange} />
                      <label>Notes:</label>
                        <input className='form-misc-work-notes-input' type="text" name="misc_notes" value={formData.misc_notes} onChange={handleChange} />
                    </div>)}
            </div>
          </div>

          <div className='form-email'>
            <label>Email:</label>
              <input className='form-email-input' type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className='form-notes'>
            <label>General Notes:</label>
              <input className='form-notes-input' type="text" name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div className='form-color'>
            <label>Color: </label>
              <input className='form-color-input' type="color" name="event_color" value={formData.event_color} onChange={(e) =>
                setFormData({ ...formData, event_color: e.target.value })} />
          </div>

          {/* If event data exists, update event. Otherwise, save and create new event */}
          <button className='update-or-save-button' type="submit">
            {eventData ? 'Update Event' : 'Save New Event'}
          </button>

          {/* If event data exists, add a Remove Event/Delete button */}
          {eventData && (
            <button className='delete-event-button' type="button" onClick={handleDeleteEvent}>Remove Event</button>)
          }

          {/* Close window button - Always around */}
          <button className='close-window-button' type="button" onClick={closeModal}>Close Window</button>

        </form>
      </div>
    </div>
  );
};

export default EventModal;