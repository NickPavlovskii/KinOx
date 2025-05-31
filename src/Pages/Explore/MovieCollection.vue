<template>
  <div class="container">
    <div class="title_container">
      <h2
        class="title"
        v-if="titles[this.$route.path]"
      >
        {{ titles[this.$route.path] }}
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

    <ul class="movie-list">
      <li
        v-for="(movie, index) in displayedMovies"
        :key="movie.id"
        :class="{ 'movie-item': true, 'new-row': index % 5 === 0 }"
      >
        <MovieCardFull :movie="movie" />
      </li>
    </ul>

    <div class="pagination">
      <Paginator
        v-model:first="currentPage"
        :template="{
          '640px': 'PrevPageLink CurrentPageReport NextPageLink',
          default:
            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        }"
        :rows="itemsPerPage"
        :totalRecords="filteredM.length"
      />
    </div>
  </div>
</template>

<script>
  import 'primevue/resources/primevue.min.css'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import {
    faBookmark,
    faHeart,
    faArrowUp91,
    faArrowUp19,
  } from '@fortawesome/free-solid-svg-icons'
  import Paginator from 'primevue/paginator'
  import Dropdown from 'primevue/dropdown'
  import MovieCardFull from './MovieCardFull.vue'

  library.add(faArrowUp91, faArrowUp19, faBookmark, faHeart)

  export default {
    components: {
      FontAwesomeIcon,
      Dropdown,
      Paginator,
      MovieCardFull,
    },
    data() {
      return {
        itemsPerPage: 10,
        currentPage: 0,
        titles: {
          '/movie': 'Фильмы',
          '/cartoon': 'Мультфильмы',
          '/tv-series': 'Сериалы',
          '/Comedy': 'Комедии',
          '/Боевик': 'Боевики',
          '/Drama': 'Драмы',
          '/Fiction': 'Фэнтези',
          '/Action movie': 'Фантастика',
          '/Adventures': 'Приключения',
        },
      }
    },
    computed: {
      ...mapState(['movie', 'sorting']),
      ...mapGetters(['getMovieById', 'sortedMovies']),

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

      filteredM() {
        const routePath = this.$route.path
        const validGenres = [
          'Comedy',
          'Drama',
          'Fantasy',
          'Fiction',
          'Action movie',
          'Adventures',
        ]

        return this.movie.movies.filter((movie) => {
          if (routePath === '/movie') {
            return movie.type === 'movie'
          } else if (routePath === '/cartoon') {
            return movie.type === 'cartoon' || movie.type === 'animated-series'
          } else if (routePath === '/tv-series') {
            return movie.type === 'tv-series'
          } else if (validGenres.includes(routePath.substring(1))) {
            return movie.genres.includes(routePath.substring(1))
          }

          return false
        })
      },

      sortedDisplayedMovies() {
        const movies = [...this.filteredM]
        const key = this.selectedSortOption
        if (!key) return movies

        return movies.sort((a, b) => {
          const aValue = this.getPropertyValue(a, key)
          const bValue = this.getPropertyValue(b, key)

          if (this.sortOrder === 'asc') {
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return aValue.localeCompare(bValue)
            } else {
              return aValue - bValue
            }
          } else {
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return bValue.localeCompare(aValue)
            } else {
              return bValue - aValue
            }
          }
        })
      },

      displayedMovies() {
        const startIndex = this.currentPage * this.itemsPerPage
        return this.sortedDisplayedMovies.slice(
          startIndex,
          startIndex + this.itemsPerPage
        )
      },
    },
    methods: {
      ...mapMutations(['updateSelectedSortOption', 'SET_SORT_ORDER']),
      ...mapActions(['fetchMovies', 'searchMovies', 'updateSortOrder']),

      onSortOptionChange() {
        this.currentPage = 0 // сбрасываем на первую страницу при смене сортировки
      },

      updateSortOrder(order) {
        this.SET_SORT_ORDER(order)
        this.currentPage = 0
      },

      getPropertyValue(object, path) {
        if (!path) return null
        const keys = path.split('.')
        let value = object
        for (const key of keys) {
          value = value ? value[key] : null
        }
        return value
      },
    },
    mounted() {
      this.fetchMovies()
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

  .ratingtext {
    position: relative;
    bottom: 110px;
    right: 37px;
    font-size: 21px;
    color: #020c1b;
    font-weight: bold;
    text-align: center;
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
    bottom: -3px;
  }

  .title_container h2 {
    letter-spacing: 0.2em;
    font-family: cursive;
  }

  @media (min-width: 768px) {
    .title_container {
      flex-direction: row;
    }
  }

  .sort-options {
    color: white;
    margin: 0 10px;
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
      height: auto;
      border-radius: 11px;
    }

    .movie-details {
      display: none;
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

  .ratingtext {
    margin-left: 5px;
  }
</style>
