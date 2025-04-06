import { useState, useEffect } from "react";
import axios from "axios";

const EventForm = ({ selectedEvent }) => {
  const [formData, setFormData] = useState({
    name: selectedEvent?.title || "",
    address: selectedEvent?.address || "",
    phone: selectedEvent?.phone || "",
    email: selectedEvent?.email || "",
    cost: selectedEvent?.cost || "",
    date: selectedEvent?.start || "",
    time: selectedEvent?.time || "",
    notes: selectedEvent?.notes || "",
  });

  // Update formData if selectedEvent changes
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
        notes: selectedEvent?.notes || "",
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedEvent) {
        // If selectedEvent exists, update the existing event (PUT request)
        const response = await axios.put(
          `http://127.0.0.1:8000/api/calendar/update_events/${selectedEvent.id}/`,
          formData
        );

        if (response.status === 200) {
          console.log("Successfully updated event");
          window.location.reload(); // Reload to see the updated data
        } else {
          console.error("Failed to update event");
        }
      } else {
        // If selectedEvent does not exist, create a new event (POST request)
        const response = await axios.post(
          "http://127.0.0.1:8000/api/calendar/create_events/",
          formData
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
      <p>Window 2</p>

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

        <button type="submit">{selectedEvent ? "Update Event" : "Create Event"}</button>
      </form>
    </div>
  );
};

export default EventForm;















