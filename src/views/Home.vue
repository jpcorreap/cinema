<template>
  <main>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <Card v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </main>
</template>

<script>
import Movie from '@/models/Movie';
import Card from '../components/Card.vue';


export default {
  name: 'App',
  components: {
    Card
  },
  data() {
    return {
      movies: []
    };
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch('http://www.omdbapi.com?apikey=bf8f4e8e&s=colombia&type=movie&plot=short&page=1');
        const moviesResponse = await response.json();

        this.movies = moviesResponse["Search"].map(movieData => new Movie({
          id: movieData.imdbID,
          title: movieData.Title,
          year: movieData.Year,
          poster: movieData.Poster == "N/A" ? undefined : movieData.Poster
        }));

      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }
  }
}
</script>

<style>
@import 'tailwindcss/tailwind.css';
</style>
