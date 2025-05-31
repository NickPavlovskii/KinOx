<template>
  <section
    v-if="bookmarkedMovies.length"
    class="saved-movies__section saved-movies__section--bookmarked"
  >
    <div class="saved-movies__title-wrapper">
      <h2 class="saved-movies__title">
        <font-awesome-icon icon="fa-solid fa-film" />
        Посмотреть позже
      </h2>
    </div>
    <ul class="saved-movies__card-list">
      <li
        v-for="movie in paginatedBookmarkedMovies"
        :key="movie.id"
        class="saved-movies__card-item"
      >
        <Kinox-movie-card :movie="movie" />
      </li>
    </ul>
    <div class="saved-movies__pagination">
      <Paginator
        v-model:first="currentPage"
        :rows="1"
        :totalRecords="pages"
        :template="{
          '640px': 'PrevPageLink CurrentPageReport NextPageLink',
          default:
            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        }"
      />
    </div>
  </section>
</template>

<script>
  import Paginator from 'primevue/paginator'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  export default {
    name: 'BookmarkedMovies',
    components: {
      Paginator,
      FontAwesomeIcon,
    },
    props: {
      bookmarkedMovies: {
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
      paginatedBookmarkedMovies() {
        const start = this.currentPage * this.moviesPerPage
        return this.bookmarkedMovies.slice(start, start + this.moviesPerPage)
      },
      pages() {
        return Math.ceil(this.bookmarkedMovies.length / this.moviesPerPage)
      },
    },
  }
</script>

<style scoped></style>
