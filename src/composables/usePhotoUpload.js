import { ref } from "vue";
export default function () {
  const showUploadForm = ref(false);

  const setShowUploadForm = (value) => {
    showUploadForm.value = value;
  };

  return {
    showUploadForm,
    setShowUploadForm,
  };
}
