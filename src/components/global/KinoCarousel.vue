<template>
  <div class="wrapper">
    <i
      id="left"
      v-show="showLeftArrow"
      @click="scrollLeft"
    >
      <font-awesome-icon icon="arrow-left" />
    </i>

    <div
      ref="carousel"

      :class="['carousel', { dragging: isDragging }]"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragStop"
      @mouseleave="dragStop"
      @touchstart="dragStart"
      @touchmove="dragging"
      @touchend="dragStop"
      @scroll="updateArrows"
    >
      <div
        v-for="movie in movies"
        class="movie-poster"
        :key="movie.id"
      >
        <Kinox-movie-card :movie="movie" />
      </div>
    </div>

    <i
      id="right"
      v-show="showRightArrow"
      @click="scrollRight"
    >
      <font-awesome-icon icon="arrow-right" />
    </i>
  </div>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'


  library.add(faArrowRight, faArrowLeft)

  export default {
    name: 'KinoCarousel',
    props: {
      movies: {
        type: Array,
        required: true,
      },
    },
    components: {
      FontAwesomeIcon,
   
    },
    data() {
      return {
        isDragging: false,
        dragStartX: 0,
        scrollStart: 0,
        positionDiff: 0,
        prevScrollLeft: 0,
        showLeftArrow: false,
        showRightArrow: false,
      }
    },
    mounted() {
      this.updateArrows()
      window.addEventListener('resize', this.updateArrows)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.updateArrows)
    },
    methods: {
      scroll(offset) {
        const carousel = this.$refs.carousel
        const poster = carousel.querySelector('.movie-poster')
        if (poster) {
          carousel.scrollLeft += offset * (poster.clientWidth + 14)
          this.updateArrows()
        }
      },
      scrollLeft() {
        this.scroll(-1)
        this.showHideIcons()
      },
      scrollRight() {
        this.scroll(1)
        this.showHideIcons()
      },
      dragStart(e) {
        this.isDragging = true
        this.dragStartX = e.pageX || e.touches[0].pageX
        this.scrollStart = this.$refs.carousel.scrollLeft
        this.prevScrollLeft = this.scrollStart
        this.showHideIcons()
      },
      dragging(e) {
        if (!this.isDragging) return
        const x = e.pageX || e.touches[0].pageX
        this.positionDiff = x - this.dragStartX
        this.$refs.carousel.scrollLeft = this.scrollStart - this.positionDiff
        this.updateArrows()
        this.showHideIcons()
      },
      showHideIcons() {
        const carousel = this.$el.querySelector('.carousel')
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth
        const arrowIcons = this.$el.querySelectorAll('.wrapper i')
        arrowIcons[0].style.display =
          carousel.scrollLeft === 0 ? 'none' : 'block'
        arrowIcons[1].style.display =
          carousel.scrollLeft === scrollWidth ? 'none' : 'block'
      },
      dragStop() {
        if (!this.isDragging) return
        this.isDragging = false
        this.autoSlide()
        this.updateArrows()
      },
      autoSlide() {
        const carousel = this.$refs.carousel
        const poster = carousel.querySelector('.movie-poster')
        if (!poster) return

        const posterWidth = poster.clientWidth + 14
        const distance = Math.abs(this.positionDiff)
        const diffToScroll = posterWidth - distance

        if (carousel.scrollLeft > this.prevScrollLeft) {
          carousel.scrollLeft +=
            distance > posterWidth / 3 ? diffToScroll : -this.positionDiff
        } else {
          carousel.scrollLeft -=
            distance > posterWidth / 3 ? diffToScroll : -this.positionDiff
        }
      },
      updateArrows() {
        const carousel = this.$refs.carousel
        if (!carousel) return
        this.showLeftArrow = carousel.scrollLeft > 0
        this.showRightArrow =
          carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth
      },
    },
  }
</script>
<style lang="scss">
  .title {
    font-family: cursive;
    letter-spacing: 0.1em;
  }
  .longArrow {
    width: 20px;
    position: relative;
    top: 4px;
    margin-left: 3px;
  }
  .circle_progress {
    position: absolute;
    margin-top: 12px;
    left: 5px;
    color: #ffffff;
  }
  .circle_progress .percentage {
    color: black;
  }

  #left {
    z-index: 3;
    bottom: 290px;
    left: 5px;
    background-color: #020c1b99;
    color: #ffffff;
  }
  #right {
    z-index: 3;
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

    .wrapper {
      height: 100%;
      color: #fff;
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      position: relative;

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

        &:first-child {
          left: -22px;
          display: none;
        }
      }

      .carousel {
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        scroll-behavior: smooth;
      }
    }
  }

  @media screen and (max-width: 550px) {
    .carousel .movie-poster img {
      width: 100%;
    }
    .carousel .movie-poster {
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 10px;
    }
  }
</style>
