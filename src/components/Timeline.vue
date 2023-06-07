<script setup>
import Card from "./Card.vue";
import PageLoading from "./PageLoading.vue";
import LoginMessage from "./LoginMessage.vue";
import { useUserStore } from "../stores/users";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user, isLoadingUser } = storeToRefs(userStore);
</script>
<template>
  <div class="container mx-auto px-12">
    <div v-if="!isLoadingUser">
      <div
        v-if="user"
        class="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 xl:grid-cols-4"
      >
        <Card />
      </div>
      <LoginMessage v-else />
    </div>
    <PageLoading v-else />
  </div>
</template>
