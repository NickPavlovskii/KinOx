<template>
  <div class="container">
    <div class="movie-list saved-movies__list">
      <!-- Закладки -->
      <bookmarked-movies
        v-if="bookmarkedMovies.length"
        :moviesPerPage="moviesPerPage"
      />

      <!-- Разделитель -->
      <clapperboard-icon
        v-if="ratedMovies.length && bookmarkedMovies.length"
        class="saved-movies__divider"
      />

      <!-- Оценённые -->
      <rated-movies
        v-if="ratedMovies.length > 0"
        :moviesPerPage="moviesPerPage"
        @remove-rating="removeRating"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ClapperboardIcon from '@/components/main/ClapperboardIcon.vue'
import BookmarkedMovies from '@/components/LikePage/BookmarkedMovies.vue'
import RatedMovies from '@/components/LikePage/RatedMovies.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilm, faStar } from '@fortawesome/free-solid-svg-icons'

library.add(faFilm, faStar)

export default {
  name: 'SavedMovies',

  components: {
    ClapperboardIcon,
    BookmarkedMovies,
    RatedMovies,
  },

  data() {
    return {
      moviesPerPage: 6,
    }
  },

  computed: {
    ...mapState({
      allMovies: (state) => state.movie.movies,
      bookmarks: (state) => state.bookmarks.bookmarks,
      ratedMovies: (state) => state.ratings.ratedMovies, // ⚡️ оценки теперь из стора
    }),
    ...mapGetters('ratings', ['ratedMovies']),
    bookmarkedMovies() {
      return this.allMovies.filter((movie) =>
        this.bookmarks.includes(movie.id)
      )
    },
  },

  methods: {
    ...mapActions('ratings', ['removeRating', 'loadRatings']),
  },

  async created() {
    // ⚡️ сначала грузим фильмы, потом закладки и оценки
    await this.$store.dispatch('fetchMovies')
    await this.$store.dispatch('bookmarks/loadBookmarks')
    await this.loadRatings()
  },
}
</script>


<style>
  .saved-movies {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
  }

  .pagination,
  .saved-movies__pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    z-index: 9999;
  }

  .saved-movies__list {
    color: white;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }

  .saved-movies__title-wrapper {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .saved-movies__title {
    position: relative;
    right: 23px;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .saved-movies__card-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .saved-movies__card-item {
    width: 250px;
  }

  .saved-movies__divider {
    margin-top: -40px;
    margin-bottom: -80px;
  }

  .saved-movies__table {
    margin: auto;
    width: 100%;
    height: 100%;
    border-collapse: collapse;
  }

  .saved-movies__row {
    vertical-align: top;
    height: 450px;
  }

  .saved-movies__cell {
    padding: 10px;
    height: 350px;
  }

  .saved-movies__cell--rating {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .like th,
  .like td {
    padding: 10px;
  }

  .saved-movies__cell {
    height: 350px;
  }

  /* Адаптивность для экранов до 768px */
  @media (max-width: 768px) {
    .saved-movies__cell--rating {
      flex-direction: column;
      align-items: flex-start;
    }

    .like td {
      display: flex;
      flex-direction: column;
      height: 100% !important;
    }

    .saved-movies__title-wrapper {
      align-items: center;
      text-align: center;
    }

    .saved-movies__title {
      margin-bottom: 10px;
    }

    .saved-movies__cell {
      height: 100% !important;
    }

    .saved-movies__row {
      margin-top: 20px;
    }

    .saved-movies__rating-block {
      margin-top: 10px !important;
    }
  }
</style>
