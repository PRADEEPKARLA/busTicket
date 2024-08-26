import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import './styles.css';

const SeatSelection = () => {
  const { routeId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const token = localStorage.getItem('token');

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    console.log('Attempting to book seats:', selectedSeats);
    console.log('Route ID:', routeId);
    console.log('Token:', token);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        { routeId, seats: selectedSeats },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Booking response:', response.data);
      alert('Booking successful!');
      fetchBookedSeats();
    } catch (error) {
      console.error('Error during booking:', error);
      alert('Booking failed. Please check your token or permissions.');
    }
  };

  const fetchBookedSeats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/routes/${routeId}/bookings`);
      setBookedSeats(response.data);
    } catch (error) {
      console.error('Error fetching booked seats:', error);
    }
  };

  useEffect(() => {
    fetchBookedSeats();
  }, [routeId]);

  return (
    <div className="container">
      <Header />
      <h2>Select Seats</h2>
      <div className="seat-grid">
        {[...Array(40).keys()].map((i) => (
          <button
            key={i}
            className={`seat-button ${bookedSeats.includes(i) ? 'booked' : ''} ${selectedSeats.includes(i) ? 'selected' : ''}`}
            onClick={() => handleSelectSeat(i)}
            disabled={bookedSeats.includes(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button onClick={handleBooking}>Book Selected Seats</button>
    </div>
  );
};

export default SeatSelection;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Header from './Header';

// const SeatSelection = () => {
//   const { routeId } = useParams(); // Capture routeId from the URL
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [bookedSeats, setBookedSeats] = useState([]); // Initialize state for booked seats
//   const token = localStorage.getItem('token');

//   const handleSelectSeat = (seatNumber) => {
//     setSelectedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((s) => s !== seatNumber)
//         : [...prev, seatNumber]
//     );
//   };
 
//   const handleBooking = async () => {
//     console.log('Attempting to book seats:', selectedSeats);
//     console.log('Route ID:', routeId);
//     console.log('Token:', token);
  
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/bookings',
//         { routeId, seats: selectedSeats },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log('Booking response:', response.data);
//       alert('Booking successful!');
//       // Refresh booked seats after successful booking
//       fetchBookedSeats();
//     } catch (error) {
//       console.error('Error during booking:', error);
//       alert('Booking failed. Please check your token or permissions.');
//     }
//   };
  

//   // Fetch booked seats for a route
//   const fetchBookedSeats = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/routes/${routeId}/bookings`);
//       setBookedSeats(response.data);
//     } catch (error) {
//       console.error('Error fetching booked seats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBookedSeats();
//   }, [routeId]);

//   // Example of displaying seat availability
//   return (
//     <div>
//       <Header />
//       <h2>Select Seats</h2>
//       <div className="seat-grid">
//         {[...Array(40).keys()].map((i) => (
//           <button
//             key={i}
//             className={`seat-button ${bookedSeats.includes(i) ? 'booked' : ''} ${selectedSeats.includes(i) ? 'selected' : ''}`}
//             onClick={() => handleSelectSeat(i)}
//             disabled={bookedSeats.includes(i)} // Disable booked seats
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//       <button onClick={handleBooking}>Book Selected Seats</button>
//     </div>
//   );
// };

// export default SeatSelection;




// import React, { useState } from 'react';
// import Header from './Header';

// const SeatSelection = ({ route }) => {
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   const handleSelectSeat = (seatNumber) => {
//     setSelectedSeats((prev) => 
//       prev.includes(seatNumber) 
//         ? prev.filter((s) => s !== seatNumber)
//         : [...prev, seatNumber]
//     );
//   };

//   const handleBooking = () => {
//     // Call the backend API to book selected seats
//     console.log('Selected seats:', selectedSeats);
//   };

//   return (
//     <div>
//         <Header/>
//       <h2>Select Seats</h2>
//       <div className="seat-grid">
//         {[...Array(40).keys()].map((i) => (
//           <button
//             key={i}
//             className={selectedSeats.includes(i) ? 'selected' : ''}
//             onClick={() => handleSelectSeat(i)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//       <button onClick={handleBooking}>Book Selected Seats</button>
//     </div>
//   );
// };

// export default SeatSelection;