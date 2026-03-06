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
  import { mapState } from 'vuex'
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
    async beforeMount() {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.isLoading = false
    },
    computed: {
      ...mapState(['movie']),
    },
    methods: {
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


    fetch('https://api.example.com/movies', {
      headers: {
        Authorization: 'Bearer VXNBS89-QB04KC8-GFRC28N-MV7RCG0',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Данные из API:', data) // 🔍 Вывод в консоль
      })
      .catch((err) => {
        console.error('Ошибка:', err)
      })
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
