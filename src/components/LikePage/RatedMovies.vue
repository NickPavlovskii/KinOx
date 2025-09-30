<template>
  <section
    v-if="ratedMovies.length > 0"
    class="like saved-movies__section saved-movies__section--rated"
  >
    <div class="saved-movies__title-wrapper">
      <h2 class="saved-movies__title">
        <font-awesome-icon icon="fa-solid fa-star" />
        Оцененные фильмы
      </h2>
    </div>
    <table
      class="table"
      style="margin: auto"
    >
      <tbody>
        <tr
          v-for="movie in paginatedRatedMovies"
          :key="movie.id"
          class="saved-movies__row"
        >
          <td>
            {{ console.log(movie) }}
            <kinox-movie-card
              :movie="movie"
              style="width: 250px"
            />
          </td>
          <td class="Rating saved-movies__cell saved-movies__cell--rating">
            <div class="saved-movies__rating-block">
              <Rating
                v-model="movie.ratings"
                class="saved-movies__rating custom-rating"
                :stars="10"
                :cancel="false"
                :readonly="true"
              />
              <img
                class="saved-movies__rating-cancel"
                src="https://primefaces.org/cdn/primevue/images/rating/cancel.png"
                height="24"
                width="24"
                @click="removeRating(movie.id)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="saved-movies__pagination pagination">
      <Paginator
        v-model:first="currentPage"
        :rows="moviesPerPage"
        :totalRecords="ratedMovies.length"
      />
    </div>
  </section>
</template>

<script>
  import Paginator from 'primevue/paginator'
  import Rating from 'primevue/rating'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { supabase } from '@/supabase'
  import { mapActions } from 'vuex'

  export default {
    name: 'RatedMovies',
    components: {
      Paginator,
      Rating,
      FontAwesomeIcon,
    },
    props: {
      moviesPerPage: {
        type: Number,
        default: 6,
      },
    },
    data() {
      return {
        currentPage: 0,
        ratedMovies: [], // список фильмов с оценками
        isLoading: true,
      }
    },
    computed: {
      paginatedRatedMovies() {
        const start = this.currentPage * this.moviesPerPage
        return this.ratedMovies.slice(start, start + this.moviesPerPage)
      },
    },
    methods: {
      ...mapActions('movie', ['fetchMovieById', 'deleteRating']),

      async loadRatedMovies() {
        try {
          // 1. Получаем ID фильмов с оценками
          const { data: ratings, error } = await supabase
            .from('ratings')
            .select('movie_id, rating')

          if (error) throw error

          if (!ratings?.length) {
            this.ratedMovies = []
            return
          }

          const movieIds = ratings.map((r) => r.movie_id)

          // 2. Параллельная загрузка фильмов
          const movies = await Promise.all(
            movieIds.map((id) => this.fetchMovieById(id))
          )

          // 3. Объединяем с оценками
          this.ratedMovies = movies
            .map((movie) => {
              const found = ratings.find((r) => r.movie_id === movie.id)
              return found
                ? { ...movie, ratings: Number(found.rating) || 0 }
                : null
            })
            .filter(Boolean)

          console.log('ratedMovies:', this.ratedMovies)
        } catch (err) {
          console.error('Ошибка при загрузке оценённых фильмов:', err.message)
        } finally {
          this.isLoading = false
        }
      },

      async removeRating(movieId) {
        try {
          // Вызов экшена с namespace
          await this.$store.dispatch('ratings/deleteRating', movieId)
          // Обновляем локальный массив
          this.ratedMovies = this.ratedMovies.filter((m) => m.id !== movieId)
        } catch (err) {
          console.error('Ошибка при удалении рейтинга:', err.message)
        }
      },
    },
    created() {
      this.loadRatedMovies()
    },
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
