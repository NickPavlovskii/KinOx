<template>
  <div
    v-if="recommendedMovies.length"
    class="container"
  >
    <h2 class="title">Рекомендуем к просмотру</h2>
    <kinox-carousel :movies="recommendedMovies" />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { supabase } from '@/supabase'

  export default {
    name: 'RecommendedMovies',
    data() {
      return {
        recommendedMovies: [],
        ratedMovies: [],
        isLoading: true,
      }
    },
    computed: {
      ...mapState('movie', ['movies', 'bookmarks']),
    },
    methods: {
      ...mapActions('movie', ['fetchMovieById', 'fetchMovies']),

      async loadBookmarkedMovies() {
        try {
          const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select('movie_id')
          if (error) throw error

          bookmarks.forEach((b) => {
            if (!this.bookmarks[b.movie_id]) {
              this.$store.commit('movie/SET_BOOKMARK', {
                movieId: b.movie_id,
                value: true,
              })
            }
          })
        } catch (err) {
          console.error('Ошибка при загрузке закладок:', err.message)
        }
      },

      async loadRatedMovies() {
        try {
          const { data: ratings, error } = await supabase
            .from('ratings')
            .select('movie_id, rating')
          if (error) throw error
          if (!ratings?.length) return

          const movies = await Promise.all(
            ratings.map((r) => this.fetchMovieById(r.movie_id))
          )

          this.ratedMovies = movies
            .map((movie) => {
              const found = ratings.find((r) => r.movie_id === movie.id)
              return found
                ? { ...movie, rating: Number(found.rating) || 0 }
                : null
            })
            .filter(Boolean)
        } catch (err) {
          console.error('Ошибка при загрузке оценённых фильмов:', err.message)
        }
      },

      async loadRecommended() {
        try {
          // 1. Собираем фильмы, которые пользователь лайкнул или оценил
          const seenIds = new Set([
            ...Object.keys(this.bookmarks).filter((id) => this.bookmarks[id]),
            ...this.ratedMovies.map((m) => m.id),
          ])

          const seenMovies = this.movies.filter((m) => seenIds.has(m.id))

          // 2. Предпочтения пользователя
          const preferredGenres = new Set(
            seenMovies.flatMap((m) => m.genres || [])
          )
          const preferredCountries = new Set(
            seenMovies.map((m) => m.country).filter(Boolean)
          )
          const preferredActors = new Set(
            seenMovies.flatMap((m) => (m.cast || []).map((a) => a.name))
          )

          // 3. Вычисляем "сходство"
          const scoredMovies = this.movies
            .filter((m) => !seenIds.has(m.id))
            .map((m) => {
              let score = 0

              // Жанры
              ;(m.genres || []).forEach((g) => {
                if (preferredGenres.has(g)) score += 3
              })

              // Страна
              if (m.country && preferredCountries.has(m.country)) {
                score += 2
              }

              // Актёры
              (m.cast || []).forEach((a) => {
                if (preferredActors.has(a.name)) score += 1
              })

              return { ...m, score }
            })
            .sort((a, b) => b.score - a.score)

          this.recommendedMovies = scoredMovies.slice(0, 10)
        } catch (err) {
          console.error('Ошибка загрузки рекомендуемых фильмов:', err.message)
        } finally {
          this.isLoading = false
        }
      },
    },

    watch: {
      bookmarks: {
        handler() {
          this.loadRecommended()
        },
        deep: true,
      },
      ratedMovies: {
        handler() {
          this.loadRecommended()
        },
        deep: true,
      },
      movies: {
        handler() {
          this.loadRecommended()
        },
        deep: true,
      },
    },

    async created() {
      await this.fetchMovies()
      await this.loadBookmarkedMovies()
      await this.loadRatedMovies()
      await this.loadRecommended()
    },
  }
</script>

<style scoped>
  .title {
    font-family: cursive;
    letter-spacing: 0.1em;
    margin-bottom: 15px;
  }

  #left {
    bottom: 290px;
    left: 1px;
    background-color: #020c1b99;
    color: #ffffff;
  }

  #right {
    right: 1px;
    background-color: #020c1b99;
    color: #ffffff;
  }

  .wrapper {
    height: 100%;
    color: #fff;
    max-width: 960px;
    margin: 0 auto;
    display: flex;

    position: relative;
  }

  .wrapper i {
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
  }

  .wrapper i:active {
    transform: translateY(-50%) scale(0.9);
  }

  .wrapper i:hover {
    background: #f2f2f2;
  }

  .wrapper i:first-child {
    left: -22px;
    display: none;
  }

  .wrapper .carousel {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    scroll-behavior: smooth;
  }

  .carousel.dragging {
    cursor: grab;
    scroll-behavior: auto;
  }

  .carousel .movie-poster {
    border-radius: 8px;
    display: inline-block;
  }

  .carousel .movie-poster img {
    border-radius: 11px;
    width: 215px;
  }

  .carousel .movie-poster:first-child {
    margin-left: 0px;
  }

  @media screen and (max-width: 900px) {
    .carousel .movie-poster img {
      width: calc(100% / 2);
    }
  }

  @media screen and (max-width: 550px) {
    .carousel .movie-poster img {
      width: 100%;
    }
  }
</style>
