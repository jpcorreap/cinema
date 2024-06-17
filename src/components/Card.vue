<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg m-4 cursor-pointer" @click="goToCart">
        <div class="flex justify-center items-center h-64 bg-transparent">
            <img class="h-full object-cover" :src="movie.poster" alt="Movie Poster" />
        </div>
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2 text-center">{{ movie.title }} ({{ movie.year }})</div>
        </div>
    </div>
</template>

<script>
import Movie from '@/models/Movie';

export default {
    props: {
        movie: {
            type: Movie,
            required: true
        }
    },
    methods: {
        goToCart() {
            this.$router.push({ name: 'CartView', params: { movieId: this.movie.id } });
        }
    }
}
</script>