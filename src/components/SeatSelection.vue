<template>
    <div class="grid grid-cols-8 gap-2">
        <div v-for="seat in seats" :key="seat.id" :class="seatClass(seat)" @click="toggleSeat(seat)"
            class="prevent-select text-black cursor-pointer w-10 h-10 flex items-center justify-center">
            {{ seat.id }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedSeats: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            seats: Array.from({ length: 40 }, (_, index) => ({
                id: index + 1,
                selected: false
            }))
        };
    },
    methods: {
        toggleSeat(seat) {
            seat.selected = !seat.selected;
            if (seat.selected) {
                this.$emit('update:selectedSeats', [...this.selectedSeats, seat.id]);
            } else {
                this.$emit('update:selectedSeats', this.selectedSeats.filter(id => id !== seat.id));
            }
        },
        seatClass(seat) {
            return seat.selected ? 'bg-green-500' : 'bg-gray-300';
        }
    },
    watch: {
        selectedSeats(newSeats) {
            this.seats.forEach(seat => {
                seat.selected = newSeats.includes(seat.id);
            });
        }
    }
}
</script>

<style scoped>
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>