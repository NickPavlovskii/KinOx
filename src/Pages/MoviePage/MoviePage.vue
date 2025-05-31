<template>
  <div class="container">
    <div class="detailsBanner">
      <div class="backdrop-img">
        <div class="lazy-load-image-background">
          <img
            alt="Movie Poster"
            :src="movieData.poster?.url"
          />
        </div>
      </div>
      <div class="opacity-layer"></div>
      <div class="content">
        <div class="left">
          <img
            alt="Movie Poster"
            class="posterImg"
            :src="movieData.poster?.url"
          />
          <MovieRatingBookmark
            :movie-id="movieData.id"
            :initial-rating="rating"
            :is-bookmarked="isBookmarked"
            @update-rating="updateRating"
            @toggle-bookmark="toggleBookmark"
          />
        </div>

        <div class="right">
          <MovieInfo :movie="movieData" />

          <MovieWatchability
            v-if="movieData.watchability?.items?.length"
            :watchability="movieData.watchability.items"
          />
        </div>
      </div>

      <h4 class="link">
        <v-breadcrumbs :items="breadcrumbItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </h4>
    </div>

    <MovieCast
      v-if="movieData.type !== 'cartoon'"
      :cast="movieData.cast"
    />
    <RecommendSection />
  </div>
</template>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import RecommendSection from '@/components/RecommendSection.vue'
  import MovieRatingBookmark from '@/components/moviePage/MovieRatingBookmark.vue'
  import MovieCast from '@/components/moviePage/MovieCast.vue'
  import MovieInfo from '@/components/moviePage/MovieInfo.vue'
  import MovieWatchability from '@/components/moviePage/MovieWatchability.vue'

  export default {
    components: {
      RecommendSection,
      MovieRatingBookmark,
      MovieCast,
      MovieInfo,
      MovieWatchability,
    },

    data() {
      return {
        rating: 0,
      }
    },

    computed: {
      ...mapState(['movie', 'bookmarks']),
      ...mapGetters(['isMovieRated']),

      breadcrumbItems() {
        return [
          { title: 'KinOx', href: '/' },
          { title: this.movieData.name, disabled: true },
        ]
      },

      movieData() {
        const movieId = parseInt(this.$route.params.id)
        return this.movie.movies.find((m) => m.id === movieId) || {}
      },

      isBookmarked() {
        return this.bookmarks[this.movieData.id] || false
      },

      ratingKey() {
        return `rating_${this.movieData.id}`
      },

      bookmarkKey() {
        return `bookmark_${this.movieData.id}`
      },
    },

    methods: {
      ...mapActions(['toggleBookmark', 'updateRating', 'fetchMovies']),
    },

    watch: {
      isBookmarked(value) {
        localStorage.setItem(this.bookmarkKey, value.toString())
      },

      rating(value) {
        localStorage.setItem(this.ratingKey, value.toString())
      },
    },

    created() {
      const storedRating = localStorage.getItem(this.ratingKey)
      if (storedRating) {
        this.rating = parseInt(storedRating)
      }

      const storedBookmark = localStorage.getItem(this.bookmarkKey)
      if (storedBookmark === 'true') {
        this.$store.commit('SET_BOOKMARK', {
          movieId: this.movieData.id,
          value: true,
        })
      }
    },

    mounted() {
      if (!this.movie.movies.length) {
        this.fetchMovies()
      }
    },
  }
</script>

<style scoped>
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
    height: 80%;
  }

  .left {
    flex-shrink: 0;
    width: 40%;
  }

  .MyRecom {
    position: relative;
  }

  .custom-rating {
    height: 24px;
    margin-top: 7px;
    margin-bottom: 5px;
  }

  .progress-bars {
    display: flex;
    gap: 70px;
  }

  .progress-bar {
    margin-right: 20px;
    width: 100%;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    border-radius: 4px;
    height: 20px;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .right-rows {
    position: relative;
    bottom: 40px;
  }

  .raiting {
    position: relative;
    bottom: 60px;
  }

  .link {
    position: absolute;
    top: 60px;
    left: 50px;
  }

  .detailsBanner {
    width: 140%;
    padding-left: 15px;
    padding-top: 100px;
    margin-bottom: 50px;
  }

  .detailsBanner .backdrop-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.1;
    overflow: hidden;
  }

  .detailsBanner .backdrop-img img {
    width: 100%;
    height: 100%;

    object-position: center;
  }

  .detailsBanner .opacity-layer {
    width: 100%;
    height: 250px;
    background: linear-gradient(180deg, rgba(4, 21, 45, 0) 0%, #04152d 79.17%);
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .content {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 20px;
    transition: gap 0.3s ease;
  }

  .left .row {
    margin-top: 20px;
  }

  .posterImg {
    width: 100%;
    display: block;
    border-radius: 12px;
    transition: transform 0.3s ease;
  }

  .posterImg:hover {
    transform: scale(1.02);
  }

  .right {
    color: white;
    width: 50%;
  }

  .detailsBanner .content .right .title {
    font-size: 28px;
    transition: font-size 0.3s ease;
  }

  .detailsBanner .content .right .subtitle {
    font-size: 16px;
    position: relative;
    bottom: 20px;
    font-style: italic;
    opacity: 0.5;
    margin: 25px 0 -10px 0;
  }

  .detailsBanner .content .right .overview {
    margin-bottom: 25px;
    position: relative;
    bottom: 10px;
  }

  .right {
    width: 100% !important;
  }

  @media (min-width: 768px) {
    .rating-controls {
      display: flex;
    }

    .rating-controls img {
      margin-top: 8px;
      margin-right: 5px;
    }

    .right {
      width: 100% !important;
    }

    .content {
      gap: 100px;
      flex-direction: row;
    }

    .title {
      font-size: 34px;
      line-height: 44px;
    }

    .subtitle {
      font-size: 20px;
      line-height: 28px;
    }
  }

  @media (max-width: 900px) {
    .posterImg {
      max-width: 350px !important;
    }

    .detailsBanner {
      width: 100%;
      margin-bottom: 0;
      padding-top: 120px;
      min-height: 700px;
    }
    .left {
      width: 50%;
    }

    .right {
      width: 60% !important;
    }
    .container {
      max-width: 600px !important;
    }
  }

  @media (max-width: 768px) {
    .left,
    .right {
      width: 100% !important;
      max-width: none;
    }

    .container {
      max-width: 415px !important;
    }

    .overview .description {
      padding-right: 100px;
    }

    .rating-controls {
      display: flex;
    }

    .rating-controls img {
      margin-top: 5px;
      margin-right: 5px;
    }

    .detailsBanner {
      width: 100%;
      margin-bottom: 0;
      padding-top: 120px;
      min-height: 700px;
    }
  }
</style>
