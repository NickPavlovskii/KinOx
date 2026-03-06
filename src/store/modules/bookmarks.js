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
      try {
        let saved = localStorage.getItem('kinox_bookmarks')
        if (!saved) {
          const legacy = localStorage.getItem('bookmarks')
          if (legacy) {
            const data = JSON.parse(legacy)
            if (Array.isArray(data)) {
              localStorage.setItem('kinox_bookmarks', legacy)
              saved = legacy
            }
          }
        }
        const bookmarks = saved ? JSON.parse(saved) : []
        commit('SET_BOOKMARKS', Array.isArray(bookmarks) ? bookmarks : [])
      } catch {
        commit('SET_BOOKMARKS', [])
      }
    },
    toggleBookmark({ commit, state }, movieId) {
      const isBookmarked = state.bookmarks.includes(movieId)
      if (isBookmarked) {
        commit('REMOVE_BOOKMARK', movieId)
      } else {
        commit('ADD_BOOKMARK', movieId)
      }
      try {
        localStorage.setItem(
          'kinox_bookmarks',
          JSON.stringify(state.bookmarks)
        )
      } catch (e) {
        console.warn('KinOx: не удалось сохранить закладки', e)
      }
    },
  },
}
