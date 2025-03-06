from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import re
from datetime import datetime

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# TMDB API configuration
TMDB_API_KEY = 'f32e0e1f35c56c66120030171523bd73'
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# API Key for frontend authentication (Option 2)
API_KEY = '163fdf56793f85b10f9745fc2fe5423c'

# Create a decorator function for API key validation
def require_api_key(f):
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            # Extract token from "Bearer {token}"
            match = re.match(r'^Bearer\s+(.*)$', auth_header)
            if match and match.group(1) == API_KEY:
                return f(*args, **kwargs)
        return jsonify({'error': 'Unauthorized'}), 403
    decorated_function.__name__ = f.__name__
    return decorated_function

# Database Models
class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    rating = db.Column(db.Float)
    year = db.Column(db.Integer)
    genres = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

def fetch_and_store_movies():
    # Fetch movies from TMDB
    movies_response = requests.get(f'{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}')
    genres_response = requests.get(f'{TMDB_BASE_URL}/genre/movie/list?api_key={TMDB_API_KEY}')
    
    if movies_response.status_code == 200 and genres_response.status_code == 200:
        movies_data = movies_response.json()['results']
        genres_data = {genre['id']: genre['name'] for genre in genres_response.json()['genres']}
        
        # Clear existing movies
        Movie.query.delete()
        
        # Store new movies
        for movie_data in movies_data:
            movie_genres = [genres_data[genre_id] for genre_id in movie_data['genre_ids']]
            
            movie = Movie(
                id=movie_data['id'],
                title=movie_data['title'],
                description=movie_data['overview'],
                image_url=f"https://image.tmdb.org/t/p/w500{movie_data['poster_path']}",
                rating=float(movie_data['vote_average']),
                year=datetime.strptime(movie_data['release_date'], '%Y-%m-%d').year,
                genres=','.join(movie_genres)
            )
            db.session.add(movie)
        
        db.session.commit()
        return True
    return False

@app.route('/api/movies', methods=['GET'])
@require_api_key
def get_movies():
    movies = Movie.query.all()
    if not movies:
        if not fetch_and_store_movies():
            return jsonify({'error': 'Failed to fetch movies'}), 500
        movies = Movie.query.all()
    
    movies_list = [{
        'id': movie.id,
        'title': movie.title,
        'description': movie.description,
        'imageUrl': movie.image_url,
        'rating': float(movie.rating),
        'year': int(movie.year),
        'genres': movie.genres.split(',') if movie.genres else []
    } for movie in movies]
    
    return jsonify(movies_list)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/preferences', methods=['POST'])
@require_api_key
def add_preference():
    data = request.json
    user_id = data.get('userId')
    movie_id = data.get('movieId')
    rating = data.get('rating')
    
    if not all([user_id, movie_id, rating]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    preference = UserPreference.query.filter_by(
        user_id=user_id,
        movie_id=movie_id
    ).first()
    
    if preference:
        preference.rating = rating
    else:
        preference = UserPreference(
            user_id=user_id,
            movie_id=movie_id,
            rating=rating
        )
        db.session.add(preference)
    
    db.session.commit()
    return jsonify({'message': 'Preference saved successfully'})

@app.route('/api/preferences/<user_id>', methods=['GET'])
@require_api_key
def get_preferences(user_id):
    preferences = UserPreference.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'movieId': pref.movie_id,
        'rating': pref.rating
    } for pref in preferences])

if __name__ == '__main__':
    app.run(port=5000, debug=True)