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
          <td class="saved-movies__cell">
            <Kinox-movie-card
              :movie="movie"
              style="width: 250px"
            />
          </td>
          <td class="Rating saved-movies__cell saved-movies__cell--rating">
            <div class="saved-movies__rating-block">
              <Rating
                v-model="movie.like"
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
                @click="$emit('remove-rating', movie.id)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="saved-movies__pagination pagination">
      <Paginator
        v-model:first="currentPage"
        :rows="1"
        :totalRecords="pages"
      />
    </div>
  </section>
</template>

<script>
  import Paginator from 'primevue/paginator'
  import Rating from 'primevue/rating'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  export default {
    name: 'RatedMovies',
    components: {
      Paginator,
      Rating,
      FontAwesomeIcon,
    },
    props: {
      ratedMovies: {
        type: Array,
        required: true,
      },
      moviesPerPage: {
        type: Number,
        default: 6,
      },
    },
    data() {
      return {
        currentPage: 0,
      }
    },
    computed: {
      paginatedRatedMovies() {
        const start = this.currentPage * this.moviesPerPage
        return this.ratedMovies.slice(start, start + this.moviesPerPage)
      },
      pages() {
        return Math.ceil(this.ratedMovies.length / this.moviesPerPage)
      },
    },
  }
</script>

<style scoped>
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
