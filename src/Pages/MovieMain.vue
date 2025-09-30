<template>
  <div>
    <ContentWrapper
      class="ContentWrapper"
      @search="performSearch"
    />
    <Kinox-social-links />
    <div
      v-if="isLoading"
      class="loader"
    >
      <Kinox-loader />
    </div>
    <div v-else>
      <WatchNow />

      <CategorySelector />

      <TopMovie />

      <MovieBenefits />
      <ClapperboardIcon />

      <MovieList />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import MovieList from '@/components/MovieList.vue'
import ContentWrapper from '@/components/main/ContentWrapper.vue'
import TopMovie from '@/components/main/TopMovie.vue'
import WatchNow from '@/components/main/WatchNow.vue'
import ClapperboardIcon from '@/components/main/ClapperboardIcon.vue'
import MovieBenefits from '@/components/main/MovieBenefits.vue'
import CategorySelector from '@/components/main/CategorySelector.vue'

export default {
  components: {
    ContentWrapper,
    MovieList,
    TopMovie,
    WatchNow,
    ClapperboardIcon,
    MovieBenefits,
    CategorySelector,
  },
  data() {
    return {
      isLoading: true,
    }
  },
  async mounted() {
    try {
      await this.fetchMovie()
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapState('movie', ['movies', 'filteredMovies', 'searchQuery']),
  },
  methods: {
    ...mapActions('movie', ['fetchMovie', 'searchMovies']),

    async searchMoviesWithLoader() {
      this.isLoading = true
      try {
        await this.searchMovies()
      } finally {
        this.isLoading = false
      }
    },

    performSearch() {
      this.searchMoviesWithLoader()
    },
  },
}
</script>

<style scoped>
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 20px;
    color: #333;
  }

  .ContentWrapper {
    text-align: center;
    margin: 0 auto;
  }
</style>
