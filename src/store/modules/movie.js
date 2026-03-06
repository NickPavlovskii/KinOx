// store/modules/movie.js
const state = {
  rating: null,
  movies: require('../../components/mock/kinopoisk.json').docs,
  searchQuery: '',
  filteredMovies: [],
  itemsPerPage: 21,
};

const fetchMoviesData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const moviesData = require('../../components/mock/kinopoisk.json');
      resolve(moviesData.docs);
    }, 200);
  });
};

const mutations = {
  setMovies(state, movies) {
    state.movies = movies;
  },
  updateRating(state, { movieId, rating }) {
    const movie = state.movies.find(movie => movie.id === movieId);
    if (movie) {
      movie.rating = rating;
    }
  },

    setFilteredMovies(state, movies) {
      state.filteredMovies = movies;
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
};

const actions = {

      async fetchMovie({ commit }) {
        const moviesData = await fetchMoviesData();
        commit('setMovies', moviesData);
      },
      async searchMovies({ commit, state }) {
        const movies = state.movies;
        const filteredMovies = movies.filter((movie) => {
          return movie.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        });
        commit('setFilteredMovies', filteredMovies);
      },
    
 
   updateRating({ commit }, { movieId, rating }) {
    commit('updateRating', { movieId, rating });
  },


};

const getters = {
  getMovieById: (state) => (id) => {
    const moviesList = state.searchQuery ? state.filteredMovies : state.movies;
    return moviesList.find((movie) => movie.id === id);
  },
  isMovieRated: state => movieId => {
    const movie = state.movies.find(movie => movie.id === movieId);
    return movie ? movie.rating > 0 : false;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
