import React, { useState, useEffect } from 'react';
import { MovieCard } from './components/MovieCard';
import { RecommendationEngine } from './utils/recommendationEngine';
import { Movie, UserPreference } from './types/movie';
import { Sparkles, Loader2 } from 'lucide-react';
import { api } from './utils/api';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 'user-1';

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [fetchedMovies, userPrefs] = await Promise.all([
          api.getPopularMovies(),
          api.getUserPreferences(userId)
        ]);
        
        if (!mounted) return;

        setMovies(fetchedMovies);
        setUserPreferences(userPrefs);
        
        let engine = new RecommendationEngine(fetchedMovies);
        for (const pref of userPrefs) {
          engine = engine.addRating(pref.movieId, pref.rating);
        }
        
        setRecommendations(Array.from(engine.getRecommendations()));
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleRate = async (movieId: number, rating: number) => {
    try {
      await api.savePreference(userId, movieId, rating);
      
      const userPrefs = await api.getUserPreferences(userId);
      setUserPreferences(userPrefs);
      
      let engine = new RecommendationEngine(movies);
      for (const pref of userPrefs) {
        engine = engine.addRating(pref.movieId, pref.rating);
      }
      
      setRecommendations(Array.from(engine.getRecommendations()));
    } catch (error) {
      console.error('Failed to save rating:', error);
      setError('Failed to save rating. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-blue-500" />
            Movie Recommendations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rate movies you've watched and get personalized recommendations based on your preferences.
          </p>
        </header>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRate={(rating) => handleRate(movie.id, rating)}
                userRating={userPreferences.find(p => p.movieId === movie.id)?.rating}
              />
            ))}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRate={(rating) => handleRate(movie.id, rating)}
                  userRating={userPreferences.find(p => p.movieId === movie.id)?.rating}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;