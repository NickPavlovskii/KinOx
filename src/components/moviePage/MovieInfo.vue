<template>
  <div class="movie-info">
    <h1 class="movie-info__title">{{ movie.name }}</h1>
    <h4 class="movie-info__subtitle">{{ movie.alternativeName }}</h4>
    <Kinox-genres :genres="movie.genres" />
    <div class="movie-info__overview">
      <h2 class="movie-info__overview-heading">О фильме</h2>
      <p class="movie-info__overview-description">{{ movie.description }}</p>
    </div>
    <div class="movie-info__rows">
      <div class="movie-info__row">
        <div class="movie-info__info">
          <div class="movie-info__info-item">
            <span
              class="movie-info__text movie-info__text--bold"
              style="letter-spacing: 0.2em"
            >
              Режиссер
            </span>
            <span class="movie-info__text">
              {{ movie.director.producer.join(', ') }}
            </span>
          </div>
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">
              Сценарист:
            </span>
            <span class="movie-info__text">
              {{ movie.director.screenwriter.join(', ') }}
            </span>
          </div>
        </div>
      </div>

      <div class="movie-info__row movie-info__row--shifted">
        <div class="movie-info__info">
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">
              <font-awesome-icon icon="globe" />
            </span>
            <span class="movie-info__text">{{ movie.country }}</span>
          </div>
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">
              <font-awesome-icon icon="clock" />
            </span>
            <span class="movie-info__text">
              {{ formatDuration(movie.movieLength) }}
            </span>
          </div>
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">
              <font-awesome-icon icon="calendar-days" />
            </span>
            <span class="movie-info__text">{{ movie.year }}</span>
          </div>
        </div>
      </div>

      <div class="movie-info__row movie-info__row--rating">
        <div class="movie-info__info">
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">
              <font-awesome-icon
                icon="fa-brands fa-imdb"
                size="2xl"
                class="movie-info__icon movie-info__icon--imdb"
              />
            </span>
            <span class="movie-info__text">{{ movie.rating.imdb }}</span>
          </div>
          <div class="movie-info__info-item">
            <span class="movie-info__text movie-info__text--bold">kp:</span>
            <span class="movie-info__text">{{ movie.rating.kp }}</span>
          </div>
        </div>
      </div>

      <div class="movie-info__progress-section">
        <h3 class="movie-info__critics-title">Рейтинг Кинокритиков</h3>
        <div class="movie-info__progress-bars">
          <div class="movie-info__progress-block">
            <h4 class="movie-info__progress-label">В Мире</h4>
            <div class="movie-info__progress-bar">
              <ProgressBar :value="movie.rating.filmCritics * 10">
                {{ movie.rating.filmCritics }}
              </ProgressBar>
            </div>
            <span class="movie-info__text movie-info__votes">
              {{ movie.votes.filmCritics }} голосов
            </span>
          </div>
          <div
            class="movie-info__progress-block movie-info__progress-block--rf"
          >
            <h4 class="movie-info__progress-label">В России</h4>
            <div class="movie-info__progress-bar movie-info__progress-bar--rf">
              <ProgressBar :value="movie.rating.russianFilmCritics">
                <span class="movie-info__rf-value">
                  {{ movie.rating.russianFilmCritics }}
                </span>
              </ProgressBar>
            </div>
            <span class="movie-info__text movie-info__votes">
              {{ movie.votes.russianFilmCritics }} голосов
            </span>
          </div>
        </div>
      </div>
      <MovieWatchability :items="movie.watchability.items" />
    </div>
  </div>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import ProgressBar from 'primevue/progressbar'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faImdb } from '@fortawesome/free-brands-svg-icons'
  import MovieWatchability from './MovieWatchability.vue'
  import { formatDuration } from '@/utils/format'

  library.add(faImdb)

  export default {
    name: 'MovieInfo',
    components: {
      FontAwesomeIcon,
      ProgressBar,
      MovieWatchability,
    },
    props: {
      movie: Object,
    },
    methods: {
      formatDuration,
    },
  }
</script>

<style scoped>
  .movie-info {
    color: white;
    width: 100% !important;
  }

  .movie-info__title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
    transition: font-size 0.3s ease;
  }

  .movie-info__subtitle {
    font-size: 16px;
    position: relative;
    bottom: 20px;
    font-style: italic;
    opacity: 0.5;
    margin: 25px 0 -10px 0;
  }

  .movie-info__overview {
    margin-bottom: 25px;
    position: relative;
    bottom: 10px;
  }

  .movie-info__overview-heading {
    font-size: 24px;
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .movie-info__overview-description {
    line-height: 24px;
    font-family: cursive;
    letter-spacing: 0.07em;
  }

  .movie-info__rows {
    position: relative;
    bottom: 40px;
  }

  .movie-info__row {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-bottom: 20px;
    position: relative;
  }

  .movie-info__row--shifted {
    position: relative;
    bottom: 30px;
  }

  .movie-info__row--rating {
    position: relative;
    bottom: 60px;
  }

  .movie-info__info {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 0;
    display: flex;
  }

  .movie-info__info-item {
    margin-right: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .movie-info__text {
    margin-right: 10px;
    opacity: 0.5;
    line-height: 24px;
  }

  .movie-info__text--bold {
    font-weight: 600;
    opacity: 1;
  }

  .movie-info__icon {
    display: inline-block;
  }

  .movie-info__icon--imdb {
    background: #1c4b91;
  }

  .movie-info__progress-section {
    position: relative;
    bottom: 70px;
  }

  .movie-info__critics-title {
    margin-bottom: 0;
    letter-spacing: 0.2em;
  }

  .movie-info__progress-bars {
    display: flex;
    gap: 70px;
  }

  .movie-info__progress-block {
    display: flex;
    flex-direction: column;
    width: 315px;
  }

  .movie-info__progress-block--rf {
    width: 270px;
  }

  .movie-info__progress-label {
    letter-spacing: 0.2em;
    margin-bottom: 10px;
  }

  .movie-info__progress-bar {
    margin-right: 20px;
    width: 100%;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    border-radius: 4px;
    height: 20px;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .movie-info__progress-bar--rf {
    background-color: #f2f2f2;
  }

  .movie-info__rf-value {
    margin-bottom: 2px;
  }

  .movie-info__votes {
    margin-top: -7px;
  }

  @media (min-width: 768px) {
    .movie-info__title {
      font-size: 34px;
      line-height: 44px;
    }

    .movie-info__subtitle {
      font-size: 20px;
      line-height: 28px;
    }

    .content {
      gap: 100px;
      flex-direction: row;
    }
  }

  @media (max-width: 900px) {
    .posterImg {
      max-width: 350px !important;
    }

    .movie-info {
      width: 60% !important;
    }

    .container {
      max-width: 600px !important;
    }
  }

  @media (max-width: 768px) {
    .left,
    .movie-info {
      width: 100% !important;
      max-width: none;
    }
  }
</style>
