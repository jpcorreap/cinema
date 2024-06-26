<template>
  <div class="container mx-auto p-4">
    <div v-if="selectedMovie" class="grid grid-cols-1 lg:grid-cols-[1fr_4fr] gap-10">

      <div>
        <img :src="selectedMovie.poster" alt="Movie Poster" class="w-64 h-96 object-cover" />
        <h2 class="text-2xl">{{ selectedMovie.title }} ({{ selectedMovie.year }})</h2>
        <p> ({{ selectedMovie.title }})</p>
        <p>{{ selectedMovie.plot }}</p>
      </div>

        <div class="mt-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl mb-4">Seat selection</h3>
              <SeatSelection :selectedSeats="selectedSeats" @update:selectedSeats="updateSelectedSeats" />
            </div>

            <div>
              <h3 class="text-xl mb-4">Taken seats by function hour</h3>
              <DataViz />
            </div>
          </div>

          <h3 class="text-xl mb-2">Client Information</h3>
          <form @submit.prevent="generateReceipt" class="space-y-4">
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                v-model="clientName"
                class="mt-1 block text-black w-full border-gray-600 rounded-md shadow-sm h-12 px-4"
                required
              />
              <h3 class="text-xl mt-4">Selected seats:</h3>
              <p>{{ selectedSeats.length ? selectedSeats.join(' ') : "N/A" }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                v-model="clientEmail"
                class="mt-1 block text-black w-full border-gray-300 rounded-md shadow-sm h-12 px-4"
                required
              />
              <h3 class="text-xl">Final amount to pay:</h3>
              <p>{{ formattedPrice }}</p>
            </div>
          </div>

          
          <button
            type="submit"
            class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            :disabled="!formIsValid"
          >
            Get invoice
          </button>
          
        </form>

      </div>

    </div>
    <div v-else>
      <p>No movie selected.</p>
    </div>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';
import Movie from '@/models/Movie';
import SeatSelection from '../components/SeatSelection.vue';
import DataViz from '../components/DataViz.vue';
import { formatCurrencyToColombianPeso, formatDate } from '@/utils/format';

const SEAT_COST = 15000;

export default {
  props: ['movieId'],
  components: {
    SeatSelection,
    DataViz
  },
  data() {
    return {
      selectedMovie: null,
      selectedSeats: [],
      clientName: '',
      clientEmail: ''
    };
  },
  created() {
    this.fetchDetail(this.$route.params.movieId);
  },
  computed: {
    formattedPrice() {
      return formatCurrencyToColombianPeso(this.selectedSeats.length * SEAT_COST);
    },
    formIsValid() {
      return this.clientName && this.clientEmail && this.selectedSeats.length > 0;
    }
  },
  methods: {
    async fetchDetail(movieId) {
      try {
        const response = await fetch(`https://www.omdbapi.com?apikey=bf8f4e8e&i=${movieId}`);
        const movieDetail = await response.json();

        this.selectedMovie = new Movie({
          id: movieDetail.imdbID,
          title: movieDetail.Title,
          year: movieDetail.Year,
          plot: movieDetail.Plot,
          actors: movieDetail.Actors,
          genre: movieDetail.Genre,
          writer: movieDetail.Writer,
          released: movieDetail.Released,
          // Default poster value
          poster: movieDetail.Poster == "N/A" ? undefined : movieDetail.Poster
        });
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    updateSelectedSeats(seats) {
      this.selectedSeats = seats;
    },
    // I consider this receipt logic to be implemented in a different helper file, not here, but I'm not sure
    // how does it should work within Vue JS
    generateReceipt() {
      const currentDate = new Date();
      const movieDate = new Date();
      movieDate.setHours(currentDate.getHours() + 12);

      // Generate the document
      const doc = new jsPDF();
      // Add the required text
      doc.text(`Receipt of ${formatDate(currentDate)}`, 10, 10);
      doc.text(`Client Name: ${this.clientName}`, 10, 20);
      doc.text(`Client Email: ${this.clientEmail}`, 10, 30);
      doc.text(`Movie Title: ${this.selectedMovie.title ?? "N/A"}`, 10, 40);
      doc.text(`Movie Date: ${formatDate(movieDate)}`, 10, 50);
      doc.text(`Number of Seats: ${this.selectedSeats.length}`, 10, 60);
      doc.text(`Seats: ${this.selectedSeats.join(' ')}`, 10, 70);
      doc.text(`Amount: ${formatCurrencyToColombianPeso(this.selectedSeats.length * 15000)} COP.`, 10, 80);
      doc.save('receipt.pdf');
    }
  }
}
</script>
