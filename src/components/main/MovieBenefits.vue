<template>
  <v-container class="container_benefit">
    <v-row>
      <v-col
        v-for="(benefit, i) in benefits"
        :key="i"
        cols="12"
        sm="6"
      >
        <div class="benefit-card">
          <v-icon
            :icon="benefit.icon"
            size="28"
            class="benefit-icon"
          />
          <span class="benefit-text">{{ benefit.text }}</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  const benefits = [
    {
      icon: 'mdi-bullhorn-outline',
      text: 'Все лучшие новинки и подборки фильмов — под рукой.',
    },
    {
      icon: 'mdi-calendar-clock',
      text: 'Фильм в дороге подарит вам месяц кинопросмотров в год.',
    },
    {
      icon: 'mdi-cellphone-text',
      text: 'Смотрите кино, не отвлекаясь от дел.',
    },
    {
      icon: 'mdi-book-open-page-variant',
      text: 'Лучшие фильмы и документалки в оригинальном исполнении.',
    },
  ]
</script>

<style scoped>
  .container_benefit {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .benefit-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: white;
  }
  .benefit-icon {
    color: white;
    opacity: 0.8;
  }
  .benefit-text {
    font-size: 15px;
    line-height: 1.4;
  }
</style>
