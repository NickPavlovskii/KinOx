<template>
  <section>
    <div
      v-if="isLoading"
      class="loader"
    >
      <Kinox-loader />
    </div>
    <div
      v-else-if="bookmarkedMovies.length"
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
        <kinox-movie-card
          :movie="movie"
          class="saved-movies__card-item"
        />
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
  </div>
  </section>
</template>
<script>
  import Paginator from 'primevue/paginator'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { supabase } from '@/supabase'
  import { mapActions } from 'vuex'

  export default {
    name: 'BookmarkedMovies',
    components: { Paginator, FontAwesomeIcon },
    data() {
      return {
        bookmarkedMovies: [],
        currentPage: 0,
        isLoading: true,
        moviesPerPage: 6,
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
    async created() {
      await this.loadBookmarkedMovies()
    },

    methods: {
      ...mapActions('movie', [
        'toggleBookmark',
        'updateRating',
        'fetchMovieById',
      ]),

      async loadBookmarkedMovies() {
        try {
          // 1. Получаем список закладок
          const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select('movie_id')

          if (error) throw error

          const movieIds = bookmarks.map((b) => b.movie_id)
          console.log('Закладки:', movieIds)

          if (!movieIds.length) {
            this.bookmarkedMovies = []
            return
          }

          // 2. Параллельная загрузка фильмов
          const movies = await Promise.all(
            movieIds.map((id) => this.fetchMovieById(id))
          )

          // 3. Фильтруем, если что-то не загрузилось (null/undefined)
          this.bookmarkedMovies = movies.filter(Boolean)

          console.log('movies:', this.bookmarkedMovies)
        } catch (err) {
          console.error('Ошибка при загрузке закладок:', err.message)
        } finally {
        this.isLoading = false
      }
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
