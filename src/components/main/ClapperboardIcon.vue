<template>
  <div class="clapperboard-icons">
    <img
      v-for="(clapper, index) in clapperboards"
      :key="index"
      :class="clapper.class"
      src="@/assets/clapperboard.png"
      alt="Clapperboard"
    />
  </div>
</template>

<script setup>
  const clapperboards = [
    { class: 'clapper small faded' },
    { class: 'clapper medium semi' },
    { class: 'clapper large full' },
    { class: 'clapper medium semi' },
    { class: 'clapper small faded last' },
  ]
</script>

<style scoped>
  .clapperboard-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px;
  }

  .clapper {
    margin-right: 70px;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .clapper.last {
    margin-right: 50px;
  }

  .clapper.small {
    height: 40px;
  }

  .clapper.medium {
    height: 80px;
  }

  .clapper.large {
    height: 140px;
  }

  .clapper.faded {
    opacity: 0.3;
  }

  .clapper.semi {
    opacity: 0.75;
  }

  .clapper.full {
    opacity: 1;
  }

  @media screen and (max-width: 900px) {
    .clapper:first-child,
    .clapper:last-child {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    .clapper:nth-child(2),
    .clapper:nth-child(3) {
      display: none;
    }

    .clapper:first-child,
    .clapper:last-child {
      display: block;
    }
  }
</style>
