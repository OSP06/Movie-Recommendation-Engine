import { Movie } from '../types/movie';

interface MovieScore {
  readonly movie: Movie;
  readonly score: number;
}

export class RecommendationEngine {
  private readonly movies: ReadonlyArray<Movie>;
  private readonly ratings: Readonly<Record<number, number>>;
  private readonly movieMap: Readonly<Record<number, Movie>>;

  constructor(movies: Movie[] = [], ratings: Record<number, number> = {}) {
    // Ensure movies is always an array
    if (!Array.isArray(movies)) {
      throw new Error('Invalid movies array passed to RecommendationEngine');
    }

    this.movies = Object.freeze([...movies]);
    this.ratings = Object.freeze({ ...ratings });

    // Store movies in a map for quick lookup
    this.movieMap = Object.freeze(
      Object.fromEntries(this.movies.map((movie) => [movie.id, movie]))
    );
  }

  public addRating(movieId: number, rating: number): RecommendationEngine {
    const newRatings = { ...this.ratings, [movieId]: rating };
    return new RecommendationEngine([...this.movies], newRatings);
  }

  private calculateGenreSimilarity(genres1: ReadonlyArray<string>, genres2: ReadonlyArray<string>): number {
    const set1 = new Set(genres1);
    const set2 = new Set(genres2);
    const intersection = genres1.filter((x) => set2.has(x)).length;
    const union = set1.size + set2.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  public getRecommendations(): ReadonlyArray<Movie> {
    const ratedIds = new Set(Object.keys(this.ratings).map(Number));

    if (ratedIds.size === 0) {
      return [...this.movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }

    const scores: MovieScore[] = this.movies
      .filter((movie) => !ratedIds.has(movie.id))
      .map((movie) => {
        let totalScore = 0;
        let totalWeight = 0;

        for (const ratedId of ratedIds) {
          const ratedMovie = this.movieMap[ratedId];
          if (ratedMovie) {
            const rating = this.ratings[ratedId];
            const weight = rating / 5;
            const similarity = this.calculateGenreSimilarity(movie.genres, ratedMovie.genres);
            totalScore += similarity * weight;
            totalWeight += weight;
          }
        }

        return {
          movie,
          score: totalWeight > 0 ? totalScore / totalWeight : 0,
        };
      });

    return Object.freeze(
      scores
        .sort((a, b) => b.score - a.score)
        .map((item) => item.movie)
    );
  }
}
