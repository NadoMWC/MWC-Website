import './calendar.css'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js'


function TestModal({ closeModal, handleOverlayClick, eventData }) {

    const [formData, setFormData] = useState({
        name: eventData ? eventData.title : '',
        address: eventData ? eventData.address : '',
        cost: eventData ? eventData.cost : '',
        date: eventData ? eventData.start.toISOString().split('T')[0] : '', // Extract date part of start
    });

    // Update formData when eventData changes
    useEffect(() => {
    if (eventData) {
        setFormData({
            name: eventData.title,
            address: eventData.address,
            cost: eventData.cost,
            date: eventData.start.toISOString().split('T')[0], // Extract date part of start
        });}
    }, [eventData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({...prevState,[name]: value,}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Get the JWT token from localStorage
        const token = localStorage.getItem('access_token');
    
        // If token exists, proceed with submitting the form
        if (token) {
            // Create the form data to send to the backend
            const eventData = {
                name: formData.name,
                address: formData.address,
                cost: formData.cost,
                date: formData.date, // Pass the date as a string (in format 'YYYY-MM-DD')
            };
    
            // Send the data to the backend using axios
            axiosInstance
                .post('http://127.0.0.1:8000/api/calendar/create_events/', eventData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                })
                .then((response) => {
                    console.log('Event created successfully:', response.data);
                    // Handle success (e.g., close modal, show success message, etc.)
                })
                .catch((error) => {
                    console.error('Error creating event:', error);
                    // Handle error (e.g., show error message)
                });
        } else {
            console.error('No access token found');
            // Handle case where no token is found (e.g., redirect to login page)
        }
    };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>

            <div>
                <label>Name: </label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                />
            </div>

            <div>
                <label>Address: </label>
                <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                />
            </div>

            <div>
                <label>Cost: </label>
                <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                />
            </div>

            <div>
                <label>Date: </label>
                <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                />
            </div>

            {eventData ? (
                <>
                    <button onClick={closeModal}>Update Event</button>
                    <button onClick={closeModal}>Remove Event</button>
                </>
                ) : (
                <>
                    <button type="submit">Save New Event</button>
                </>
            )}
        </form>
        <button onClick={closeModal}>Close Window</button>
      </div>
    </div>
  );
};

export default TestModal;