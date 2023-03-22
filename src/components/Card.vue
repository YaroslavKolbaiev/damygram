<script setup>
import { RouterLink } from "vue-router";
import Observer from "./Observer.vue";
import { defineProps, onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/users";
const { userProp } = defineProps(["userProp"]);
const urlPart = import.meta.env.VITE_SUPABASE_STORAGE_URL;

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const currentPosts = ref([]);
const notFollowingUsers = ref(false);
const ids = ref([]);
const lastCardIndex = ref(4);
const endOfData = ref(false);

const fetchData = async () => {
  const { data } = await supabase
    .from("followers_following")
    .select("following_id")
    .eq("follower_id", user.value.id);

  ids.value = data.map((dataId) => dataId.following_id);

  const res = await supabase
    .from("posts")
    .select()
    .in("owner_id", ids.value)
    .range(0, lastCardIndex.value)
    .order("created_at", { ascending: false });

  if (!res.data.length) {
    notFollowingUsers.value = true;
    return;
  }

  currentPosts.value = res.data;
};

const fetchNextData = async () => {
  if (!endOfData.value) {
    const { data } = await supabase
      .from("posts")
      .select()
      .in("owner_id", ids.value)
      .range(lastCardIndex.value + 1, lastCardIndex.value + 5)
      .order("created_at", { ascending: false });

    currentPosts.value = [...currentPosts.value, ...data];

    lastCardIndex.value = lastCardIndex.value + 5;

    if (!data.length) {
      endOfData.value = true;
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div
    v-for="post in currentPosts"
    :key="post.id"
    class="bg-white w-full border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <a href="#">
      <img
        class="rounded-t-lg w-full md:aspect-square object-cover cursor-default"
        :src="`${urlPart}${post.url}`"
        :alt="post.caption"
      />
    </a>
    <div class="p-4">
      <RouterLink :to="`/profile/${post.author}`">
        <h5
          class="mb-2 text-2xl hover:scale-110 transition duration-200 ease text-center font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ post.author }}
        </h5>
      </RouterLink>

      <p class="font-normal text-gray-700 dark:text-gray-400">
        {{ post.caption }}
      </p>
    </div>
  </div>
  <div class="col-span-full" v-if="notFollowingUsers">
    <h1 class="font-bold text-2xl text-center pt-6">
      You are not following any user. Please use search bar to find an user
    </h1>
  </div>
  <Observer v-if="currentPosts.length" @intersect="fetchNextData" />
</template>
