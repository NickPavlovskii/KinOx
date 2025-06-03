<template>
  <div class="wrapper">
    <v-icon
      id="left"
      v-show="currentSlide > 0"
      @click="prevSlide"
    >
      mdi-chevron-left
    </v-icon>
    <v-container class="pa-0 kino-carousel" fluid>
      <v-carousel
        v-model="currentSlide"
        hide-delimiters
        height="auto"
        :show-arrows="false"
        class="custom-carousel"
      >
        <v-carousel-item
          v-for="(slideMovies, index) in movieSlices"
          :key="index"
        >
          <div class="carousel">
            <div
              v-for="movie in slideMovies"
              :key="movie.id"
              class="movie-poster"
            >
              <kinox-movie-card :movie="movie" />
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-container>
    <v-icon
      id="right"
      v-show="currentSlide < movieSlices.length - 1"
      @click="nextSlide"
    >
      mdi-chevron-right
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'KinoCarousel',
  props: {
    movies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentSlide: 0,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    cardsPerSlide() {
      if (this.windowWidth >= 1920) return 5
      if (this.windowWidth >= 1280) return 5
      if (this.windowWidth >= 960) return 5
      if (this.windowWidth >= 600) return 3
      return 1
    },
    movieSlices() {
      const slices = []
      for (let i = 0; i < this.movies.length; i += this.cardsPerSlide) {
        slices.push(this.movies.slice(i, i + this.cardsPerSlide))
      }
      return slices
    },
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
      this.currentSlide = 0
    },
    prevSlide() {
      if (this.currentSlide > 0) this.currentSlide--
    },
    nextSlide() {
      if (this.currentSlide < this.movieSlices.length - 1) this.currentSlide++
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;

  #left,
  #right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: #020c1b99;
    color: #ffffff;
    cursor: pointer;
    border-radius: 50%;
    padding: 10px;
    font-size: 32px;
  }

  #left {
    left: 10px; // исправлено!
  }

  #right {
    right: 10px;
  }
}

.kino-carousel {
  background: transparent;
}

.carousel {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: nowrap;
  overflow: hidden;
  padding: 10px 0;
}

.movie-poster {
  position: relative;
  display: inline-block;

  img {
    border-radius: 11px;
    width: 215px;
  }

  .description-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  &:hover .description-overlay {
    opacity: 1;
  }

  .shortDescription {
    max-width: 100%;
    padding: 20px;
    word-wrap: break-word;
    white-space: normal;
  }

  p {
    word-wrap: break-word;
  }
}

/* Адаптив под разные размеры экранов */
@media screen and (max-width: 1280px) {
  .movie-poster img {
    width: 180px;
  }
}

@media screen and (max-width: 960px) {
  .movie-poster img {
    width: 160px;
  }
}

@media screen and (max-width: 600px) {
  .movie-poster img {
    width: 100%;
  }

  .movie-poster {
    margin: 10px;
  }
}
</style>



