<template>
  <div>
    <ContentWrapper
      class="ContentWrapper"
      @search="performSearch"
    />
    <SocialLinksPanel />
    <div
      v-if="isLoading"
      class="loader"
    >
      <BaseLoader />
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
  import BaseLoader from '@/components/BaseLoader.vue'
  import SocialLinksPanel from '@/components/SocialLinksPanel.vue'
  import MovieList from '@/components/MovieList.vue'
  import ContentWrapper from '@/components/main/ContentWrapper.vue'
  import TopMovie from '@/components/main/TopMovie.vue'
  import WatchNow from '@/components/main/WatchNow.vue'
  import ClapperboardIcon from '@/components/ClapperboardIcon.vue'
  import MovieBenefits from '@/components/global/MovieBenefits.vue'
  import CategorySelector from '@/components/main/CategorySelector.vue'

  export default {
    components: {
      SocialLinksPanel,
      BaseLoader,
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
    async beforeMount() {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.isLoading = false
    },
    computed: {
      ...mapState(['movie']),
    },
    methods: {
      ...mapActions(['movie', 'fetchMovies']),
      async searchMoviesWithLoader() {
        this.isLoading = true
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await this.$store.dispatch('movie/searchMovies')
        this.isLoading = false
      },
      performSearch() {
        this.searchMoviesWithLoader()
      },
    },
    mounted() {
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
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
