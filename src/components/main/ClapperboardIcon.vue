<template>
  <div class="clapperboard-icons">
    <img
      v-for="(clapper, index) in clapperboards"
      :key="index"
      src="@/assets/clapperboard.png"
      alt="Clapperboard"
      :class="['clapper', clapper.size, clapper.opacity]"
    />
  </div>
</template>

<script setup>
const clapperboards = [
  { size: 'small', opacity: 'faded' },
  { size: 'medium', opacity: 'semi' },
  { size: 'large', opacity: 'full' },
  { size: 'medium', opacity: 'semi' },
  { size: 'small', opacity: 'faded' },
]
</script>

<style scoped>
.clapperboard-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px;
  gap: 70px;
}

.clapper {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.clapper.small { height: 40px; }
.clapper.medium { height: 80px; }
.clapper.large { height: 140px; }

.clapper.faded { opacity: 0.3; }
.clapper.semi  { opacity: 0.75; }
.clapper.full  { opacity: 1; }

.clapperboard-icons .clapper:first-child {
  margin-left: 70px;
}
.clapperboard-icons .clapper:last-child {
  margin-right: 70px;
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
