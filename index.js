require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());
  
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// Database configurations
const dbName = 'busTicketBooking';
const usersCollection = 'users';
const routesCollection = 'routes';
const bookingsCollection = 'bookings';
// let MONGODB_URI = 'mongodb://localhost:27017';
let db;

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware to verify JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword, isAdmin:false };

    const result = await db.collection(usersCollection).insertOne(user);
    if (result.insertedId) {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(400).json({ message: 'Failed to register user' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await db.collection(usersCollection).findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });
  
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT Secret is not defined' });
      }
  
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
console.log('JWT Secret:', process.env.JWT_SECRET);

// Get All Routes
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await db.collection(routesCollection).find().toArray();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book Seats

// Book Seats
// Book Seats
app.post('/api/bookings', authenticateJWT, async (req, res) => {
  try {
    const { routeId, seats } = req.body;

    if (!routeId || !Array.isArray(seats)) {
      return res.status(400).json({ message: 'Invalid request format' });
    }

    const route = await db.collection(routesCollection).findOne({ _id: new ObjectId(routeId) });
    if (!route) return res.status(404).json({ message: 'Route not found' });

    const existingBookings = await db.collection(bookingsCollection).find({ route: new ObjectId(routeId) }).toArray();
    const bookedSeats = existingBookings.flatMap((booking) => booking.seats);

    // Check if the requested seats are available
    const unavailableSeats = seats.filter((seat) => bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: `Seats ${unavailableSeats.join(', ')} are already booked` });
    }

    const booking = {
      user: new ObjectId(req.user.id),
      route: new ObjectId(routeId),
      seats,
      bookingDate: new Date(),
    };

    const result = await db.collection(bookingsCollection).insertOne(booking);
    if (result.insertedId) {
      res.status(201).json({ message: 'Booking successful' });
    } else {
      res.status(400).json({ message: 'Booking failed' });
    }
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).json({ error: error.message });
  }
});

 
// Get Booking History for User
// app.get('/api/bookings/history', authenticateJWT, async (req, res) => {
//   try {
//     const bookings = await db.collection(bookingsCollection)
//       .find({ user: ObjectId(req.user.id) })
//       .toArray();

//     const populatedBookings = await Promise.all(
//       bookings.map(async (booking) => {
//         const route = await db.collection(routesCollection).findOne({ _id: booking.route });
//         return { ...booking, route };
//       })
//     );

//     res.json(populatedBookings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get Booking History for All Buses
app.get('/api/bookings/history', authenticateJWT, async (req, res) => {
  try {
    const bookings = await db.collection(bookingsCollection).find().toArray();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const route = await db.collection(routesCollection).findOne({ _id: booking.route });
        return { ...booking, route };
      })
    );

    res.json(populatedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Endpoint to get bookings for a specific route
app.get('/api/routes/:routeId/bookings', async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const bookings = await db.collection(bookingsCollection)
      .find({ route: new ObjectId(routeId) })
      .toArray();

    // Extract all booked seats for the route
    const bookedSeats = bookings.flatMap((booking) => booking.seats);

    res.json(bookedSeats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Admin: Create a Route
app.post('/api/admin/routes', authenticateJWT, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

    const { start, end, date, time, busNumber, price, seats } = req.body;
    const route = { "start":start, "end":end, "date":new Date(date), "time":time, "busNumber":busNumber, "price":price, "seats":seats || 40 };

    const result = await db.collection(routesCollection).insertOne(route);
    if (result.insertedId) {
      res.status(201).json({ message: 'Route created successfully' });
    } else {
      res.status(400).json({ message: 'Failed to create route' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Get All Bookings
app.get('/api/admin/bookings', authenticateJWT, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

    const bookings = await db.collection(bookingsCollection).find().toArray();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const user = await db.collection(usersCollection).findOne({ _id: booking.user });
        const route = await db.collection(routesCollection).findOne({ _id: booking.route });
        return { ...booking, user, route };
      })
    );

    res.json(populatedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
