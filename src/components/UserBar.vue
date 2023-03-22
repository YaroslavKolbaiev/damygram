<script setup>
import { defineProps, ref } from "vue";
import { useUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import usePhotoUpload from "../composables/usePhotoUpload";
import { useRoute } from "vue-router";
import UploadPhotoModal from "./UploadPhotoModal.vue";
import { supabase } from "../supabase";
const { currentUser, userInfo, addNewPost, isFollowing, updateIsFollowing } =
  defineProps([
    "currentUser",
    "userInfo",
    "addNewPost",
    "isFollowing",
    "updateIsFollowing",
  ]);

const route = useRoute();
const userStore = useUserStore();

const { showUploadForm, setShowUploadForm } = usePhotoUpload();

const { user } = storeToRefs(userStore);
const data = route.params;

const followUser = async () => {
  updateIsFollowing(true);
  await supabase.from("followers_following").insert({
    follower_id: user.value.id,
    following_id: currentUser.id,
  });
};

const unFollowUser = async () => {
  updateIsFollowing(false);
  await supabase
    .from("followers_following")
    .delete()
    .eq("follower_id", user.value.id)
    .eq("following_id", currentUser.id);
};
</script>

<template>
  <div class="flex justify-between">
    <div>
      <h1 class="text-3xl font-bold mb-2">{{ currentUser.username }}</h1>
      <div class="flex gap-4">
        <p class="font-semibold">{{ userInfo.posts }} posts</p>
        <p class="font-semibold">{{ userInfo.followers }} followers</p>
        <p class="font-semibold">{{ userInfo.following }} following</p>
      </div>
    </div>
    <div v-if="user">
      <button
        v-if="user.username === data.username"
        @click="setShowUploadForm(true)"
        type="button"
        class="text-white h-1/2 transition duration-200 ease bg-blue-700 hover:bg-blue-800 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Upload Photo
      </button>
      <div v-else>
        <button
          v-if="!isFollowing"
          @click="followUser"
          type="button"
          class="text-white h-1/2 transition duration-200 ease bg-blue-700 hover:bg-blue-800 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Follow
        </button>
        <button
          v-else
          @click="unFollowUser"
          type="button"
          class="text-white h-1/2 transition duration-200 ease bg-gray-600 hover:bg-gray-400 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 focus:outline-none"
        >
          Following
        </button>
      </div>
    </div>
  </div>
  <Transition name="fade">
    <UploadPhotoModal
      v-if="showUploadForm"
      :setShowUploadForm="setShowUploadForm"
      :addNewPost="addNewPost"
      :author="currentUser.username"
    />
  </Transition>
</template>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: all 1s ease;
}
.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: all 1s ease;
}
</style>
