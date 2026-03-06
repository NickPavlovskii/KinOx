<template>
  <div class="container">
    <div
      v-if="movieData.id"
      class="detailsBanner"
    >
      <div class="backdrop-img">
        <div class="lazy-load-image-background img-wrap">
          <div
            v-show="!backdropLoaded"
            class="img-skeleton backdrop-skeleton"
          />
          <img
            v-show="backdropLoaded"
            alt="Movie Poster"
            :src="movieData.poster?.url"
            @load="backdropLoaded = true"
          />
        </div>
      </div>
      <div class="opacity-layer"></div>
      <div class="content">
        <div class="left">
          <div class="poster-wrap">
            <div
              v-show="!posterLoaded"
              class="img-skeleton poster-skeleton"
            />
            <img
              v-show="posterLoaded"
              alt="Movie Poster"
              class="posterImg"
              :src="movieData.poster?.url"
              @load="posterLoaded = true"
            />
          </div>
          <MovieRatingBookmark
            :movie-id="movieData.id"
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
      v-if="movieData.id && movieData.type !== 'cartoon'"
      :cast="movieData.cast"
    />
    <RecommendSection />
  </div>
</template>
<script>
  import { mapState } from 'vuex'
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
        backdropLoaded: false,
        posterLoaded: false,
      }
    },
    computed: {
      ...mapState('movie', ['movies']),
      ...mapState('bookmarks', ['bookmarks']),

      breadcrumbItems() {
        return [
          { title: 'KinOx', href: '/' },
          { title: this.movieData?.name ?? 'Фильм', disabled: true },
        ]
      },

      movieData() {
        const movies = this.movies
        if (!Array.isArray(movies)) return {}
        const movieId = parseInt(this.$route.params.id)
        return movies.find((m) => m.id === movieId) || {}
      },
    },

    methods: {
      fetchMovies() {
        return this.$store.dispatch('movie/fetchMovie')
      },
    },

    watch: {
      'movieData.poster?.url'() {
        this.backdropLoaded = !this.movieData.poster?.url
        this.posterLoaded = !this.movieData.poster?.url
      },
    },
    mounted() {
      this.$store.dispatch('bookmarks/loadBookmarks')
      this.$store.dispatch('ratings/loadRatings')
      if (!Array.isArray(this.movies) || !this.movies.length) {
        this.fetchMovies()
      }
      if (!this.movieData?.poster?.url) {
        this.backdropLoaded = true
        this.posterLoaded = true
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
    margin-bottom: 20px;
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

  .detailsBanner .backdrop-img .img-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .detailsBanner .backdrop-img .backdrop-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.04) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shine 1.2s ease-in-out infinite;
  }

  .detailsBanner .backdrop-img img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
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

    gap: 20px;
    transition: gap 0.3s ease;
  }

  .left .row {
    margin-top: 20px;
  }

  .poster-wrap {
    position: relative;
    width: 100%;
  }

  .poster-wrap .poster-skeleton {
    position: absolute;
    inset: 0;
    width: 100%;
    aspect-ratio: 2/3;
    border-radius: 12px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shine 1.2s ease-in-out infinite;
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

  @media (max-width: 1085px) {
    .container {
      max-width: 900px !important;
    }
  }

  @media (min-width: 769px) {
    .rating-controls {
      display: flex;
    }

    .rating-controls img {
      margin-top: 8px;
      margin-right: 5px;
    }

    .right {
      width: 50% !important;
    }

    .content {
      gap: 100px;
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
      width: 50% !important;
    }
    .container {
      max-width: 600px !important;
    }
  }

  @media (max-width: 768px) {
    .content {
      gap: 100px;
      flex-direction: column;
    }
    .left,
    .right {
      width: 100% !important;
      max-width: none;
    }

    .container {
      max-width: 400px !important;
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
      padding-top: 100px;
      min-height: 700px;
    }
  }

  @media (max-width: 2000px) {
    .detailsBanner {
      width: 100% !important;
    }
  }

  @media (max-width: 400px) {
    .container {
      max-width: 350px !important;
    }
  }

  @keyframes skeleton-shine {
    to {
      background-position: 200% 0;
    }
  }
</style>
