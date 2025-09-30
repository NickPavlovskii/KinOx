<template>
  <div id="app">
    <div class="layout">
      <MainHeader @search="updateSearchQuery" />

      <router-view />
      <Kinox-notification />
      <MainFooter />
    </div>
  </div>
</template>
<script>
import '../style/PrimeVue.css'
import MainHeader from './components/header/MainHeader.vue'
import MainFooter from './components/footer/MainFooter.vue'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    MainHeader,
    MainFooter,
  },
  computed: {
    ...mapState('movie', ['filteredMovies']),
  },
  data() {
    return {
      currentPage: 1,
      totalPages: 1,
    }
  },
  methods: {
    ...mapActions('movie', ['fetchMovies', 'searchMovies']),

    changePage(page) {
      this.currentPage = page
    },
    updateSearchQuery(query) {
      this.$store.commit('movies/setSearchQuery', query)
      this.currentPage = 1
      this.searchMovies()
    },
  },

  async mounted() {
    await this.fetchMovies()
    await this.searchMovies()
  },
}
</script>

<style>
  #app {
    background: #04152d;
  }
  html,
  body,
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .layout > *:last-child {
    margin-top: auto;
  }
</style>
