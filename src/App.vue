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

  import { mapState } from 'vuex'

  export default {
    name: 'App',
    components: {
      MainHeader,
      MainFooter,
    },
    computed: {
      ...mapState('movie', ['movies', 'filteredMovies']),
    },
    data() {
      return {
        currentPage: 1,
        totalPages: 1,
      }
    },
    created() {
      this.$store.dispatch('bookmarks/loadBookmarks')
      this.$store.dispatch('ratings/loadRatings')
    },
    methods: {
      changePage(page) {
        this.currentPage = page
      },
      updateSearchQuery(query) {
        this.$store.commit('movie/setSearchQuery', query)
        this.currentPage = 1
        this.$store.dispatch('movie/searchMovies')
      },
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
