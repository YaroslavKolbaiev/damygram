<script setup>
import { defineProps } from "vue";

const { setShowUploadForm } = defineProps(["setShowUploadForm"]);
</script>

<template>
  <button
    @click="setShowUploadForm(true)"
    type="button"
    class="text-white h-1/2 transition duration-200 ease bg-blue-700 hover:bg-blue-800 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
  >
    Upload Photo
  </button>
</template>
