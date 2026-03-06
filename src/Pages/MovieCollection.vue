<template>
  <div class="container">
    <div class="title_container">
      <h2
        v-if="titles[$route.path]"
        class="title"
      >
        {{ titles[$route.path] }}
      </h2>

      <div class="sort-options">
        <Dropdown
          class="custom-dropdown w-full md:w-14rem p-dropdown-indigo"
          v-model="selectedSortOption"
          placeholder="Сортировать по"
          optionLabel="label"
          optionValue="value"
          :options="sortOptions"
          @change="onSortOptionChange"
        />

        <font-awesome-icon
          v-if="sortOrder === 'asc'"
          icon="arrow-up-9-1"
          class="icon_select"
          @click="updateSortOrder('desc')"
        />
        <font-awesome-icon
          v-else
          icon="arrow-up-1-9"
          class="icon_select"
          @click="updateSortOrder('asc')"
        />
      </div>
    </div>

    <ul
      class="movie-list"
      v-if="displayedMovies.length"
    >
      <li
        v-for="(movie, index) in displayedMovies"
        :key="movie.id"
        :class="{ 'movie-item': true, 'new-row': index % 5 === 0 }"
      >
        <MovieCardFull :movie="movie" />
      </li>
    </ul>
    <p
      v-else
      class="no-results"
    >
      Фильмы не найдены для этой страницы
    </p>

    <div class="pagination">
      <Paginator
        v-model:first="first"
        :rows="itemsPerPage"
        :totalRecords="filteredMovies.length"
        :template="{
          '640px': 'PrevPageLink CurrentPageReport NextPageLink',
          default:
            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        }"
      />
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'

  import MovieCardFull from '@/components/MovieCardFull.vue'
  import Dropdown from 'primevue/dropdown'
  import Paginator from 'primevue/paginator'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import {
    faBookmark,
    faHeart,
    faArrowUp91,
    faArrowUp19,
  } from '@fortawesome/free-solid-svg-icons'

  library.add(faBookmark, faHeart, faArrowUp91, faArrowUp19)

  export default {
    components: {
      MovieCardFull,
      Dropdown,
      Paginator,
      FontAwesomeIcon,
    },
    data() {
      return {
        first: 0,
        itemsPerPage: 10,
        titles: {
          '/movie': 'Фильмы',
          '/cartoon': 'Мультфильмы',
          '/tv-series': 'Сериалы',
          '/Comedy': 'Комедии',
          '/Thriller': 'Боевики',
          '/Drama': 'Драмы',
          '/Fantasy': 'Фэнтези',
          '/Action': 'Боевики',
          '/Adventures': 'Приключения',
          '/Fiction': 'Фантастика',
          '/Crime': 'Преступления',
        },
      }
    },
    computed: {
      ...mapState(['movie', 'sorting']),
      ...mapGetters('movie', ['getMovieById']),

      sortOrder() {
        return this.sorting.sortOrder
      },
      sortOptions() {
        return this.sorting.sortOptions
      },
      selectedSortOption: {
        get() {
          return this.sorting.selectedSortOption
        },
        set(option) {
          this.updateSelectedSortOption(option)
        },
      },

      filteredMovies() {
        const movies = this.movie?.movies
        if (!Array.isArray(movies)) return []
        const path = this.$route.path.slice(1)
        return movies.filter((movie) => {
          if (path === 'movie') return movie.type === 'movie'
          if (path === 'cartoon')
            return ['cartoon', 'animated-series'].includes(movie.type)
          if (path === 'tv-series') return movie.type === 'tv-series'
          return Array.isArray(movie.genres) && movie.genres.includes(path)
        })
      },

      sortedMovies() {
        const key = this.selectedSortOption
        const sorted = [...this.filteredMovies]
        if (!key) return sorted

        return sorted.sort((a, b) => {
          const aVal = this.getPropertyValue(a, key)
          const bVal = this.getPropertyValue(b, key)

          if (typeof aVal === 'string') {
            return this.sortOrder === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
          }
          return this.sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        })
      },

      currentPage() {
        return Math.floor(this.first / this.itemsPerPage) + 1
      },
      displayedMovies() {
        const start = this.first
        const pageMovies = this.sortedMovies.slice(
          start,
          start + this.itemsPerPage
        )
        console.log('Current page:', this.currentPage)
        console.log('Items per page:', this.itemsPerPage)
        console.log('Total sorted movies:', this.sortedMovies.length)
        console.log('Movies for this page:', pageMovies.length)
        return pageMovies
      },
    },
    methods: {
      ...mapMutations(['updateSelectedSortOption', 'SET_SORT_ORDER']),
      fetchMovies() {
        return this.$store.dispatch('movie/fetchMovie')
      },

      onSortOptionChange() {
        this.first = 0
      },
      updateSortOrder(order) {
        this.SET_SORT_ORDER(order)
        this.first = 0
      },
      getPropertyValue(obj, path) {
        return path.split('.').reduce((o, p) => (o ? o[p] : null), obj)
      },
    },
    mounted() {
      this.fetchMovies()
    },

    watch: {
      '$route.path'() {
        this.first = 0
      },
      filteredMovies(newVal) {
        const maxFirst = Math.max(
          0,
          (Math.ceil(newVal.length / this.itemsPerPage) - 1) * this.itemsPerPage
        )
        if (this.first > maxFirst) {
          this.first = maxFirst
        }
      },
    },
  }
</script>

<style scoped>
  .custom-dropdown::after {
    border-top-color: white;
  }

  .custom-dropdown {
    height: 50px;
  }

  .text {
    margin-right: 5px;
    opacity: 0.5;
    line-height: 24px;
  }

  .info .text.bold {
    font-weight: 600;
    opacity: 1;
  }

  .row {
    display: flex;
    gap: 25px;
    position: relative;
    bottom: 10px;
  }

  .info {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 0;
    display: flex;
  }

  .info .infoItem {
    margin-right: 10px;
    display: flex;
    flex-flow: row wrap;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    z-index: 9999;
  }

  .icon_select {
    position: relative;
    top: 2px;
    width: 40px;
    font-size: 21px;
    justify-items: center;
  }

  .circle_progress {
    position: relative;
    height: auto;
    bottom: 70px;
    right: 37px;
    margin-right: 30px;
    color: #ffffff;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;

    padding: 20px;
    color: #fff;
  }

  .title_container {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .title {
    position: relative;
  }

  .title::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 2px;
    background: white;
    bottom: 37px;
  }

  .title_container h2 {
    letter-spacing: 0.2em;
    font-family: cursive;
  }

  .sort-options {
    color: white;
    margin: 20px 10px;
    color: #1c4b91;
    align-self: center;
  }

  .custom-dropdown {
    width: 200px;

    color: #fff;
  }

  .movie-item {
    padding: 20px;
  }

  .movie-poster {
    text-align: center;
    border-radius: 8px;
    margin-right: 30px;
  }

  .poster-image {
    max-width: 150px;
    border-radius: 11px;
  }

  .movie-details {
    padding-top: 10px;
    width: 100%;
    color: white;
    height: 80px;
  }

  .movie-name {
    font-size: 25px;
    margin-bottom: 5px;

    font-weight: bold;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;

    color: #fff;
  }

  .movie-list {
    list-style-type: none;
    padding: 0;
  }

  .movie {
    cursor: pointer;
    text-decoration: none;
    list-style-type: none;
    display: flex;
  }

  @media (max-width: 768px) {
    .movie {
      flex-direction: column;
    }

    .poster-image {
      max-width: 60%;

      border-radius: 11px;
    }

    .movie-details {
      display: none;
    }
  }
  @media (min-width: 768px) {
    .title_container {
      flex-direction: row;
    }
  }
  .row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .infoItem {
    margin-right: 10px;
  }
</style>
