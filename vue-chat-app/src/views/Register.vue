<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const register = async () => {
    try {
        const req = await fetch('http://localhost:3000/api/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            }),
        })
        if (!req.ok) {
            throw new Error(`HTTP error! status: ${req.status}`);
        }
        const data = await req.json();
        message.value = 'Register successful';
        router.push('/login'); 
    } catch (err) {
        console.log(err);
        message.value = err.message;
    }
}
</script>

<template>
    Register
    <form @submit.prevent="register">
        <input type="text" placeholder="Username" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <button type="submit">Register</button>
    </form>
    <p>{{ message }}</p>
</template>