import { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import { useAuth } from '../../context/AuthContext.jsx'

const EventForm = ({ selectedEvent, date, closeModal }) => {

  const { user } = useAuth();
  useEffect(() => {console.log('User data:', user.user_id);}, [user]);
  const colorMapping = {
    1: '#1E3A8A', // Drew Default Color // Dark Blue
    2: '#3B82F6', // Jason Default Color // Normal Blue
    3: '#93C5FD', // Wray Default Color // Light Blue
  };

  const defaultColor = colorMapping[user.user_id] || '#FF6347'; // Fallback to light red if no match

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

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        name: selectedEvent?.title || "",
        address: selectedEvent?.address || "",
        phone: selectedEvent?.phone || "",
        email: selectedEvent?.email || "",
        cost: selectedEvent?.cost || "",
        date: selectedEvent?.start || "",
        time: selectedEvent?.time || "",
        notes: selectedEvent?.description || "",
        color: selectedEvent?.color || "",
      });
    }
  }, [selectedEvent]);

  

  // Get the token from localStorage
  const token = localStorage.getItem("access_token");
  const headers = {Authorization: `Bearer ${token}`,};

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
          {headers}
        );
  
        if (response.status === 200) {
          console.log("Successfully removed event");
          closeModal(); // Close the modal after deletion
          window.location.reload(); // Reload to see the updated data
        } else {
          console.error("Failed to remove event");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error removing event:", error);
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure that the name/title is not empty
    if (!formData.name.trim()) {
      alert('Event name/title is required');
      return; // Don't submit if name is missing
    }

    if (!formData.date.trim()) {
      alert('Event date is required');
      return; // Don't submit if date is missing
    }
  
    // Prepare the form data for submission (make other fields null if empty)
    const eventData = {
      ...formData,
      address: formData.address || null,
      phone: formData.phone || null,
      email: formData.email || null,
      cost: formData.cost || null,
      time: formData.time || null,
      notes: formData.notes || null, 
      color: formData.color || null, 
    };
  
    try {
      if (selectedEvent) {
        // If selectedEvent exists, update the existing event (PUT request)
        const response = await axiosInstance.put(
          `http://127.0.0.1:8000/api/calendar/update_events/${selectedEvent.id}/`,
          eventData,
          { headers }
        );
  
        if (response.status === 200) {
          console.log("Successfully updated event");
          window.location.reload(); // Reload to see the updated data
        } else {
          console.error("Failed to update event");
        }
      } else {
        // If selectedEvent does not exist, create a new event (POST request)
        const response = await axiosInstance.post(
          "http://127.0.0.1:8000/api/calendar/create_events/",
          eventData,
          { headers }
        );
  
        if (response.status === 201) {
          console.log("Successfully created event");
          window.location.reload(); // Reload to show the newly created event
        } else {
          console.error("Failed to create event");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <p>{date}</p>
      <form onSubmit={handleSubmit}>
        <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>

        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Cost:
          <input
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </label>

        <label>
          Notes:
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>

        <label>
        Color:
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}/>
        </label>

        
        <button type="submit">{selectedEvent ? "Update Event" : "Create Event"}</button>
        <button onClick={selectedEvent ? handleRemoveEvent : closeModal}>
                        {selectedEvent ? "Remove Event" : "Cancel Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;















