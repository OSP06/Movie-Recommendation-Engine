import { Movie } from '../types/movie';

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    genres: ["Sci-Fi", "Action", "Thriller"],
    description: "A thief who enters the dreams of others to steal secrets from their subconscious.",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    rating: 8.8,
    year: 2010
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    genres: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    rating: 9.3,
    year: 1994
  },
  {
    id: 3,
    title: "Interstellar",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800",
    rating: 8.6,
    year: 2014
  },
  {
    id: 4,
    title: "The Dark Knight",
    genres: ["Action", "Crime", "Drama"],
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
    rating: 9.0,
    year: 2008
  },
  {
    id: 5,
    title: "Pulp Fiction",
    genres: ["Crime", "Drama"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    rating: 8.9,
    year: 1994
  }
];