const eventData = [
    { name: "John Doe", age: 25, city: "New York" },
    { name: "Jane Smith", age: 30, city: "Los Angeles" },
    { name: "Mike Johnson", age: 22, city: "Chicago" },
    { name: "Emily Davis", age: 28, city: "Houston" },
    { name: "David Martinez", age: 35, city: "Miami" }
];




import './testing.css';
import { useState } from "react";
import axios from "axios"; // Import Axios

const Testing = () => {
    const eventData = [
        { name: "John Doe", age: 25, city: "New York" },
        { name: "Jane Smith", age: 30, city: "Los Angeles" },
        { name: "Mike Johnson", age: 22, city: "Chicago" },
        { name: "Emily Davis", age: 28, city: "Houston" },
        { name: "David Martinez", age: 35, city: "Miami" }
    ];

    return (
        console.log(eventData[0].name)
    );
}
    

export default Testing;
