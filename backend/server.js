const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt
const multer = require('multer');
const path = require('path');
// Load environment variables from .env file
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clgproject', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware

// Import Models
const User = require('./models/User');
const Admin = require('./models/admin');
const Booking = require('./models/Booking');
const Query = require('./models/Query');


// Middleware to verify if the user is an admin
const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get the token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with JWT_SECRET

    // Check if the user is an admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = decoded; // Save the decoded token data to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ----------------------------------
// User Routes
// ----------------------------------

// Register user
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, username, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Fetch all users (for admin use)
app.get('/api/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password from response for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Fetch all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Retrieve all bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});



  // Configure multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  // File filter to accept only images
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

  const upload = multer({ storage, fileFilter });

  // Create a booking with image upload
  app.post('/api/bookings', upload.single('image'), async (req, res) => {
    const { 
      username, 
      email, 
      pickupLocation, 
      pickupPhone, 
      dropLocation, 
      dropPhone, 
      goodsType, 
      weight, 
      price, 
      paymentMethod // Include paymentMethod
    } = req.body;
  
    try {
      // If a file is uploaded, set the image URL
      const imageUrl = req.file ? `uploads/${req.file.filename}` : null;
  
      // Create a new booking document
      const booking = new Booking({
        username,
        email,
        pickupLocation,
        pickupPhone,
        dropLocation,
        dropPhone,
        goodsType,
        weight,
        price,
        paymentMethod, // Include paymentMethod in the booking document
        image: imageUrl,
      });
  
      // Save the booking to the database
      await booking.save();
  
      // Respond with a success message and the booking data
      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      console.error('Error creating booking:', error.message);
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  });
  
  // show uploads image in the according to booking id 
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Admin Registration Route
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, admin });
  } catch (error) {
    console.error('Error logging in admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});







// Backend route (Express)
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Prevent updates on cancelled bookings
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot update status of a cancelled booking.' });
    }

    // Handle cancellation logic
    if (status === 'Cancelled') {
      const bookingDate = new Date(booking.date);
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - bookingDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      if (differenceInDays > 2) {
        return res.status(400).json({
          message: 'Booking cannot be cancelled after 2 days from confirmation.',
        });
      }
    }

    // Set deliveredDate to current date if status is "Delivered"
    if (status === 'Delivered') {
      booking.deliveredDate = new Date();
    }

    // Update the status
    booking.status = status;

    // Use validateModifiedOnly to validate only modified fields
    const updatedBooking = await booking.save({ validateModifiedOnly: true });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking.' });
  }
});



app.put('/api/bookings/cancel/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Fetch the booking to check the status
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send('Booking not found.');
    }

    // Allow cancellation only if the status is Pending
    if (booking.status !== 'Pending') {
      return res.status(400).send('Booking can only be cancelled when it is Pending.');
    }

    // Update booking status to "Cancelled"
    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).send(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).send('Failed to cancel booking.');
  }
});



// Submit query
app.post('/api/submit-query', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body; // Added phone field
    const newQuery = new Query({ name, email, phone, message }); // Included phone in the model
    await newQuery.save();
    
    res.status(201).json({ success: true, message: 'Query submitted successfully!' });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});
// Fetch all queries for admin
app.get('/api/get-queries', async (req, res) => {
  try {
    const queries = await Query.find(); // Fetch all queries from the database
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ message: 'Failed to fetch queries' });
  }
});


// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
