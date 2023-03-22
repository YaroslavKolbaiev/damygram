<script setup>
import UserBar from "./UserBar.vue";
import Gallery from "./Gallery.vue";
import { ref, onMounted, watch, reactive } from "vue";
import { supabase } from "../supabase";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/users";
import PageLoading from "./PageLoading.vue";

const route = useRoute();
const userStore = useUserStore();
const { username } = route.params;
const isFollowing = ref(false);
const isLoading = ref(false);
const posts = ref([]);
const user = ref(null);
const { user: loggedUser } = storeToRefs(userStore);
const userInfo = reactive({
  posts: null,
  followers: null,
  following: null,
});

const addNewPost = (post) => {
  posts.value.unshift(post);
};

const updateIsFollowing = (follow) => {
  isFollowing.value = follow;
};

const fetchFollersCount = async () => {
  const { count } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("following_id", user.value.id);

  userInfo.followers = count;
};

const fetchFollowingCount = async () => {
  const { count } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("follower_id", user.value.id);
  userInfo.following = count;
};

const fetchFollowing = async () => {
  if (loggedUser.value && loggedUser.value.id !== user.value.id) {
    const res = await supabase
      .from("followers_following")
      .select()
      .eq("follower_id", loggedUser.value.id)
      .eq("following_id", user.value.id)
      .single();

    return res.data && (isFollowing.value = true);
  }
};

const fetchData = async () => {
  isLoading.value = true;
  const { data: userData } = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single();

  if (!userData) {
    isLoading.value = false;
    return (user.value = null);
  }

  user.value = userData;

  const { data: postData } = await supabase
    .from("posts")
    .select()
    .eq("owner_id", user.value.id);

  posts.value = postData;

  await fetchFollowing();

  await fetchFollersCount();

  await fetchFollowingCount();

  userInfo.posts = posts.value.length;

  isLoading.value = false;
};

watch(loggedUser, () => {
  fetchFollowing();
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container mx-auto px-12" v-if="!isLoading">
    <div v-if="user" class="mb-10">
      <UserBar
        :key="$route.params.username"
        :currentUser="user"
        :userInfo="userInfo"
        :addNewPost="addNewPost"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
      />
    </div>
    <div class="font-bold text-center text-2xl" v-else>User not found</div>
    <Gallery :posts="posts" />
  </div>
  <PageLoading v-else />
</template>
