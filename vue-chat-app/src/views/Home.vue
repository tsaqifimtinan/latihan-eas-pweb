<template>
    Home

    <a href="/login">
        <button>Login</button>
    </a>
    <a href="/channel">
        <button>Channels</button>
    </a>
    
</template>

<script>
export default {
    name: 'Chat',
    data() {
        return {
            newMessage: '',
            messages: [
                { id: 1, user: 'User1', text: 'Hello!' },
                { id: 2, user: 'User2', text: 'Hi!' },
                // Add more messages here
            ],
        }
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() !== '') {
                this.messages.push({
                    id: this.messages.length + 1,
                    user: 'User1', // Replace this with the actual user
                    text: this.newMessage.trim(),
                });
                this.newMessage = '';
            }
        },
    },
}
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.chat-header {
    padding: 10px;
    background: #f5f5f5;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

.chat-input {
    padding: 10px;
    background: #f5f5f5;
}

.chat-input input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>