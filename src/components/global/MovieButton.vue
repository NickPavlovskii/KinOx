<template>
  <button
    :class="[
      'movie-button',
      { 'movie-button--active': isActive },
      customClass
    ]"
    :style="{ background: gradientColor }"
   
  >
    <span class="movie-button__content">
      <Icon
        v-if="resolvedLeftIcon"
        :icon="resolvedLeftIcon"
        class="movie-button__icon movie-button__icon--left"
      />

      <span class="movie-button__label">{{ label }}</span>

      <Icon
        v-if="resolvedRightIcon"
        :icon="resolvedRightIcon"
        class="movie-button__icon movie-button__icon--right"
      />
    </span>
  </button>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'MovieButton',
  components: {
    Icon,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Кнопка',
    },
    gradientColor: {
      type: String,
      default: 'linear-gradient(0deg, #1c4b91 0%, #027efb 100%)',
    },
    leftIcon: {
      type: String,
      default: null,
    },
    rightIcon: {
      type: String,
      default: null,
    },
    leftIconActive: {
      type: String,
      default: null,
    },
    rightIconActive: {
      type: String,
      default: null,
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    resolvedLeftIcon() {
      return this.isActive ? this.leftIconActive : this.leftIcon
    },
    resolvedRightIcon() {
      return this.isActive ? this.rightIconActive : this.rightIcon
    },
  },
}
</script>


<style scoped lang="scss">
 .movie-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(0deg, #1c4b91 0%, #027efb 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(2, 126, 251, 0.3);

  &--active {
    background: linear-gradient(0deg, #033e91 0%, #035dd3 100%);
  }

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 18px rgba(2, 126, 251, 0.45);
  }

  &__content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
  }

  &__icon {
    font-size: 1.25em;
    width: 1.25em;
    height: 1.25em;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    transition: transform 0.3s ease;

    &--left {
      margin-right: 2px;
    }

    &--right {
      margin-left: 2px;
    }

    &:hover {
      transform: scale(1.15);
    }
  }

  &__label {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
  }
}

</style>
