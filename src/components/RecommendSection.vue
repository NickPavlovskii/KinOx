<template>
  <div
    v-if="recommendedMovies.length > 0"
    class="container"
  >
    <h2 class="title">Рекомендуем к просмотру</h2>
    <kinox-carousel :movies="recommendedMovies" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
  library.add(faArrowRight, faArrowLeft)

  export default {
    components: {},
    computed: {
      ...mapState(['movie']),
      recommendedMovies() {
        const { movies } = this.movie
        if (!Array.isArray(movies)) return []

        const isLikedOrBookmarked = (movie) => {
          return (
            localStorage.getItem(`bookmark_${movie.id}`) === 'true' ||
            localStorage.getItem(`like_${movie.id}`) === 'true'
          )
        }

        const bookmarked = movies.filter(isLikedOrBookmarked)

        const extractUnique = (key) => [
          ...new Set(
            bookmarked.flatMap((m) =>
              (Array.isArray(m[key]) ? m[key] : [m[key]]).filter(Boolean)
            )
          ),
        ]

        const genres = extractUnique('genres')
        const countries = extractUnique('country')
        const actors = [
          ...new Set(
            bookmarked.flatMap((m) => (m.cast || []).map((a) => a.name))
          ),
        ]

        const groupBy = (list, keyGetter) =>
          list.reduce((acc, item) => {
            const keys = keyGetter(item)
            keys.forEach((key) => {
              if (!acc[key]) acc[key] = []
              acc[key].push(item)
            })
            return acc
          }, {})

        const groupGenres = groupBy(movies, (m) => m.genres || [])
        const groupCountries = groupBy(movies, (m) =>
          [m.country].filter(Boolean)
        )
        const groupActors = groupBy(movies, (m) =>
          (m.cast || []).map((a) => a.name)
        )

        const rankAndCollect = (items, group) =>
          items
            .sort((a, b) => (group[b]?.length || 0) - (group[a]?.length || 0))
            .flatMap((item) => group[item] || [])

        const result = [
          ...rankAndCollect(genres, groupGenres),
          ...rankAndCollect(countries, groupCountries),
          ...rankAndCollect(actors, groupActors),
        ]

        const unique = Array.from(
          new Map(result.map((m) => [m.id, m])).values()
        )

        return unique.slice(0, 10)
      },
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
