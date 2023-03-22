<script setup>
import ProfileComponent from "../components/ProfileComponent.vue";
</script>

<template>
  <ProfileComponent :key="$route.params.username" />
</template>
