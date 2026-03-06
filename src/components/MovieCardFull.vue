<template>
  <router-link
    class="movie"
    :to="{ name: 'movie-details', params: { id: movie.id } }"
  >
    <div class="movie-poster poster-wrap">
      <div
        v-show="!posterLoaded"
        class="poster-skeleton"
      />
      <img
        v-show="posterLoaded"
        alt="Постер фильма"
        class="poster-image"
        :src="movie.poster?.url"
        @load="posterLoaded = true"
      />
      <div class="movie-details">
        <circle-progress
          class="circle_progress"
          :percent="movie.rating.kp * 10"
          :viewport="true"
          :size="60"
          :background="'white'"
          :is-gradient="true"
          :gradient="{ angle: 90, startColor: '#ff0000', stopColor: '#ffff00' }"
          :is-bg-shadow="true"
          :bg-shadow="{
            inset: true,
            vertical: 2,
            horizontal: 2,
            blur: 4,
            opacity: 0.4,
            color: '#000000',
          }"
          :border-width="5"
          :border-bg-width="5"
        />
        <span class="ratingtext">{{ formatRating(movie.rating?.kp) }}</span>
      </div>
    </div>
    <div class="movie-info">
      <h2 class="movie-name">{{ movie.name }}</h2>
      <Kinox-genres :genres="movie.genres" />
      <p>{{ movie.description }}</p>
      <div class="info-row">
        <span>
          <font-awesome-icon icon="globe" />
          {{ movie.country }}
        </span>
        <span>
          <font-awesome-icon icon="clock" />
          {{ formatDuration(movie.movieLength) }}
        </span>
        <span>
          <font-awesome-icon icon="calendar-days" />
          {{ movie.year }}
        </span>
      </div>
      <div class="info-row">
        <span>
          <font-awesome-icon icon="fa-brands fa-imdb" />
          {{ movie.rating.imdb }}
        </span>
        <span>kp: {{ movie.rating.kp }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import CircleProgress from 'vue3-circle-progress'
  import { formatDuration, formatRating } from '@/utils/format'

  export default {
    name: 'MovieCardFull',
    components: { FontAwesomeIcon, CircleProgress },
    props: {
      movie: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        posterLoaded: false,
      }
    },
    created() {
      if (!this.movie.poster?.url) this.posterLoaded = true
    },
    methods: {
      formatDuration,
      formatRating,
    },
  }
</script>
<style scoped>
  .movie {
    cursor: pointer;
    text-decoration: none;
    list-style: none;
    display: flex;
    color: white;
  }

  @media (max-width: 768px) {
    .movie {
      flex-direction: column;
    }
  }

  .movie-poster.poster-wrap {
    position: relative;
    text-align: center;
    border-radius: 8px;
    margin-right: 30px;
  }

  .poster-skeleton {
    position: absolute;
    inset: 0;
    min-height: 220px;
    max-width: 150px;
    margin: 0 auto;
    left: 0;
    right: 0;
    border-radius: 11px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: card-skeleton-shine 1.2s ease-in-out infinite;
  }

  .poster-image {
    position: relative;
    max-width: 150px;
    border-radius: 11px;
  }

  @keyframes card-skeleton-shine {
    to {
      background-position: 200% 0;
    }
  }

  @media (max-width: 768px) {
    .poster-image {
      max-width: 60%;
      height: auto;
    }
  }

  .movie-details {
    padding-top: 10px;
    width: 100%;
    height: 80px;
    color: white;
  }

  .movie-name {
    font-size: 25px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .circle_progress {
    position: relative;
    bottom: 60px;
    right: 17px;
    margin-right: 30px;
    color: #ffffff;
    height: auto;
  }
  .ratingtext {
    position: relative;
    bottom: 104px;
    right: 62px;
    font-size: 21px;
    color: #020c1b;
    font-weight: bold;
    text-align: center;
  }
  @media (max-width: 768px) {
    .movie-details {
      display: none;
    }
  }
</style>
