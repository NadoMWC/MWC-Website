import './dashboard.css'
import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');  // Get the JWT token from localStorage

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/calendar/view_events/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Add token to the Authorization header
                    },
                });

                setEventData(response.data);  // Update state with fetched data
                setLoading(false);  // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
                setLoading(false);  // Set loading to false if error occurs
                if (error.response && error.response.status === 401) {
                    window.location.href = '/login';  // Redirect to login if token is invalid or expired
                }
            }
        };

        fetchData();
    }, []);  // Empty dependency array to run only once on mount

    if (loading) {
        return <div>Loading...</div>;  // Show loading indicator while data is being fetched
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if data fetching fails
    }

    const stringData = JSON.stringify(eventData, null, 2);

    return (
        <div>
            <pre>{stringData}</pre>  {/* Display raw data in a readable format */}
        </div>
    );
}

export default Dashboard;
