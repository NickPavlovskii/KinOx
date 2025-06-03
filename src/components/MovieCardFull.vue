<template>
  <router-link
    class="movie"
    :to="{ name: 'movie-details', params: { id: movie.id } }"
  >
    <div class="movie-poster">
      <img
        alt="Постер фильма"
        class="poster-image"
        :src="movie.poster.url"
      />
      <div class="movie-details">
        <circle-progress
          class="circle_progress"
          :percent="movie.rating.kp * 10"
          :viewport="true"
          :on-viewport="movie.rating.kp.toFixed(1)"
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
        <span class="ratingtext">{{ movie.rating.kp.toFixed(1) }}</span>
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
          {{ convertMinutesToHours(movie.movieLength) }}
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

  export default {
    name: 'MovieCardFull',
    components: { FontAwesomeIcon, CircleProgress },
    props: {
      movie: {
        type: Object,
        required: true,
      },
    },
    methods: {
      convertMinutesToHours(minutes) {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return `${hours}h ${remainingMinutes}min`
      },
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

  .movie-poster {
    text-align: center;
    border-radius: 8px;
    margin-right: 30px;
  }

  .poster-image {
    max-width: 150px;
    border-radius: 11px;
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
