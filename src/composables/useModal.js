import { ref } from "vue";
export default function () {
  const isModal = ref(false);

  const setIsModal = (value) => {
    isModal.value = value;
  };

  return {
    isModal,
    setIsModal,
  };
}
