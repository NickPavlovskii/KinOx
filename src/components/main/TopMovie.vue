<template>
  <div class="container">
    <div>
      <div class="title_container">
        <h2 class="title">
          <font-awesome-icon
            icon="trophy"
            style="color: #f89e00"
          />
          Top 10
        </h2>
        <div class="switchingTabs">
          <div class="tabItems">
            <span
              @click="toggleTimeFrame('recent')"
              class="tabItem"
              :class="{ active: timeFrame === 'recent' }"
            >
              За год
            </span>
            <span
              @click="toggleTimeFrame('all')"
              class="tabItem"
              :class="{ active: timeFrame === 'all' }"
            >
              За все время
            </span>
            <div
              class="movingBg"
              :style="{ left: activeTabLeft }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <kinox-carousel v-if="latestMovies.length" :movies="latestMovies" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faArrowLeft,
  faTrophy,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRight, faArrowLeft, faHeart, faTrophy)

export default {
  components: {
    FontAwesomeIcon,

  },

  data() {
    return {
      timeFrame: 'recent',
    }
  },

  computed: {
    ...mapState(['movie']),

    latestMovies() {
      if (!this.movie?.movies?.length) return []

      const sortedMovies = [...this.movie.movies]
        .filter((m) => m && m.rating && typeof m.rating.kp === 'number')
        .sort((a, b) => b.rating.kp - a.rating.kp)

      if (this.timeFrame === 'recent') {
        const topYears = [...new Set(sortedMovies.map((m) => m.year))]
          .sort((a, b) => b - a)
          .slice(0, 3)
        return sortedMovies.filter((m) => topYears.includes(m.year))
      }

      return sortedMovies.slice(0, 10)
    },

    activeTabLeft() {
      return this.timeFrame === 'recent' ? '0' : '100px'
    },
  },

  methods: {
    toggleTimeFrame(frame) {
      this.timeFrame = frame
    },
  },
}
</script>


<style lang="scss" scoped>
  .movie-poster {
    position: relative;
    display: inline-block;
  }

  .switchingTabs {
    position: relative;
    height: 34px;
    background-color: white;
    border-radius: 20px;
    padding: 2px 0px 2px 0px;

    .tabItems {
      display: flex;
      align-items: center;
      height: 30px;
      position: relative;

      .tabItem {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        color: #020c1b;
        font-size: 14px;
        position: relative;
        z-index: 1;
        cursor: pointer;
        transition: color ease 0.3s;

        &.active {
          color: white;
        }
      }

      .movingBg {
        height: 35px;
        width: 100px;
        border-radius: 20px;
        background-image: linear-gradient(
          98.37deg,
          #f89e00 0.99%,
          #da2f68 100%
        );
        position: absolute;
        right: 2px;
        top: -2px;
        transition: left cubic-bezier(0.88, -0.35, 0.565, 1.35) 0.4s;
      }
    }
  }

  #left {
    bottom: 290px;
    left: 5px;
    background-color: #020c1b99;
    color: #ffffff;
  }

  #right {
    bottom: 290px;
    right: 5px;
    background-color: #020c1b99;
    color: #ffffff;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
  }
  .title_container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .wrapper {
    height: 100%;
    color: #fff;
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    position: relative;
    color: #fff;

    i {
      height: 44px;
      width: 44px;
      color: #343f4f;
      cursor: pointer;
      font-size: 1.15rem;
      position: absolute;
      text-align: center;
      line-height: 44px;
      background: #fff;
      border-radius: 50%;
      transform: translateY(-50%);
      transition: transform 0.1s linear;

      &:active {
        transform: translateY(-50%) scale(0.9);
      }

      &:hover {
        background: #f2f2f2;
      }

      &#left {
        left: -22px;
      }

      &#right {
        right: -22px;
      }
    }

    .carousel {
      overflow: hidden;
      white-space: nowrap;
      scroll-behavior: smooth;
      cursor: pointer;

      &.dragging {
        cursor: grab;
        scroll-behavior: auto;
      }
    }

    .movie-poster {
      display: inline-block;
      border-radius: 8px;
      margin-right: 14px;

      img {
        border-radius: 11px;
        width: 215px;
      }

      &:first-child {
        margin-left: 0px;
      }
    }

    @media screen and (max-width: 900px) {
      .movie-poster img {
        width: calc(100% / 2);
      }
    }

    @media screen and (max-width: 550px) {
      .movie-poster img {
        width: 100%;
      }
    }
  }
</style>
