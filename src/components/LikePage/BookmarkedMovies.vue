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
        <kinox-movie-card :movie="movie" class="saved-movies__card-item"/>
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

<style scoped>  

.saved-movies__card-item {
  width: 200px; /* defines width */
  box-sizing: border-box; /* width includes padding + border */
  padding: 10px;
}


@media (max-width: 768px) {
    .movie-list {
      list-style: none;
      display: grid;
      place-items: center;
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 0;
    }

    .movie-item {
      padding: 10px;
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 300px;
    }

    .container_title {
      font-size: 1.3rem;
    }
  }
  </style>
