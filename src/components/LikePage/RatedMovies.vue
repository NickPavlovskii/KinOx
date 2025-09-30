<template>
  <section>
    <div v-if="isLoading" class="loader">
      <Kinox-loader />
    </div>

    <div v-else-if="ratedMovies.length > 0" class="like saved-movies__section saved-movies__section--rated">
      <div class="saved-movies__title-wrapper">
        <h2 class="saved-movies__title">
          <font-awesome-icon icon="fa-solid fa-star" />
          Оцененные фильмы
        </h2>
      </div>

      <table class="table" style="margin: auto">
        <tbody>
          <tr v-for="item in paginatedRatedMovies" :key="item.movie.id" class="saved-movies__row">
            <td>
              <kinox-movie-card :movie="item.movie" style="width: 250px" />
            </td>
            <td class="Rating saved-movies__cell saved-movies__cell--rating">
              <div class="saved-movies__rating-block">
                <Rating v-model="item.rating" class="saved-movies__rating custom-rating" :stars="10" :cancel="false" :readonly="true" />
                <img
                  class="saved-movies__rating-cancel"
                  src="https://primefaces.org/cdn/primevue/images/rating/cancel.png"
                  height="24"
                  width="24"
                  @click="removeRating(item.movie.id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="saved-movies__pagination pagination">
        <Paginator v-model:first="currentPage" :rows="moviesPerPage" :totalRecords="ratedMovies.length" />
      </div>
    </div>

    <div v-else>
      <p>Нет оцененных фильмов.</p>
    </div>
  </section>
</template>

<script>
import Paginator from 'primevue/paginator'
import Rating from 'primevue/rating'
import { mapActions, mapGetters } from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'RatedMovies',
  components: { Paginator, Rating, FontAwesomeIcon },
  props: { moviesPerPage: { type: Number, default: 6 } },
  data() {
    return { currentPage: 0, isLoading: true }
  },
  computed: {
    ...mapGetters('ratings', ['ratedMovies']),
    paginatedRatedMovies() {
      const start = this.currentPage * this.moviesPerPage
      return this.ratedMovies.slice(start, start + this.moviesPerPage)
    }
  },
  methods: {
    ...mapActions('ratings', ['loadRatings', 'saveRating', 'deleteRating']),
    ...mapActions('movie', ['fetchMovieById']),

    async fetchRatings() {
      this.isLoading = true
      try {
        await this.loadRatings()
        this.ratedMovies.forEach(r => {
          if (r.userRatingReactive === undefined) r.userRatingReactive = r.rating
        })
        const moviesWithDetails = await Promise.all(
          this.ratedMovies.map(async r => {
            const movie = await this.$store.dispatch('movie/fetchMovieById', r.movie.id)
            return { ...r, movie }
          })
        )
        this.ratedMovies.splice(0, this.ratedMovies.length, ...moviesWithDetails)
      } catch (err) {
        console.error('Ошибка загрузки рейтингов:', err)
      } finally {
        this.isLoading = false
      }
    },

    updateRating(movieId, value) {
      this.saveRating({ movieId, rating: value })
      const item = this.ratedMovies.find(m => m.movie.id === movieId)
      if (item) item.userRatingReactive = value
    },

    removeRating(movieId) {
      this.deleteRating(movieId)
      const index = this.ratedMovies.findIndex(m => m.movie.id === movieId)
      if (index !== -1) this.ratedMovies.splice(index, 1)
    }
  },

  async created() {
    await this.fetchRatings()
  }
}
</script>


<style scoped>
  .saved-movies__card-item {
    width: 200px; /* defines width */
    box-sizing: border-box;
    padding: 10px;
  }

  .saved-movies__rating-block {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: -30px;
  }

  .saved-movies__rating-cancel {
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    margin-top: 8px;
    margin-left: 10px;
  }

  .saved-movies__rating-cancel:hover {
    transform: scale(1.2);
  }
</style>
