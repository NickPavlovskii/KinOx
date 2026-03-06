<template>
  <header :class="{ header: true, active: isMenuOpen }">
    <div class="headerContent">
      <!-- Logo -->
      <router-link
        to="/"
        style="text-decoration: none; color: white; height: 100%"
      >
        <div class="logo">
          <img
            src="../../assets/logo.png"
            alt=""
          />
        </div>
      </router-link>
      <div class="group">
        <!-- Menu items -->
        <ul class="menuItems">
          <li>
            <router-link
              :to="{ path: '/movie' }"
              class="menuItem"
            >
              <a>Фильмы</a>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ path: '/tv-series' }"
              class="menuItem"
            >
              <a>Сериалы</a>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ path: '/cartoon' }"
              class="menuItem"
            >
              <a>Мультфильмы</a>
            </router-link>
          </li>
          <li class="menuItem bookmarksItem">
            <font-awesome-icon
              icon="bookmark"
              class="Bookmark"
              v-if="!isSearchActive"
              @click="navigateToLikePage"
            />
          </li>
          <li class="bookmarksLink">
            <router-link
              :to="{ path: '/bookmarks-ratings' }"
              class="menuItem"
            >
              <a>Смотреть позже</a>
            </router-link>
          </li>
        </ul>
        <div class="right-controls">
          <div class="header-search-wrap">
            <Kinox-search-box
              :isSearchActive="isSearchActive"
              @blur="toggleSearch"
            />
          </div>
          <div
            :class="['mobileMenu', { active: show }]"
            @click="toggleMenu"
          >
            <div class="toggleMenu">
              <span :class="['line', 'top', { active: show }]"></span>
              <span :class="['line', 'middle', { active: show }]"></span>
              <span :class="['line', 'bottom', { active: show }]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faBars, faClose, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import { mapState, mapActions, mapMutations } from 'vuex'

library.add(faSearch, faBars, faClose, faBookmark, faHeart)

export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      isSearchActive: false,
      showResults: false,
      searchQuery: '',
      isMenuOpen: false,
      show: false,
    }
  },
  computed: {
    ...mapState('movie', ['movies', 'searchQuery', 'filteredMovies']),
    filteredMoviesList() {
      return Array.isArray(this.filteredMovies) ? this.filteredMovies.slice(0, 3) : []
    },
  },
  methods: {
    ...mapActions('movie', ['searchMovies']),
    ...mapMutations('movie', ['setSearchQuery']),
    toggleSearch() { this.isSearchActive = !this.isSearchActive },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      this.show = !this.show
    },
    navigateToLikePage() { this.$router.push({ name: 'bookmarks-ratings' }) },
    toggleResults() { this.showResults = !this.showResults },
    handleInput() {
      if (this.timerId) clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        this.showResults = true
        this.setSearchQuery(this.searchQuery)
        this.searchMovies()
      }, 500)
    },
    handleEnter() {
      if (event.key === 'Enter') this.$router.push({ path: '/search' })
    },
    clearSearchQuery() { this.searchQuery = '' },
    handleBlur() { this.showResults = false },
    selectMovie(movie) {
      this.searchQuery = movie.name
      this.showResults = false
      this.$router.push({ path: `/movie/${movie.id}` })
    },
  },
  mounted() { this.searchMovies() },
}
</script>

<style lang="scss">

.header {
  font-family: cursive;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #020c1b99;
  color: white;
  display: flex;
  align-items: center;
  z-index: 5;

  &.active { background-color: #020c1b; }
}

.headerContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

/* ── Logo ─────────────────────────────────────────────────────────── */

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    height: 300%;
    margin-left: 30px;
  }
}

/* ── Right group ──────────────────────────────────────────────────── */

.group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 50px;
}

/* search + burger container */
.right-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header-search-wrap {
  display: flex;
  align-items: center;
}

/* ── Menu items ───────────────────────────────────────────────────── */

.menuItems {
  list-style-type: none;
  display: flex;
  align-items: center;
  margin-left: auto;

  .menuItem {
    margin-right: 15px;
    cursor: pointer;
    text-decoration: none;
    color: white;
    list-style: none;

    a {
      position: relative;
      letter-spacing: 0.2em;
      font-size: 1em;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: white;
        bottom: -3px;
        transform: scaleX(0);
        transition: transform 0.5s ease-in-out;
        transform-origin: right;
      }
      &:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }
}

.bookmarksLink { display: none; }

/* ── Burger ───────────────────────────────────────────────────────── */

.mobileMenu {
  cursor: pointer;
  display: none; /* hidden on desktop */
  color: white;
}

.toggleMenu {
  position: relative;
  width: 30px;
  height: 20px;
}

.line {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #333;
  border-radius: 2px;
  left: 0;
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19),
              opacity 0.3s ease;
}
.top    { top: 0; }
.middle { top: 8px; }
.bottom { top: 16px; }

.active .top    { transform: translateY(8px) rotate(45deg); }
.active .middle { opacity: 0; }
.active .bottom { transform: translateY(-8px) rotate(-45deg); }

/* ── Misc ─────────────────────────────────────────────────────────── */

.text { margin-right: 5px; opacity: 0.5; line-height: 24px; }
.row  { display: flex; gap: 25px; position: relative; bottom: 10px; }

.info {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px 0;
  display: flex;

  .infoItem { margin-right: 10px; display: flex; flex-flow: row wrap; }
}

.dropdown-image   { width: 35%; margin-right: 6px; }
.dropdown-shortDesc { white-space: wrap; }

/* ── Mobile ───────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .group {
    display: flex;
    align-items: center;
    margin-right: 12px;
    gap: 0;
    flex: 1;
    justify-content: flex-end;
  }

  .right-controls {
    display: flex;
    align-items: center;
    gap: 8px; /* gap between search icon and burger */
  }

  .header-search-wrap {
    display: flex;
    align-items: center;
  }

  /* Show burger on mobile */
  .mobileMenu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .toggleMenu {
    display: block;
    position: relative;
    width: 26px;
    height: 18px;
    top: 0;
  }

  .line {
    height: 3px;
    width: 80%;
    background: #fff;
    border-radius: 2px;
  }

  /* Mobile nav overlay */
  .header .menuItems {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    left: 100%;
    transition: transform 0.5s ease-in-out;
  }

  .header.active .menuItems {
    top: 60px;
    opacity: 1;
    visibility: visible;
    left: 0;
    display: flex;
    flex-direction: column;
    background: #020c1b;
    width: 100%;
    height: calc(100vh - 60px);
    margin: 0;
    padding: 1rem 0;

    .menuItem { margin: 10px 25px; }
  }

  .bookmarksLink { display: block; }
  .bookmarksItem { display: none; }

  .dropdown-movieLength .text { display: none; }
  .dropdown-shortDesc { display: none; }
}
</style>