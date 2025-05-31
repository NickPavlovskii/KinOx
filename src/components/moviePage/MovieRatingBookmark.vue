<template>
  <div class="movie-rating-bookmark">
    <h3 class="movie-rating-bookmark__title">Поставьте оценку</h3>
    <span class="movie-rating-bookmark__hint">
      Это улучшит ваши рекомендации
    </span>

    <div class="movie-rating-bookmark__controls">
      <img
        class="movie-rating-bookmark__cancel-icon"
        src="https://primefaces.org/cdn/primevue/images/rating/cancel.png"
        height="24"
        width="24"
        @click="resetRating"
      />
      <Rating
        v-model="rating"
        :stars="10"
        :cancel="false"
        @change="saveRating"
      />
    </div>

    <Kinox-movie-button
      :is-active="isBookmarked"
      :label="'Смотреть позже'"
      :left-icon="'ic:outline-bookmark-add'"
      :left-icon-active="'material-symbols:bookmark-add'"
      :gradient-color="
        isBookmarked
          ? 'linear-gradient(0deg, #033e91 0%, #035dd3 100%)'
          : 'linear-gradient(0deg, #1c4b91 0%, #027efb 100%)'
      "
      @click="toggleBookmarkAction"
    />
  </div>
</template>

<script>
  import Rating from 'primevue/rating'
  import { mapState, mapActions } from 'vuex'
  import { useNotificationStore } from '@/store/notifications'

  export default {
    name: 'MovieRatingBookmark',
    components: { Rating },
    props: {
      movieId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        rating: 0,
      }
    },
    computed: {
      ...mapState('bookmarks', ['bookmarks']),
      isBookmarked() {
        return (
          Array.isArray(this.bookmarks) && this.bookmarks.includes(this.movieId)
        )
      },
      ratingKey() {
        return `rating_${this.movieId}`
      },
    },
    methods: {
      ...mapActions('bookmarks', ['toggleBookmark', 'loadBookmarks']),
      toggleBookmarkAction() {
        const wasBookmarked = this.isBookmarked
        this.toggleBookmark(this.movieId).then(() => {
          const store = useNotificationStore()
          store.show({
            type: wasBookmarked ? 'error' : 'success',
            text: wasBookmarked
              ? 'Фильм удалён из закладок'
              : 'Фильм добавлен в закладки',
          })
        })
      },

      saveRating() {
        localStorage.setItem(this.ratingKey, this.rating.toString())
      },
      resetRating() {
        this.rating = 0
        this.saveRating()
      },
    },
    created() {
      this.loadBookmarks()

      const savedRating = localStorage.getItem(this.ratingKey)
      if (savedRating) {
        this.rating = parseInt(savedRating)
      }
    },

  }
</script>

<style scoped lang="scss">
  .movie-rating-bookmark {
    &__title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    &__hint {
      font-size: 0.875rem;
      color: #aaa;
      margin-bottom: 1rem;
      display: block;
    }

    &__controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    &__cancel-icon {
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
</style>

<style scoped lang="scss">
  .movie-rating-bookmark {
    &__title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    &__hint {
      font-size: 0.875rem;
      color: #aaa;
      margin-bottom: 1rem;
      display: block;
    }

    &__controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    &__cancel-icon {
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    &__bookmark-button {
      display: inline-flex;
      align-items: center;
      padding: 0.6rem 1rem;
      background: linear-gradient(0deg, #1c4b91 0%, #027efb 100%);
      color: white;
      font-weight: 600;
      border-radius: 5px;
      transition: background 0.3s ease, transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      &--active {
        background: linear-gradient(0deg, #033e91 0%, #035dd3 100%);
      }
    }

    &__icon {
      font-size: 24px;
      margin-right: 8px;
    }
  }

  .rating-controls {
  }

  @media (min-width: 768px) {
    .rating-controls {
      display: flex;
    }

    .rating-controls img {
      margin-top: 8px;
      margin-right: 5px;
    }
  }
</style>
