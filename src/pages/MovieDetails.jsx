import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}`,
          API_OPTIONS,
        );

        const data = await response.json();

        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <main className="movie-details">
      <div className="movie-details-container">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-movie-.png"
          }
          alt={movie.title}
        />

        <div>
          <h1>{movie.title}</h1>

          <p className="rating"> ⭐{movie.vote_average?.toFixed(1) || "N/A"}</p>

          <p className="overview">{movie.overview}</p>

          <div className="movie-info">
            <span>Release: {movie.release_date || "N/A"}</span>

            <span>Runtime: {movie.runtime || "N/A"} minutes</span>

            <span>
              Language: {movie.original_language?.toUpperCase() || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
