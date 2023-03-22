<script setup>
import { defineProps, ref } from "vue";
import { supabase } from "../supabase";
import { uuid } from "vue-uuid";
import { useUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import Spinner from "./Spinner.vue";

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const { setShowUploadForm, addNewPost, author } = defineProps([
  "setShowUploadForm",
  "addNewPost",
  "author",
]);

const isLoading = ref(false);
const errorMsg = ref("");

const caption = ref("");
const file = ref(null);

const handleCancel = () => {
  caption.value = "";
  file.value = null;
};

const handleSubmit = async () => {
  isLoading.value = true;
  const fileName = uuid.v4();
  if (!file.value) {
    isLoading.value = false;
    return (errorMsg.value = "Please provide your image");
  }
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`public/${fileName}`, file.value);

  if (error) {
    isLoading.value = false;
    return (errorMsg.value = "Unable to upload an image");
  }

  if (data) {
    const res = await supabase.from("posts").insert({
      url: data.path,
      caption: caption.value,
      owner_id: user.value.id,
      author: author,
    });
  }
  isLoading.value = false;
  setShowUploadForm(false);
  addNewPost({
    url: data.path,
    caption: caption.value,
  });
};

const handleUpload = async (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0];
  }
};
</script>

<template>
  <main
    class="bg-slate-200 bg-opacity-70 fixed top-0 left-0 right-0 z-20 h-screen"
  >
    <div class="flex justify-center absolute top-0 left-0 right-0 z-30 pt-16">
      <div class="bg-white max-w-md grow shadow dark:bg-gray-700">
        <div class="flex justify-between p-4 border-b border-b-stone-400">
          <h1 class="font-semibold">Upload Photo</h1>
          <button @click="setShowUploadForm(false)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="px-4 py-8">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="file_input"
            >Upload file
          </label>
          <input
            class="block w-full text-sm border mb-2 border-gray-200 rounded-lg cursor-pointer bg-gray-50 file:border-0 file:cursor-pointer file:bg-gray-300 file:mr-4 file:p-2"
            id="file_input"
            type="file"
            accept="image/*"
            @change="handleUpload"
          />
          <input
            v-model="caption"
            type="text"
            class="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            placeholder="Caption..."
            :maxlength="50"
          />
        </div>
        <p v-if="errorMsg" class="text-red-600 text-center">{{ errorMsg }}</p>
        <div class="border-t border-t-stone-400 p-4 flex justify-end gap-2">
          <button
            @click="handleCancel"
            class="border border-gray-400 rounded-sm active:scale-95 px-4 text-sm py-1"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
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
