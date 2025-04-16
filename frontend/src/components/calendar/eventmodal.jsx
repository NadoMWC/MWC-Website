import './calendar.css';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js'
import { useAuth } from '../../context/AuthContext.jsx';

function EventModal({ 
  closeModal, 
  handleOverlayClick, 
  eventData, 
  startTime,  
  updateEvents,
  setDatabaseEvents,
  calendarRef
  }) {

  if (eventData) 
    console.log(eventData.id)
  
  // Set default end time through startTime
  const calculateEndTime = (startTime) => {
    const format = new Date(startTime);
    format.setHours(format.getHours() - 6);  // Subtract 6 to account for Pacific time related to UTC time
    return format.toISOString().slice(0, 19);
  };
  
  // Set default color based on logged in user/admin
  const { user } = useAuth();
  const getUserColor = (userId) => {
    const colorMap = {
      1: '#477e11',   // Drew Event Color  -  Basil Green
      2: '#ffa500',   // Jason Event Color -  Gold Orange
      3: '#3f96fc',   // Wray Event Color  -  Standard Light Blue
    };  
    return colorMap[userId] || '#0000ff'; // Default fallback color
  }

  // Main data form for state variables
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

  // UseEffect to ensure eventData is being updated, thus updating the state.
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
  }, [eventData]);

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

  const clearAndReloadEvents = () => {
    closeModal();
    setDatabaseEvents(null);
    updateEvents();
    calendarRef.current?.getApi().changeView('dayGridMonth');
  };


  // Create & Update event in database 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    // If valid token exist, attempt to Create or Update 
    if (token) {
      // Create new event if event data doesn't exist
      if (!eventData) {
        try {
          const response = await axiosInstance.post(
            'http://127.0.0.1:8000/api/calendar/create_events/',
            formData,
            {headers: {Authorization: `Bearer ${token}`}});

          // Successful Response (200 or 201)
          if (response.status === 200 || response.status === 201) {
              clearAndReloadEvents();
              console.log('Data sent successfully:', response.data);
            } 

          // Show errors on bad response
          else 
            {console.error('Unexpected response status when creating event:', response.status);}
          }
        // Handle errors from the request
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

            // Successful Response (200 or 204)
            if (response.status === 200) 
              {console.log('Data sent successfully!', response.data);
                clearAndReloadEvents();} 
              
            else if (response.status === 204) 
              {console.log('Data sent successfully! No response given');
                clearAndReloadEvents();} 

            // Show errors on bad response
            else 
              {console.error('Unexpected response status when updating event:', response.status);}
            }
        // Handle errors from the request
        catch (error) 
          {console.error('Failed to update event:', error.response?.data || error.message);}}
        } 
    // If no token found in local storage
    else 
      {console.log("No valid token found")}
  };




  // Delete event from database
  const handleDeleteEvent = async () => {
    const token = localStorage.getItem("access_token");

    // If valid token exist, attempt to delete 
    if (token) {
      try {
        const response = await axiosInstance.delete(`http://127.0.0.1:8000/api/calendar/delete_events/${eventData.id}/`,
          {headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'}});

        // On successful response (204 or 200)
        if (response.status === 204 || response.status === 200) {
          clearAndReloadEvents();
          console.log("Successful Delete")
        } 
        // Show errors on bad response
        else 
          {console.error('Unexpected Response:', response)}
        }
      // Handle errors from the request
      catch (error) 
          {console.error('Delete failed:', error.response?.data || error.message);}
        }
    // If no token found in local storage
    else 
      {console.log("No Valid Token Found")}
  };





  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}> 
          <div><label>Name:</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
          <div><label>Address:</label><input type="text" name="address" value={formData.address} onChange={handleChange} /></div>
          <div><label>Phone:</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} /></div>

          <div>
            <label>Start Time:</label>
            <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
          </div>

          <div>
            <label>End Time:</label>
            <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
          </div>

          <div>
            <label>Job Type:</label>
            <div>
              <label><input type="checkbox" name="windows" checked={formData.windows} onChange={handleCheckboxChange} /> Windows</label>
              {formData.windows && (
                <div>
                  <label>Cost:</label>
                  <input type="text" name="windows_cost" value={formData.windows_cost} onChange={handleChange} />
                  <label>Notes:</label>
                  <input type="text" name="windows_notes" value={formData.windows_notes} onChange={handleChange} />
                </div>
              )}
            </div>

            <div>
              <label><input type="checkbox" name="pressureWashing" checked={formData.pressureWashing} onChange={handleCheckboxChange} /> Pressure Washing</label>
              {formData.pressureWashing && (
                <div>
                  <label>Cost:</label>
                  <input type="text" name="pressure_washing_cost" value={formData.pressure_washing_cost} onChange={handleChange} />
                  <label>Notes:</label>
                  <input type="text" name="pressure_washing_notes" value={formData.pressure_washing_notes} onChange={handleChange} />
                </div>
              )}
            </div>

            <div>
              <label><input type="checkbox" name="misc" checked={formData.misc} onChange={handleCheckboxChange} /> Misc Work</label>
              {formData.misc && (
                <div>
                  <label>Cost:</label>
                  <input type="text" name="misc_cost" value={formData.misc_cost} onChange={handleChange} />
                  <label>Notes:</label>
                  <input type="text" name="misc_notes" value={formData.misc_notes} onChange={handleChange} />
                </div>
              )}
            </div>
          </div>

          <div><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>

          <div>
            <label>General Notes:</label>
            <input type="text" name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div>
            <label>Color: </label>
            <input type="color" name="event_color" value={formData.event_color} onChange={(e) =>
              setFormData({ ...formData, event_color: e.target.value })} />
          </div>

          <button type="submit">{eventData ? 'Update Event' : 'Save New Event'}</button>
          {eventData && (
            <button type="button" onClick={handleDeleteEvent}>Remove Event</button>)}
          <button type="button" onClick={closeModal}>Close Window</button>
        </form>
      </div>
    </div>
  );
}

export default EventModal;

