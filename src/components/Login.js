import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Login successful');
        window.location.href = '/routes'; // Redirect to routes page after login
      } else {
        alert('Login failed. No token received.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <Header />
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;



// import React, { useState } from 'react';
// import axios from 'axios';
// import Header from './Header';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//       });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         alert('Login successful');
//         // Redirect to user dashboard or home page
//       } else {
//         alert('Login failed. No token received.');
//       }
//     } catch (error) {
//       // Log detailed error information
//       console.error('Login error:', error.response ? error.response.data : error.message);
//       alert('Login failed. Please check your credentials.');
//     }
//   };
  

//   return (
//     <div>
//         <Header/>
//       <h2>Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;