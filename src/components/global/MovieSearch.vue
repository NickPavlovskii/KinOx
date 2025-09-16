<template>
  <form
    :class="['search', { opened: isOpened }]"
    @click="openSearch"
  >
    <input
      ref="inputRef"
      v-model="searchQuery"
      type="text"
      class="search-input"
      spellcheck="false"
      :placeholder="searchPlaceholder"
      @input="handleInput"
      @keydown.enter.prevent="handleEnter"
      @blur="onBlur"
    />

    <div
      class="cross"
      @click.stop="clearAndClose"
    ></div>

    <div
      v-if="
        isOpened && searchQuery.trim().length >= 1 && filteredMoviesList.length
      "
      class="dropdown"
    >
      <router-link
        v-for="movie in filteredMoviesList"
        :key="movie.id"
        :to="{ name: 'movie-details', params: { id: movie.id } }"
        class="dropdown-item"
        @click="clearAndClose"
      >
        <img
          :src="movie.poster.url"
          class="dropdown-image"
          alt="Постер"
        />
        <div class="dropdown-info">
          <h3 class="dropdown-name">{{ movie.name }}</h3>
          <p class="dropdown-shortDesc">{{ movie.shortDescription }}</p>
          <div class="info-row">
            <span>
              <i class="pi pi-clock"></i>
              {{ convertMinutesToHours(movie.movieLength) }}
            </span>
            <span>
              <i class="pi pi-calendar"></i>
              {{ movie.year }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </form>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'SearchBox',
    data() {
      return {
        searchQuery: '',
        isOpened: false,
        timerId: null,
      }
    },
    computed: {
      ...mapState(['movie']),
      filteredMoviesList() {
        return this.movie.filteredMovies.slice(0, 3)
      },
      searchPlaceholder() {
        return this.isOpened ? 'Поиск фильмов...' : ''
      },
    },
    methods: {
      ...mapActions(['searchMovies']),
      ...mapMutations(['setSearchQuery']),
      openSearch() {
        if (!this.isOpened) {
          this.isOpened = true
          setTimeout(() => this.$refs.inputRef?.focus(), 300)
        }
      },
      clearAndClose() {
        this.searchQuery = ''
        this.isOpened = false
        this.$refs.inputRef?.blur()
      },
      onBlur() {
        setTimeout(() => {
          if (this.searchQuery === '') this.isOpened = false
        }, 200)
      },
      handleInput() {
        clearTimeout(this.timerId)
        this.timerId = setTimeout(() => {
          this.setSearchQuery(this.searchQuery)
          this.searchMovies()
        }, 500)
      },
      handleEnter() {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } })
      },
      convertMinutesToHours(minutes) {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return `${h}ч ${m}м`
      },
    },
  }
</script>

<style scoped lang="scss">
  $white: #fff;
  $black: #1d2125;
  $font-family: 'Questrial', sans-serif;
  $border-width: 0.1rem;
  $search-height: 1.8rem;
  $search-width: 25rem;

  .search {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    .search-input {
      background: none;
      border: $border-width solid $white;
      border-radius: $search-height;
      height: $search-height;
      width: $search-height;
      color: $white;
      padding: 0.2rem 0.6rem;
      font-family: $font-family;
      font-size: 0.65rem;
      letter-spacing: 0.01rem;
      transition: all 0.3s ease;
      cursor: pointer;
      min-width: $search-height;
      max-width: $search-width;

      &:focus {
        outline: none;
        width: $search-width;
        cursor: text;
      }
    }

    .cross {
      position: absolute;
      bottom: 4px;
      right: 0.3rem;
      cursor: pointer;
      width: 23px;
      height: 16px;
      transform: translateX(22px) translateY(14px);
      transition: all 0.3s 0.3s ease;

      &:before,
      &:after {
        content: '';
        display: block;
        background: $white;
        position: absolute;
        width: $border-width;
        height: 0.9rem;
        transition: all 0.3s ease;
        left: 0.45rem;
      }

      &:before {
        transform: rotate(-45deg);
      }

      &:after {
        transform: rotate(-45deg);
      }
    }

    &.opened {
      .search-input {
        width: $search-width;

        transition-delay: 0.6s;
        cursor: text;
      }

      .cross {
        transform: translateX(4px) translateY(1px);
        transition-delay: 0s;

        &:before {
          transition-delay: 0.3s;
          transform: rotate(45deg);
        }
      }
    }

    .dropdown {
      position: absolute;
      top: calc($search-height + 0.3rem);
      width: $search-width;
      background: #2c2f34;
      border-radius: 0.25rem;
      z-index: 999;
      padding: 0.3rem 0;

      .dropdown-item {
        display: flex;
        align-items: flex-start;
        padding: 0.3rem;
        color: $white;
        text-decoration: none;
        transition: background 0.2s ease;

        &:hover {
          background: #3a3d42;
        }

        .dropdown-image {
          width: 35%;

          object-fit: cover;
          margin-right: 0.4rem;
        }

        .dropdown-info {
          flex: 1;

          .dropdown-name {
            font-size: 0.7rem;
            font-weight: bold;
            margin: 0;
          }

          .dropdown-shortDesc {
            font-size: 0.6rem;
            margin: 0.2rem 0;
            color: #ccc;
          }

          .info-row {
            display: flex;
            gap: 0.4rem;
            font-size: 0.55rem;
            color: #aaa;
          }
        }
      }
    }
  }

  @media (max-width: 1024px) {
    $search-width: 15rem;

    .search {
      .search-input {
        max-width: $search-width;

        &:focus {
          width: $search-width;
        }
      }

      .dropdown {
        width: $search-width;
      }
    }
  }

  @media (max-width: 768px) {
    $search-width: 14rem;

    .search {
      margin-right: 0;
      .search-input {
        max-width: $search-width;

        &:focus {
          width: $search-width;
        }
      }

      .dropdown {
        width: $search-width;
      }
    }
  }

  @media (max-width: 480px) {
    $search-width: 9rem;

    .search {
      .search-input {
        max-width: $search-width;

        &:focus {
          width: $search-width;
        }
      }

      .dropdown {
        width: $search-width;
      }
    }
  }

  @media (max-width: 400px) {
    $search-width: 6rem;

    .search {
      .search-input {
        max-width: $search-width;

        &:focus {
          width: $search-width;
        }
      }

      .dropdown {
        width: $search-width;
      }
    }
  }
</style>
