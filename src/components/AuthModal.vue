<script setup>
import { defineProps, reactive, watch, ref } from "vue";
import { useUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import Spinner from "./Spinner.vue";
const { setIsModal, isLogin } = defineProps(["setIsModal", "isLogin"]);
const userStore = useUserStore();

const { errorMsg, isLoading, user } = storeToRefs(userStore);

const userCredentials = reactive({
  email: "",
  password: "",
  username: "",
});

const onSignUp = async () => {
  await userStore.handleSignUp(userCredentials);
  if (user.value) {
    setIsModal(false);
  }
};

const onLogin = async () => {
  await userStore.handleLogin({
    email: userCredentials.email,
    password: userCredentials.password,
  });
  if (user.value) {
    setIsModal(false);
  }
};

const onCancel = () => {
  errorMsg.value = "";
  setIsModal(false);
};

watch(userCredentials, () => {
  errorMsg.value = "";
});
</script>

<template>
  <main>
    <div
      id="defaultModal"
      class="bg-slate-200 opacity-70 fixed top-0 left-0 right-0 z-20 h-screen p-4"
    ></div>
    <div class="flex justify-center fixed top-0 left-0 right-0 z-30 pt-16">
      <div class="bg-white max-w-md grow shadow dark:bg-gray-700">
        <div class="flex justify-between p-4 border-b border-b-stone-400">
          <h1 class="font-semibold">{{ isLogin ? "Login" : "SignUp" }}</h1>
          <button @click="setIsModal(false)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="p-4">
          <input
            v-if="!isLogin"
            v-model="userCredentials.username"
            type="text"
            class="bg-gray-50 outline-none mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="username"
          />
          <input
            v-model="userCredentials.email"
            type="email"
            class="bg-gray-50 border outline-none mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="email"
          />
          <input
            v-model="userCredentials.password"
            type="password"
            class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="password"
          />
        </div>
        <p v-if="errorMsg" class="text-red-600 text-center">{{ errorMsg }}</p>
        <div class="border-t border-t-stone-400 p-4 flex justify-end gap-2">
          <button
            @click="onCancel"
            class="border border-gray-400 rounded-sm active:scale-95 px-4 text-sm py-1"
          >
            Cancel
          </button>
          <button
            v-if="isLogin"
            @click="onLogin"
            class="text-white w-20 border border-blue-700 transition duration-200 ease bg-blue-700 active:scale-95 active:transition-none font-medium rounded-sm text-sm py-1 px-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <Spinner v-if="isLoading" />
            <p v-else>Login</p>
          </button>
          <button
            v-else
            @click="onSignUp"
            class="text-white w-20 border border-blue-700 transition duration-200 ease bg-blue-700 active:scale-95 active:transition-none font-medium rounded-sm text-sm py-1 px-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <Spinner v-if="isLoading" />
            <p v-else>Submit</p>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
