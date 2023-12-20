<template>
    <div class="page-container">
      <div class="loginSign">
        <div class="signContainer">
          <h1>Welcome!</h1>
        </div>
      </div>
      <div class="login-container">
        <form @submit.prevent="handleSubmit" id="loginForm" class="form-container">
          <div class="email-container">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="email" name="email" />
          </div>
          <div class="password-container">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" name="password" />
          </div>
          <div class="login-button-container">
            <button type="submit">Login</button>
          </div>
        </form>
    
        <div class="toRegister">
        <button @click="showRegisterForm">Register</button>
      </div>
      </div>
    
    
    </div>
    
    <div class="register-container" v-if="showRegisterFormContainer">
      <div class="close-button">
        <button @click="hideRegisterForm">X</button>
      </div>
      <div class="register-headline">
        <h1>Account Registration</h1>
      </div>
      <div class="register-form-container">
        <form @submit.prevent="handleRegister" id="registerForm" class="register-form-container">
          <div class="username-container">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="usernameRegister" name="username" />
          </div>
    
          <div class="email-container">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="emailRegister" name="email" />
          </div>
          
          <div class="password-container">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="passwordRegister" name="password" />
          </div>
    
          <div class="register-button-container">
            <button type="submit">Register</button>
          </div>
    
        </form>
      </div>
    </div>
    </template>
    
    <script>
    import { useRouter } from "vue-router";
    import { provide, reactive, ref, toRefs } from "vue";
    import { store } from '../store'
    
    export default {
            setup() {
                const router = useRouter();
                
                const state = reactive({
                    email: '',
                    password: '',
                    usernameRegister: '',
                    emailRegister: '',
                    passwordRegister: '',
                });
    
                const handleSubmit = async () => {
                    try{
                        const response = await fetch('http://localhost:3000/api/accounts/login', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: state.email,
                                password: state.password,
                            }),
                        });
    
                        const data = await response.json();
    
                        if(data.message === 'Auth Passed') {
                            store.username = data.user.username;
                            store.userID = data.user.id;
                            router.push('/channel');
                        } else {
                            router.push('/');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
    
                const showRegisterFormContainer = ref(false);
    
                const showRegisterForm = () => {
                    showRegisterFormContainer.value = true;
                };
    
                const hideRegisterForm = () => {
                    showRegisterFormContainer.value = false;
                };
    
                const handleRegister = async () => {
                  try {
                    const response = await fetch('http://localhost:3000/api/accounts/' , {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        username: state.usernameRegister,
                        email: state.emailRegister,
                        password: state.passwordRegister,
                      }),
                    });
                    console.log(state.usernameRegister);
                    console.log(state.emailRegister);
                    console.log(state.passwordRegister);
                    const data = await response.json();
                    if(data.message === 'Account successfully created.') {
                      alert('Account successfully created. You can login using the created account.');
                      showRegisterFormContainer.value = false;
                    } else {
                      alert('Account creation failed. Please try again.');
                      state.usernameRegister = '';
                      state.emailRegister = '';
                      state.passwordRegister = '';
                    }
    
                    router.push('/');
                  } catch (error) {
                    console.log(error);
                  }
                } 
    
                return { ...toRefs(state), handleSubmit, showRegisterFormContainer, showRegisterForm, hideRegisterForm, handleRegister};
            },
        };
</script>
