<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, watch } from "vue";
import Modal from "./AuthModal.vue";
import useModal from "../composables/useModal";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/users";
import { supabase } from "../supabase";

const userStore = useUserStore();
const { user, isLoadingUser } = storeToRefs(userStore);
const router = useRouter();
const searchUser = ref("");
const usersFound = ref([]);
const isLogin = ref(true);
const { isModal, setIsModal } = useModal();

const onlogOut = async () => {
  await userStore.handleLogOut();
  user.value = null;
};

const searchHandler = () => {
  if (searchUser.value) {
    router.push(`/profile/${searchUser.value}`);
    searchUser.value = "";
  }
};

watch(searchUser, async () => {
  if (searchUser.value === "") {
    usersFound.value = [];
    return;
  }
  const { data } = await supabase
    .from("users")
    .select()
    .ilike("username", `%${searchUser.value}%`)
    .limit(5);

  usersFound.value = data;
});
</script>

<template>
  <div class="border-b-2 border-b-slate-200 py-6 mb-4">
    <div
      class="container mx-auto px-12 flex gap-4 flex-col md:flex-row justify-between items-center h-full"
    >
      <RouterLink class="font-bold text-lg font-mono" to="/">
        Dummygram
      </RouterLink>
      <div class="flex relative">
        <input
          @keyup.enter="searchHandler"
          v-model="searchUser"
          class="bg-gray-50 border border-gray-300 p-2 text-gray-600 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
          type="text"
          placeholder="search users"
        />
        <button
          @click="searchHandler"
          class="bg-blue-700 text-white rounded-r-lg p-2 cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </button>
        <div
          v-if="searchUser.length"
          class="bg-slate-300 rounded-lg w-full z-40 absolute top-12 left-0"
        >
          <RouterLink
            class="block p-2 border-b last:border-b-0 font-semibold hover:text-blue-600 transition duration-200 ease dark:text-gray-700"
            @click="searchUser = ''"
            v-for="foundUser in usersFound"
            :to="`/profile/${foundUser.username}`"
            >{{ foundUser.username }}</RouterLink
          >
        </div>
      </div>
      <div :class="isLoadingUser && 'opacity-0'">
        <div v-if="!user" class="flex gap-2">
          <button
            @click="setIsModal(true), (isLogin = false)"
            type="button"
            class="text-white transition duration-200 ease bg-blue-700 hover:bg-blue-800 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            SignUp
          </button>
          <button
            @click="setIsModal(true), (isLogin = true)"
            type="button"
            class="text-white transition duration-200 ease bg-blue-700 hover:bg-blue-800 active:scale-95 active:transition-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </button>
        </div>
        <div v-else class="flex gap-4">
          <RouterLink
            :to="`/profile/${user.username}`"
            class="text-2xl text-slate-500 hover:scale-110 transition duration-200 ease"
          >
            <font-awesome-icon icon="fa-solid fa-circle-user" />
          </RouterLink>
          <button
            @click="onlogOut"
            class="text-2xl text-slate-500 hover:scale-110 transition duration-200 ease"
          >
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </div>
    </div>
    <Modal :setIsModal="setIsModal" :isLogin="isLogin" v-if="isModal" />
  </div>
</template>
