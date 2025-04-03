import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ existingInformation }) => {
  const [formData, setFormData] = useState({
    name: existingInformation.title || "",
    address: existingInformation.address || "",
    phone: existingInformation.phone || "",
    email: existingInformation.email || "",
    cost: existingInformation.cost || "",
    date: existingInformation.date || "",
    time: existingInformation.time || "",
    notes: existingInformation.notes || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Log data to console for debugging purposes
    console.log("Form Data:", formData);

    try {
      // Send POST request to your backend API to store the data
      const response = await axios.post('http://127.0.0.1:8000/api/calendar/create_event/', formData);

      // If the response is OK, log success or perform additional actions
      console.log('Event saved successfully:', response.data);
      // Optionally, redirect or clear the form after submission
    } catch (error) {
      // Handle error if the POST request fails
      console.error('Error during POST request:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-96">
      <h2 className="text-xl font-semibold mb-4">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col">
          <label className="font-medium">Name</label>
          <input
            className="border rounded p-2"
            type="text"
            name="name"
            value={formData.name} // Controlled component
            onChange={handleChange}
            placeholder={existingInformation.title}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Address</label>
          <input
            className="border rounded p-2"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Phone</label>
          <input
            className="border rounded p-2"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            className="border rounded p-2"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Cost</label>
          <input
            className="border rounded p-2"
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Date</label>
          <input
            className="border rounded p-2"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Time</label>
          <input
            className="border rounded p-2"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Notes</label>
          <textarea
            className="border rounded p-2"
            rows="3"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Save Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
