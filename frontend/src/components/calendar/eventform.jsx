import { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import { useAuth } from '../../context/AuthContext.jsx'

const EventForm = ({ selectedEvent, date, closeModal }) => {

  // Access User Info and log id to ensure its working
  const { user } = useAuth();
  useEffect(() => {console.log('User data:', user.user_id);}, [user]);

  // Get the token from localStorage
  const token = localStorage.getItem("access_token");
  const headers = {Authorization: `Bearer ${token}`,};
  const colorMapping = {1: '#1E3A8A', 2: '#3B82F6', 3: '#93C5FD'};
  const defaultColor = colorMapping[user.user_id] || '#FF6347'; // Fallback to light red if no match
  
  // Form Data to be sent in request
  const [formData, setFormData] = useState({
    name: selectedEvent?.title || "",
    address: selectedEvent?.address || "",
    phone: selectedEvent?.phone || "",
    email: selectedEvent?.email || "",
    cost: selectedEvent?.cost || "",
    date: date || "",
    time: selectedEvent?.time || "",
    notes: selectedEvent?.description || "",
    color: defaultColor || "",
  });

  // If selected Event exist, populate the formdata with the existing information.
  useEffect(() => {if (selectedEvent) {setFormData({
        name: selectedEvent?.title || "",
        address: selectedEvent?.address || "",
        phone: selectedEvent?.phone || "",
        email: selectedEvent?.email || "",
        cost: selectedEvent?.cost || "",
        date: selectedEvent?.start || "",
        time: selectedEvent?.time || "",
        notes: selectedEvent?.description || "",
        color: selectedEvent?.color || "",
      });}}, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // DELETE/REMOVE EVENT
  const handleRemoveEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await axiosInstance.delete(
          `http://127.0.0.1:8000/api/calendar/delete_events/${selectedEvent.id}/`,
          {headers});
  
        if (response.status === 200) {
          console.log("Successfully removed event");
          closeModal(); 
          window.location.reload();}
        else {console.error("Failed to remove event");}
      } 
      catch (error) {console.error("Error removing event:", error);}
    }
  };

  // Create or Update an event based on if an event exist
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Make sure the Name & Date entries are not blank
    if (!formData.name.trim()) {alert('Event name/title is required'); return;}
    if (!formData.date.trim()) {alert('Event date is required'); return;}
  
    // Prepare the form data for submission
    const eventData = {
      ...formData,
      address: formData.address || null,
      phone: formData.phone || null,
      email: formData.email || null,
      cost: formData.cost || null,
      time: formData.time || null,
      notes: formData.notes || null, 
      color: formData.color || null,};
      
    try {

      // UPDATE EXISTING EVENT
      if (selectedEvent) {
        const response = await axiosInstance.put(
          `http://127.0.0.1:8000/api/calendar/update_events/${selectedEvent.id}/`,
          eventData, {headers});
        if (response.status === 200) 
          {console.log("Successfully updated event");
          window.location.reload();} 
        else 
          {console.error("Failed to update event");}} 

      // CREATE NEW EVENT
      else {
        const response = await axiosInstance.post(
          "http://127.0.0.1:8000/api/calendar/create_events/",
          eventData,{headers});
  
        if (response.status === 201) 
          {console.log("Successfully created event");
          window.location.reload();} 
        else 
          {console.error("Failed to create event");}}} 

        catch (error) {console.error("Error submitting form:", error);}
  };

  return (
    <div>
      <p>{date}</p>
      <form onSubmit={handleSubmit}>
        <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>

        <label>Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}/></label>

        <label>Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}/></label>

        <label>Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}/></label>

        <label>Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}/></label>

        <label>Cost:
          <input
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}/></label>

        <label>Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}/></label>

        <label>Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}/></label>

        <label>Notes:
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}/></label>

        <label>Color:
          <input 
            type="color" 
            name="color" 
            value={formData.color} 
            onChange={handleChange}/></label>

        <button type="submit">{selectedEvent ? "Update Event" : "Create Event"}</button>
        <button onClick={selectedEvent ? handleRemoveEvent : closeModal}>
                        {selectedEvent ? "Remove Event" : "Cancel Event"}</button>
      </form>
    </div>
  );
};

export default EventForm;
