import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMsg = ref("");
  const isLoading = ref(false);
  const isLoadingUser = ref(false);

  function validateEmail(value) {
    if (!value) {
      return "Email is required";
    }

    const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

    if (!emailPattern.test(value)) {
      return "Email is not valid";
    }
  }

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
  };

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    if (errors.email) {
      return (errorMsg.value = errors.email);
    }

    if (errors.password) {
      return (errorMsg.value = errors.password);
    }

    isLoading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      isLoading.value = false;
      return (errorMsg.value = error.message);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id,
    };

    isLoading.value = false;
  };

  const handleSignUp = async (credentials) => {
    const { email, password, username } = credentials;

    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    if (errors.password) {
      return (errorMsg.value = errors.password);
    }

    if (username.length < 4) {
      return (errorMsg.value =
        "Username length must be not less then 4 characters");
    }

    if (errors.email) {
      return (errorMsg.value = errors.email);
    }

    isLoading.value = true;

    const { data: userExists } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userExists) {
      isLoading.value = false;
      return (errorMsg.value = "User already exists");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      isLoading.value = false;
      return (errorMsg.value = error.message);
    }

    await supabase.from("users").insert({
      email,
      username,
    });

    user.value = {
      id: data.user.id,
      email,
      username,
    };

    isLoading.value = false;
  };

  const handleLogOut = async () => {
    await supabase.auth.signOut();
  };

  const getUser = async () => {
    isLoadingUser.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      isLoadingUser.value = false;
      return (user.value = null);
    }
    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id,
    };
    isLoadingUser.value = false;
  };

  return {
    user,
    isLoading,
    handleLogin,
    handleSignUp,
    handleLogOut,
    getUser,
    errorMsg,
    isLoadingUser,
  };
});
