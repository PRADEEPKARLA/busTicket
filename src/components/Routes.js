import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './styles.css';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for managing search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/routes');
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutes();
  }, []);

  const handleBookNow = (routeId) => {
    navigate(`/seat-selection/${routeId}`);
  };

  // Function to handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter routes based on search term
  const filteredRoutes = routes.filter((route) =>
    route.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.end.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(route.date).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="container">
      <Header />
      <h2>Available Routes</h2>
      <input
        type="text"
        placeholder="Search by start location, end location, or date"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />
      {filteredRoutes.length > 0 ? (
        filteredRoutes.map((route) => (
          <div key={route._id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <p>{route.start} to {route.end}</p>
            <p>Date: {new Date(route.date).toLocaleString()}</p>
            <p>Time: {route.time}</p>
            <p>Bus Number: {route.busNumber}</p>
            <p>Price: {route.price}</p>
            <button onClick={() => handleBookNow(route._id)}>Book Now</button>
          </div>
        ))
      ) : (
        <p>No routes found matching your search criteria.</p>
      )}
    </div>
  );
};

export default Routes;

 

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';

// const Routes = () => {
//   const [routes, setRoutes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/routes');
//         setRoutes(response.data);
//       } catch (error) {
//         console.error('Error fetching routes:', error);
//       }
//     };
//     fetchRoutes();
//   }, []);

//   const handleBookNow = (routeId) => {
//     // Ensure routeId is valid and being passed correctly
//     navigate(`/seat-selection/${routeId}`);
//   };

//   return (
//     <div>
//       <Header />
//       <h2>Available Routes</h2>
//       {routes.map((route) => (
//         <div key={route._id}>
//           <p>{route.start} to {route.end}</p>
//           <p>Date: {new Date(route.date).toLocaleString()}</p>
//           <p>Time: {route.time}</p>
//           <p>Bus Number: {route.busNumber}</p>
//           <p>Price: {route.price}</p>
//           <button onClick={() => handleBookNow(route._id)}>Book Now</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Routes;

 