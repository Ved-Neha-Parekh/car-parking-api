# Car Parking API 🚗

A simple Node.js and Express API to manage a parking lot. It allows you to park cars, view parked cars, and un-park them with automated fee calculation based on parking duration.

## Features
- **Park a car**: Assigns a parking slot if space is available (Maximum 10 slots). Prevents duplicate parking.
- **View parked cars**: Lists all currently parked cars along with their slot numbers and entry times.
- **Un-park a car**: Removes a car from the parking lot and automatically calculates the total parking fee (₹10 per minute).

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check / Server status. |
| `POST` | `/park` | Parks a car. Requires JSON body: `{"carNum": "MH-12-XX-1234"}` |
| `GET` | `/cars` | Lists all currently parked cars. |
| `DELETE` | `/unPark` | Un-parks a car and returns the total fare. Requires JSON body: `{"carNum": "MH-12-XX-1234"}` |

## How to Run Locally

1. Open your terminal in the project directory.
2. Install dependencies (if not already installed):
   ```bash
   npm install express
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *(Or run `npm run dev` if you have nodemon setup)*
4. The server will be accessible at: `http://localhost:3000`
