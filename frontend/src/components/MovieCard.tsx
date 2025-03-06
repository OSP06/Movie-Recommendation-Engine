import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onRate?: (rating: number) => void;
  userRating?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onRate, userRating }) => {
  const stars = [1, 2, 3, 4, 5];

  // Ensure rating is a valid number before calling .toFixed(1)
  const formattedRating = typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {movie.imageUrl ? (
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="w-full h-96 object-cover"
        />
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">No Image Available</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{movie.title || 'Unknown Title'}</h3>
          <span className="text-sm text-gray-600">{movie.year || 'N/A'}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{movie.description || 'No description available.'}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(movie.genres && movie.genres.length > 0) ? (
            movie.genres.map((genre) => (
              <span 
                key={genre} 
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No genres available</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="fill-yellow-400 text-yellow-400" size={20} />
            <span className="text-sm font-semibold">{formattedRating}</span>
          </div>
          {onRate && (
            <div className="flex items-center gap-1">
              {stars.map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(star)}
                  className={`text-2xl ${
                    (userRating ?? 0) >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
