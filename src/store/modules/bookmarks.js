export default {
  namespaced: true,
  state: {
    bookmarks: [],
  },
  mutations: {
    SET_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks
    },
    ADD_BOOKMARK(state, movieId) {
      if (!state.bookmarks.includes(movieId)) {
        state.bookmarks.push(movieId)
      }
    },
    REMOVE_BOOKMARK(state, movieId) {
      state.bookmarks = state.bookmarks.filter(id => id !== movieId)
    },
  },
  actions: {
    loadBookmarks({ commit }) {
      const saved = localStorage.getItem('bookmarks')
      const bookmarks = saved ? JSON.parse(saved) : []
      commit('SET_BOOKMARKS', bookmarks)
    },
    toggleBookmark({ commit, state }, movieId) {
      const isBookmarked = state.bookmarks.includes(movieId)
      console.log(isBookmarked)
      let updatedBookmarks

      if (isBookmarked) {
        commit('REMOVE_BOOKMARK', movieId)
        updatedBookmarks = state.bookmarks.filter(id => id !== movieId)
      } else {
        commit('ADD_BOOKMARK', movieId)
        updatedBookmarks = [...state.bookmarks, movieId]
      }

      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
    },
  },
}
