import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import './styles.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <Header />
      <h2>Booking History for All Buses</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <p>Route: {booking.route.start} to {booking.route.end}</p>
            <p>Seats: {booking.seats.join(', ')}</p>
            <p>User ID: {booking.user}</p>
            <p>Date: {new Date(booking.bookingDate).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingHistory;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Header from './Header';

// const BookingHistory = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await axios.get('http://localhost:5000/api/bookings/history', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(response.data);
//       } catch (error) {
//         console.error('Error fetching booking history:', error);
//       }
//     };
//     fetchBookings();
//   }, []);

//   return (
//     <div>
//       <Header />
//       <h2>Booking History for All Buses</h2>
//       {bookings.length > 0 ? (
//         bookings.map((booking) => (
//           <div key={booking._id}>
//             <p>Route: {booking.route.start} to {booking.route.end}</p>
//             <p>Seats: {booking.seats.join(', ')}</p>
//             <p>User ID: {booking.user}</p>
//             <p>Date: {new Date(booking.bookingDate).toLocaleString()}</p>
//           </div>
//         ))
//       ) : (
//         <p>No bookings found.</p>
//       )}
//     </div>
//   );
// };

// export default BookingHistory;
 