import axios from 'axios'
import movieApi from '../../api/movie'

const state = {
  rating: null,
  movies: [],
  searchQuery: '',
  filteredMovies: [],
  itemsPerPage: 21,
  bookmarks: {},
}

const mutations = {
  setMovies(state, movies) {
    state.movies = movies
  },
  setMovie(state, movie) {
    const index = state.movies.findIndex(m => m.id === movie.id)
    if (index !== -1) {
      state.movies.splice(index, 1, movie)
    } else {
      state.movies.push(movie)
    }
  },
  updateRating(state, { movieId, rating }) {
    const movie = state.movies.find(movie => movie.id === movieId)
    if (movie) movie.rating = rating
  },
  setFilteredMovies(state, movies) {
    state.filteredMovies = movies
  },
  setSearchQuery(state, query) {
    state.searchQuery = query
  },
  SET_BOOKMARK(state, { movieId, value }) {
    state.bookmarks = { ...state.bookmarks, [movieId]: value }
  },
}

const actions = {
  async fetchMovie({ commit }) {
    try {
      const res = await axios.get('http://localhost:3001/movies')
      const moviesData = res.data.docs || res.data
      commit('setMovies', moviesData)
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err.message)
    }
  },

  async fetchMovies({ commit }, { genre, type } = {}) {
    try {
      let data
      console.log(genre)
      console.log(type)
      if (genre) {
        const res = await movieApi().loadMoviesByGenre(genre)
        data = res.data.docs || res.data
      } else if (type) {
        const res = await movieApi().loadMoviesByType(type)
        data = res.data.docs || res.data
      } else {
        const res = await movieApi().loadMovieList()
        data = res.data.docs || res.data
      }

      commit('setMovies', data)
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err.message)
      commit('setMovies', [])
    }
  },
  
  async fetchMovieById({ commit }, id) {
    try {
      const { data } = await movieApi().loadMovieById(id)
      const movie = data.docs ? data.docs[0] : data
      commit('setMovie', movie)
      return movie
    } catch (err) {
      console.error('Ошибка при загрузке фильма:', err.message)
    }
  },
  

  async fetchMoviesByGenre({ commit }, genre) {
    try {
      const { data } = await movieApi().loadMoviesByGenre(genre)
      commit('setMovies', data.docs || data)
    } catch (err) {
      console.error(`Ошибка при загрузке фильмов жанра ${genre}:`, err.message)
    }
  },

  async fetchMoviesByType({ commit }, type) {
    try {
      const { data } = await movieApi().loadMoviesByType(type)
      commit('setMovies', data.docs || data)
    } catch (err) {
      console.error(`Ошибка при загрузке фильмов типа ${type}:`, err.message)
    }
  },

  searchMovies({ commit, state }) {
    const movies = state.movies
    const filteredMovies = movies.filter(movie =>
      movie.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    )
    commit('setFilteredMovies', filteredMovies)
  },

  updateRating({ commit, state }, { movieId, rating }) {
    commit('updateRating', { movieId, rating })
    const updatedMovies = state.movies.map(movie =>
      movie.id === movieId ? { ...movie, rating } : movie
    )
    localStorage.setItem('movies', JSON.stringify(updatedMovies))
  },

  toggleBookmark({ commit, state }, movieId) {
    const current = state.bookmarks[movieId] || false
    commit('SET_BOOKMARK', { movieId, value: !current })
    localStorage.setItem(`bookmark_${movieId}`, (!current).toString())
  },
}

const getters = {
  getMovieById: state => id => {
    const moviesList = state.searchQuery ? state.filteredMovies : state.movies
    return moviesList.find(movie => movie.id === id)
  },
  isMovieRated: state => movieId => {
    const movie = state.movies.find(movie => movie.id === movieId)
    return movie ? movie.rating > 0 : false
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

