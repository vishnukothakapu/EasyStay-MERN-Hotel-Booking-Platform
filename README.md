# EasyStay - Rental Booking Platform

## File Structure
```
project-root/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Place.js
│   │   └── Booking.js
│   ├── uploads/
│   │   ├── profile_pics/
│   │   └── hotel photos
│   ├── .env
│   ├── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
├── README.md
└── package.json
```

---

## Setup Instructions


### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and configure the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:3030`.

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory and configure the following variable:
   ```env
   VITE_API_URL=http://localhost:3030
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## API Endpoints

### Authentication
- **POST** `/register` - Register a new user.
- **POST** `/login` - Log in a user.
- **GET** `/profile` - Get the logged-in user's profile.
- **PUT** `/profile` - Update the logged-in user's profile.
- **POST** `/logout` - Log out the current user.

### Hotel Management
- **POST** `/places` - Add a new hotel listing.
- **GET** `/places` - Retrieve all hotel listings.
- **GET** `/places/:id` - Retrieve details of a specific hotel.
- **PUT** `/places/:id` - Update hotel details.

### Bookings
- **POST** `/bookings` - Create a new booking.
- **GET** `/bookings` - Retrieve all bookings for the logged-in user.

---
