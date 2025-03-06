# Movie-Recommendation-Engine
A web application for discovering movies and getting personalized recommendations based on your preferences.
Overview
This project is a full-stack movie recommendation system consisting of:

Flask Backend: API service that provides movie data and handles user preferences
React Frontend: User interface for browsing movies and rating them
Recommendation Engine: Algorithm that suggests movies based on user ratings and genre preferences

Features

Browse popular movies from TMDB (The Movie Database)
Rate movies to track your preferences
Get personalized movie recommendations based on your ratings
View movie details including description, genres, and ratings

Tech Stack
Backend

Flask: Web framework for Python
SQLAlchemy: ORM for database operations
SQLite: Lightweight database for storing movie and user data
TMDB API: External source for movie data

Frontend

React: UI library for building the user interface
TypeScript: Type-safe JavaScript for better development experience
Tailwind CSS: Utility-first CSS framework for styling
Axios: HTTP client for API requests

Setup Instructions
Prerequisites

Node.js (v14+)
Python (v3.7+)
pip (Python package manager)

Backend Setup

Clone the repository
Set up a Python virtual environment (recommended)
bashCopypython -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

Install backend dependencies
bashCopypip install flask flask-cors flask-sqlalchemy requests

Run the Flask server
bashCopypython app.py
The server will run on http://localhost:5000

Frontend Setup

Navigate to the frontend directory
bashCopycd frontend

Install dependencies
bashCopynpm install

Start the development server
bashCopynpm run dev
The application will be available at http://localhost:5173

API Endpoints

GET /api/health: Health check endpoint
GET /api/movies: Get all popular movies
POST /api/preferences: Save user movie rating
GET /api/preferences/:userId: Get all ratings for a specific user

Project Structure
Copy/
├── app.py                  # Flask backend
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MovieCard.tsx    # Movie card component
│   │   ├── types/
│   │   │   └── movie.ts         # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── api.ts           # API service
│   │   │   ├── data.ts          # Sample data
│   │   │   └── recommendEngine.ts  # Recommendation algorithm

How the Recommendation Engine Works
The recommendation engine uses content-based filtering with genre similarity as the primary feature:

When a user rates movies, their preferences are stored
The engine calculates genre similarity between rated and unrated movies
Recommendations are weighted based on:

How similar a movie's genres are to highly-rated movies
The user's rating strength (higher ratings have more influence)


If no ratings exist, it falls back to showing the highest-rated movies

Future Improvements

Add user authentication
Expand recommendation algorithm to include more features (actors, directors, release year)
Implement collaborative filtering to include recommendations based on similar users
Add movie search functionality
Enhance UI with movie trailers and more detailed information
