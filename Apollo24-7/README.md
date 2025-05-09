Apollo247 Clone

A clone of Apollo247's doctor listing page with filtering capabilities and a REST API backend.

## Project Structure

```
healthvista/
├── frontend/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components
│       └── App.tsx          # Main app component
│
└── backend/                # Node.js + Express backend
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    └── server.js           # Server entry point
```

## Features

- Responsive doctor listing page
- Filtering by experience, gender, availability, and fee
- Sorting options
- Pagination
- REST API with MongoDB database
- Mobile-friendly design

## Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```
   npm start
   ```

## Backend Setup

1. Install MongoDB if you don't have it already:
   [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/healthvista
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Add Doctor
`POST /api/doctors`

Example request body:
```json
{
  "name": "Dr. Rajesh Kumar",
  "specialty": "General Physician",
  "experience": "15+ years",
  "experienceYears": 15,
  "education": "MBBS, MD (Internal Medicine)",
  "languages": ["English", "Hindi"],
  "gender": "male",
  "consultationFee": "₹500",
  "feeAmount": 500,
  "availability": "Today",
  "rating": 4.8,
  "reviews": 120,
  "image": "https://example.com/doctor-image.jpg"
}
```

### List Doctors with Filters
`GET /api/doctors`

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `specialty`: Doctor specialty (e.g., "general-physician")
- `experience`: Experience ranges (e.g., "0-5,5-10")
- `gender`: Doctor gender (e.g., "male,female")
- `availability`: Availability options (e.g., "today,tomorrow")
- `consultationFee`: Fee ranges (e.g., "0-300,301-500")
- `sortBy`: Sorting option (e.g., "experience_high_to_low", "fee_low_to_high")

## Implementation Notes

1. The frontend uses mock data initially but can be connected to the backend API.
2. To connect to the real API, uncomment the fetch call in the Index.tsx file.
3. The filter sidebar is responsive and collapses on mobile devices.
4. This project is for educational purposes only.

## Next Steps for Enhancement

1. Add authentication system
2. Implement doctor appointment booking
3. Add doctor profile pages
4. Implement user reviews and ratings
5. Add more search options and filters

## License

This project is for educational purposes only.
