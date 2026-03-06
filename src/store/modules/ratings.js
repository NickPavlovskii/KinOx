const STORAGE_KEY = 'kinox_ratings'

function loadFromStorage() {
  try {
    let saved = localStorage.getItem(STORAGE_KEY)
    let data = saved ? JSON.parse(saved) : {}
    if (Object.keys(data).length === 0 && typeof localStorage.key === 'function') {
      const migrated = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('rating_')) {
          const id = key.replace('rating_', '')
          const val = parseInt(localStorage.getItem(key), 10)
          if (!Number.isNaN(val)) migrated[id] = val
        }
      }
      if (Object.keys(migrated).length) {
        data = migrated
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    }
    return data
  } catch {
    return {}
  }
}

function saveToStorage(ratings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
  } catch (e) {
    console.warn('KinOx: не удалось сохранить рейтинги', e)
  }
}

export default {
  namespaced: true,
  state: {
    ratings: {}, // { [movieId]: number }
  },
  getters: {
    getRating: (state) => (movieId) => state.ratings[movieId] ?? 0,
    hasRating: (state) => (movieId) =>
      state.ratings[movieId] !== undefined && state.ratings[movieId] > 0,
    ratedMovieIds: (state) => Object.keys(state.ratings).map(Number),
  },
  mutations: {
    SET_RATINGS(state, ratings) {
      state.ratings = ratings
    },
    SET_RATING(state, { movieId, value }) {
      if (value > 0) {
        state.ratings[movieId] = value
      } else {
        const next = { ...state.ratings }
        delete next[movieId]
        state.ratings = next
      }
    },
    REMOVE_RATING(state, movieId) {
      const next = { ...state.ratings }
      delete next[movieId]
      state.ratings = next
    },
  },
  actions: {
    loadRatings({ commit }) {
      commit('SET_RATINGS', loadFromStorage())
    },
    setRating({ commit, state }, { movieId, value }) {
      const num = typeof value === 'number' ? value : parseInt(value, 10) || 0
      commit('SET_RATING', { movieId, value: num })
      saveToStorage(state.ratings)
    },
    removeRating({ commit, state }, movieId) {
      commit('REMOVE_RATING', movieId)
      saveToStorage(state.ratings)
    },
  },
}
