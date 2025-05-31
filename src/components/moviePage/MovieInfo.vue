<template>
  <div class="right">
    <h1 class="title">{{ movie.name }}</h1>
    <h4 class="subtitle">{{ movie.alternativeName }}</h4>
    <Kinox-genres :genres="movie.genres" />
    <div class="overview">
      <h2 class="heading">О фильме</h2>
      <p class="description">{{ movie.description }}</p>
    </div>
    <div class="right-rows">
      <div class="row">
        <div class="info">
          <div class="infoItem">
            <span
              class="text bold"
              style="letter-spacing: 0.2em"
            >
              Режиссер
            </span>
            <span class="text">{{ movie.director.producer.join(', ') }}</span>
          </div>
          <div class="infoItem">
            <span class="text bold">Сценарист:</span>
            <span class="text">
              {{ movie.director.screenwriter.join(', ') }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="row"
        style="position: relative; bottom: 30px"
      >
        <div class="info">
          <div class="infoItem">
            <span class="text bold"><font-awesome-icon icon="globe" /></span>
            <span class="text">{{ movie.country }}</span>
          </div>
          <div class="infoItem">
            <span class="text bold"><font-awesome-icon icon="clock" /></span>
            <span class="text">
              {{ convertMinutesToHours(movie.movieLength) }}
            </span>
          </div>
          <div class="infoItem">
            <span class="text bold">
              <font-awesome-icon icon="calendar-days" />
            </span>
            <span class="text">{{ movie.year }}</span>
          </div>
        </div>
      </div>

      <div class="row raiting">
        <div class="info">
          <div class="infoItem">
            <span class="text bold">
              <font-awesome-icon
                icon="fa-brands fa-imdb"
                size="2xl"
                style="background: #1c4b91"
              />
            </span>
            <span class="text">{{ movie.rating.imdb }}</span>
          </div>
          <div class="infoItem">
            <span class="text bold">kp:</span>
            <span class="text">{{ movie.rating.kp }}</span>
          </div>
        </div>
      </div>

      <div
        class="progress-section"
        style="position: relative; bottom: 70px"
      >
        <h3 style="margin-bottom: -0px; letter-spacing: 0.2em">
          Рейтинг Кинокритиков
        </h3>
        <div class="progress-bars">
          <div style="display: flex; flex-direction: column; width: 315px">
            <h4 style="letter-spacing: 0.2em">В Мире</h4>
            <div class="progress-bar">
              <ProgressBar :value="movie.rating.filmCritics * 10">
                {{ movie.rating.filmCritics }}
              </ProgressBar>
            </div>
            <span class="text votes">
              {{ movie.votes.filmCritics }} голосов
            </span>
          </div>
          <div style="display: flex; flex-direction: column; width: 270px">
            <h4>В России</h4>
            <div class="progress-bar rf">
              <ProgressBar :value="movie.rating.russianFilmCritics">
                <span style="margin-bottom: 2px">
                  {{ movie.rating.russianFilmCritics }}
                </span>
              </ProgressBar>
            </div>
            <span class="text votes">
              {{ movie.votes.russianFilmCritics }} голосов
            </span>
          </div>
        </div>
      </div>

      <div
        class="watchability"
        v-if="movie.watchability.items"
      >
        <p class="watchability-heading">Доступно на:</p>
        <ul class="watchability-list">
          <li
            v-for="item in movie.watchability.items"
            :key="item._id"
          >
            <a
              :href="item.url"
              target="_blank"
            >
              <img
                :src="item.logo.url"
                :alt="item.name"
                class="watchability-logo"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import ProgressBar from 'primevue/progressbar'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faImdb } from '@fortawesome/free-brands-svg-icons'

  library.add(faImdb)

  export default {
    name: 'MovieInfo',
    components: {
      FontAwesomeIcon,
      ProgressBar,
    },
    props: {
      movie: Object,
    },
    methods: {
      convertMinutesToHours(minutes) {
        const hours = Math.floor(minutes / 60)
        const remaining = minutes % 60
        return `${hours}ч ${remaining}м`
      },
    },
  }
</script>

<style scoped>
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

  .overview .heading {
    font-size: 24px;
    margin-bottom: 10px;
    margin-top: 15px;
  }

  .overview .description {
    line-height: 24px;
  }

  .votes {
    margin-top: -7px;
  }

  .playbtn .text {
    font-size: 20px;
    transition: all 0.7s ease-in-out;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-bottom: 20px;
    position: relative;
  }

  .info {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 0;
    display: flex;
  }

  .infoItem {
    margin-right: 10px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .text {
    margin-right: 10px;
    opacity: 0.5;
    line-height: 24px;
  }

  .text.bold {
    font-weight: 600;
    opacity: 1;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    margin-bottom: 20px;
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
  .description {
    line-height: 24px;
    font-family: cursive;
    letter-spacing: 0.07em;
  }
</style>
