<template>
  <div
    v-if="latestMovies.length > 0"
    class="container"
  >
    <h2 class="title">
      <font-awesome-icon
        icon="fire"
        class="fire"
      />
      Новинки
    </h2>
    <kinox-carousel  :movies="latestMovies" />
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import {
    faArrowRight,
    faArrowLeft,
    faFire,
  } from '@fortawesome/free-solid-svg-icons'

  library.add(faArrowRight, faArrowLeft, faFire)

  export default {
    components: {
      FontAwesomeIcon,
    },
    computed: {
      ...mapState(['movie']),
      latestMovies() {
        if (this.movie.movies.length > 0) {
          const sorted = [...this.movie.movies].sort((a, b) => b.year - a.year)
          return sorted.slice(0, 10)
        }
        return []
      },
    },
  }
</script>

