import './calendar.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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
  
    console.log(eventData);

  // React hooks
  const [modalClickLock, setModalClickLock] = useState(true); // Prevent double clicks
  const [animateOut, setAnimateOut] = useState(false); 
  const { user } = useAuth(); // Store&access user id (Logged in user)
  const [startY, setStartY] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [colorsListOpen, setColorsListOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const modalRef = useRef(null);

  const [startMonthGrid, setStartMonthGrid] = useState(null);
  const [endMonthGrid, setEndMonthGrid] = useState(null);
  const [startTimeWheel, setStartTimeWheel] = useState(null);
  const [endTimeWheel, setEndTimeWheel] = useState(null);

  useEffect(() => {
    const dateObj = new Date(startTime);
    const dateOptions1 = {weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles'};
    const formattedStartDate = dateObj.toLocaleDateString('en-US', dateOptions1);
    setStartMonthGrid(formattedStartDate);
    const endDate = new Date(startTime);
    endDate.setHours(endDate.getHours() + 1);
    const dateOptions2 = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedEndDate = endDate.toLocaleDateString('en-US', dateOptions2);
    setEndMonthGrid(formattedEndDate);
    const timeObj = new Date(startTime);
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedStartTime = timeObj.toLocaleTimeString('en-US', timeOptions);
    setStartTimeWheel(formattedStartTime);
    const endTimeObj = new Date(timeObj.getTime() + 60 * 60 * 1000); // Add 1 hour (in milliseconds)
    const formattedEndTime = endTimeObj.toLocaleTimeString('en-US', timeOptions);
    setEndTimeWheel(formattedEndTime);
  }, []);

  // First: set up selectedColor based on eventData or user
  useEffect(() => {
    if (eventData && eventData.color) {
      setSelectedColor(eventData.color);
    } else {
      setSelectedColor(getUserColor(user?.user_id));
    }
  }, [eventData, user]); // <-- Only when eventData or user changes


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
      1: '#34A853',   // Drew Event Color  -  Basil Green
      2: '#FBC005',   // Jason Event Color -  Tangerine Orange
      3: '#039BE5',   // Wray Event Color  -  Peacock Blue
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
        event_color: eventData.color || '',
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

  const getColorNameFromRgb = (hex) => {
    const entry = Object.entries(google_colors_hex).find(([name, value]) => value === hex);
    return entry ? entry[0] : "Default Color"; // fallback if not found
  };
  

  const chooseColor = (name, hex) => {
    setSelectedColor(hex);
    setFormData((prevFormData) => ({
      ...prevFormData,
      event_color: hex,
    }));
    setColorsListOpen(false);
  };

  const google_colors_hex = {
    Tomato: "#EA4335",
    Tangerine: "#FBC005",
    Banana: "#FFF176",
    Basil: "#34A853",
    Sage: "#ADCC60",
    Peacock: "#039BE5",
    Blueberry: "#1A73E8",
    Lavendar: "#8C7CFF",
    Grape: "#7B1FA2",
    Flamingo: "#E91E63",
    Graphite: "#616161"
  };


  // **Start** - Section for handling start/end date/time clicks/divs
  const [showStartMonthGrid, setShowStartMonthGrid] = useState(false)
  const [showStartTimeGrid, setShowStartTimeGrid] = useState(false)
  const [showEndMonthGrid, setShowEndMonthGrid] = useState(false)
  const [showEndTimeGrid, setShowEndTimeGrid] = useState(false)

  const hideEndGrids = () => {
    setShowEndMonthGrid(false);
    setShowEndTimeGrid(false);
  };

  const hideStartGrids = () => {
    setShowStartMonthGrid(false);
    setShowStartTimeGrid(false);
  };

  const toggleStartMonthGrid = () => {
    hideEndGrids();
    if (showStartTimeGrid) {
        setShowStartTimeGrid(false);
        setShowStartMonthGrid(true);
    } 
    else {
        setShowStartMonthGrid(prev => !prev);
    }
  };

  const toggleStartTimeGrid = () => {
    hideEndGrids();
    if (showStartMonthGrid) {
      setShowStartMonthGrid(false);
      setShowStartTimeGrid(true);
    } 
    else {
      setShowStartTimeGrid(prev => !prev);
    }
  };

  const toggleEndMonthGrid = () => {
    hideStartGrids();
    if (showEndTimeGrid) {
        setShowEndTimeGrid(false);
        setShowEndMonthGrid(true);
    } 
    else {
        setShowEndMonthGrid(prev => !prev);
    }
  };

  const toggleEndTimeGrid = () => {
    hideStartGrids();
    if (showEndMonthGrid) {
      setShowEndMonthGrid(false);
      setShowEndTimeGrid(true);
    } 
    else {
      setShowEndTimeGrid(prev => !prev);
    }
  };

  // **END** - Section for handling start/end date/time clicks/divs



  const [selected, setSelected] = useState();

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

          <div className='form-row-time'>
            <div className='form-date-container'>
              <div className='form-date-container-row' onClick={toggleStartMonthGrid}>
                {eventData.start || startMonthGrid}
              </div>
              <div className='form-date-container-row' onClick={toggleStartTimeGrid}>
                {eventData.start || startMonthGrid}
              </div>
            </div>
            {(showStartMonthGrid && !showStartTimeGrid) && (
              <div className='month-grid-selector'>
                <div className='form-calendar-grid'>
                  <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                  />
                  {selected && <p>You picked: {selected.toDateString()}</p>}
                </div>
              </div>
            )}
            {(showStartTimeGrid && !showStartMonthGrid) && (
              <div className='time-wheel-selector'>
                <p> Start Time Wheel Selector</p>
              </div>
            )}
          </div>

          <div className='form-row-time'>
            <div className='form-date-container'>
              <div className='form-date-container-row' onClick={toggleEndMonthGrid}>{endMonthGrid}</div>
              <div className='form-date-container-row' onClick={toggleEndTimeGrid}>{endTimeWheel}</div>
            </div>
            {(showEndMonthGrid && !showEndTimeGrid) && (
              <div className='month-grid-selector'>
                <p> End Month Grid Selector</p>
              </div>
            )}
            {(showEndTimeGrid && !showEndMonthGrid) && (
              <div className='time-wheel-selector'>
                <p> End Time Wheel Selector</p>
              </div>
            )}
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

          <div className='form-row-color-div'>
            <div className='form-color-main-row' onClick={() => setColorsListOpen(prev => !prev)}>
              <img className="form-image-logo" src={Colors}></img>
              <div className="color-testing-container"
                   style={
                      {
                        height: '25px',
                        width: '25px',
                        borderRadius: '4px',
                        backgroundColor: selectedColor,
                        marginRight: '10px',
                      }
                    }>
              </div>
              <div className="form-selected-color">{getColorNameFromRgb(selectedColor)}</div>
            </div>
            {colorsListOpen && (
              <div className='colors-list'>
                {Object.entries(google_colors_hex).map(([name, hex]) => (
                  <div 
                    key={name} 
                    className='color-option'
                    onClick={() => chooseColor(name, hex)} 
                    style={
                        { display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }
                      }>
                    <div style={
                      { width: '16px', height: '16px', backgroundColor: hex, marginRight: '8px', borderRadius: '4px' }
                      }>
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            )}    
          </div>

          <hr></hr>

          <div className='.form-row-div'>
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
            <label className='form-label'>Misc Work</label>
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

          {/* If event exists - Add Delete button */}
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