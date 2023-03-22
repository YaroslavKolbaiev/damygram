<script setup>
import { defineProps } from "vue";
const { posts } = defineProps(["posts"]);
const urlPart = import.meta.env.VITE_SUPABASE_STORAGE_URL;
</script>

<template>
  <div
    class="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 xl:grid-cols-4"
  >
    <div v-for="post in posts">
      <img
        :src="`${urlPart}${post.url}`"
        :key="post.url"
        alt="post image"
        class="w-full md:aspect-square object-cover"
      />
    </div>
  </div>
</template>
