<template>
  <ContentWrapper
    v-if="isSearchPage"
    class="ContentWrapper"
  />
  <div class="container movieList">
    <h2 class="container_title">
      {{ isHomePage ? 'Наша коллекция' : 'Вы искали' }}
    </h2>

    <div class="sort-options">
      <Dropdown
        class="custom-dropdown w-full md:w-14rem p-dropdown-indigo"
        v-model="selectedSortOption"
        optionLabel="label"
        optionValue="value"
        placeholder="Сортировать по"
        :options="sortOptions"
        @change="sortMovies"
      />
      <font-awesome-icon
        class="icon_select"
        :icon="sortOrder === 'asc' ? 'arrow-up-9-1' : 'arrow-up-1-9'"
        @click="toggleSortOrder"
      />
    </div>

    <ul class="movie-list">
      <transition-group
        name="fade"
        tag="li"
        class="movie-item"
        v-for="movie in currentMovies"
        :key="movie.id"
      >
        <Kinox-movie-card :movie="movie" />
      </transition-group>
    </ul>

    <div class="pagination">
      <Paginator
        v-model:first="currentPage"
        :template="{
          '640px': 'PrevPageLink CurrentPageReport NextPageLink',
          default:
            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        }"
        :rows="1"
        :totalRecords="totalPages"
      />
    </div>
  </div>
</template>

<script>
  import Paginator from 'primevue/paginator'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faArrowUp91, faArrowUp19 } from '@fortawesome/free-solid-svg-icons'
  import Dropdown from 'primevue/dropdown'
  import ContentWrapper from './main/ContentWrapper.vue'

  library.add(faArrowUp91, faArrowUp19)

  export default {
    components: {
      FontAwesomeIcon,
      ContentWrapper,
  
      Dropdown,
      Paginator,
    },

    data() {
      return {
        currentPage: 0,
        isLoading: false,
      }
    },

    computed: {
      ...mapState(['movie', 'sorting']),
      ...mapGetters(['sortedMovies']),

      isHomePage() {
        return this.$route.path === '/'
      },
      isSearchPage() {
        return this.$route.path === '/search'
      },

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

      totalPages() {
        return Math.ceil(this.totalMovies / this.movie.itemsPerPage)
      },
      currentMovies() {
        const source = this.isHomePage
          ? this.sortedMovies
          : this.filteredSortedMovies
        const start = this.currentPage * this.movie.itemsPerPage
        return source.slice(start, start + this.movie.itemsPerPage)
      },
      filteredSortedMovies() {
        const query = this.movie.searchQuery.toLowerCase()
        return this.sortedMovies.filter((movie) =>
          movie.name.toLowerCase().includes(query)
        )
      },
      totalMovies() {
        return this.isHomePage
          ? this.movie.movies.length
          : this.filteredSortedMovies.length
      },
    },

    methods: {
      ...mapActions(['fetchMovies', 'searchMovies', 'updateSortOrder']),
      ...mapMutations(['updateSelectedSortOption', 'SET_SORT_ORDER']),

      toggleSortOrder() {
        const newOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
        this.SET_SORT_ORDER(newOrder)
        this.currentPage = 0
      },
    },

    async mounted() {
      await this.fetchMovies()
      await this.searchMovies()
    },
  }
</script>

<style scoped>
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .fade-move {
    transition: transform 0.4s ease;
  }

  .custom-dropdown {
    width: 200px;
    color: #fff;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
  }
  .container_title {
    display: flex;
    justify-content: center;
    letter-spacing: 0.1em;
    font-family: cursive;
  }
  .sort-options {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .icon_select {
    position: relative;
    top: 2px;
    width: 40px;
    font-size: 21px;
    justify-items: center;
    cursor: pointer;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    z-index: 9999;
  }

  .ContentWrapper {
    text-align: center;
    margin: 0 auto;
  }

  .movie-list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, auto));
    gap: 20px;
    padding: 0;
    margin: 0;
  }

  .movie-item {
    /* можно добавить стили для карточек, например, чтобы они занимали всю ширину ячейки */
    width: 100%;
  }
  @media (max-width: 768px) {
  .movie-list {
    list-style: none;
    display: grid;
    place-items: center;       /* Центрируем ячейки */
    grid-template-columns: 1fr; /* Одна колонка */
    gap: 20px;
    padding: 0;
  }

  .movie-item {
    padding: 10px;
    display: flex;
    justify-content: center;   /* Центрируем содержимое карточки */
    width: 100%;               /* чтобы не растягивалась сильно */
    max-width: 300px;          /* ограничим максимальную ширину карточки */
  }

  .container_title {
    font-size: 1.3rem;
  }
}

</style>
