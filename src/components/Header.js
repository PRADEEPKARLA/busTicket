import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header>
      <h1>Bus Booking App</h1>
      <nav>
        <Link to="/routes">Routes</Link>
        <Link to="/booking-history">Booking History</Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;

 