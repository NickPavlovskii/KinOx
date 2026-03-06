import { createStore } from 'vuex';
import sortingModule from './modules/sorting';
import movie from './modules/movie';
import bookmarks from './modules/bookmarks';
import ratings from './modules/ratings';

const store = createStore({
  modules: {
    sorting: sortingModule,
    movie,
    bookmarks,
    ratings,
  },
});

export default store;
