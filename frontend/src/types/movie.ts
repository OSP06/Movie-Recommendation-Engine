export interface Movie {
  id: number;
  title: string;
  genres: string[];
  description: string;
  imageUrl: string;
  rating: number;
  year: number;
}

export interface UserPreference {
  movieId: number;
  rating: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}