<script setup>
import { ref, onMounted, defineEmits } from "vue";

const emit = defineEmits(["intersect"]);
const observer = ref(null);
const dom = ref(null);

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit("intersect");
    }
  });

  observer.value.observe(dom.value);
});
</script>

<template>
  <div>
    <div class="h-1 w-1" ref="dom"></div>
  </div>
</template>
