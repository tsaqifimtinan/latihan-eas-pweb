<template>
    <div class="homepage-container">
        <div class="group-list-container">
            <div class="account-name-container">
                <div class="account-name">
                    <h1>{{ username }}</h1>
                </div>
                <div class="create-group-container" @click="showCreateGroup">
                    <img src="\src\assets\Create_Group.png">
                </div>
                <div class="logout-logo-container" @click="logout">
                    <img src="\src\assets\logout.png">
                </div>

            </div>
            <p> {{ userID }}</p>
            <div class="groupchat-container" v-for="group in groups" :key="group.id" @click="renderChats(group.id)">
                <h3>{{ group.groupName }}</h3>
                <p>{{ group.memberOne }}</p>
                <p>{{ group.memberTwo }}</p>
            </div>
        </div>
        <div class="chat-container">
            <div class="chat-room">
                <div :class="chat.senderID === userID ? 'chat-bubble-current-user' : 'chat-bubble'" v-for="chat in chats" :key="chat.id">
                    <div class="sender-container">
                        <p>{{ chat.senderUsername }}</p>
                    </div>
                    <div class="chat-content-container">
                        <p>{{ chat.content }}</p>
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <div class="chat-input-box-container">
                    <input id="input-box" type="text" placeholder="Type your message here..." v-model="message">
                </div>
                <div class="send-button-container" @click="sendMessage();">
                    <img src="\src\assets\noun-send-button.png">
                </div>
            </div>
        </div>

    </div>

    <div class="create-group-form-container" v-if="showCreateGroupForm">
        <div class="close-button" @click="hideCreateGroup">
            <button>X</button>
        </div>
        <div class="form-container">
            <input v-model="newGroupName" placeholder="Enter the receiver's name">
            <input v-model="receiverID" placeholder="Enter the receiver's ID">
            <button @click="createGroup">Create Group</button>
        </div>
    </div>

    <div class="join-group-form-container" v-if="showJoinGroupForm">
        <div class="close-button" @click="hideJoinGroup">
            <button>X</button>
        </div>
        <div class="form-container">
            <input v-model="groupIdToJoin" placeholder="Enter Group ID to Join">
            <button @click="joinGroup">Join Group</button>
        </div>
    </div>
</template>

<script>
import { store } from '../store';
import { useRouter } from 'vue-router';
import { ref, render, toRefs } from 'vue';
import { reactive } from 'vue';

const groups = ref([]);
const openedGroup = ref('');
const chats = ref([]);
const message = ref(null);
const sender = ref('');
const memberOne = ref('');
const memberTwo = ref('');

export default {

    methods: {
        async selectGroup(id) {
            openedGroup.value = id;
            // console.log(openedGroup.value);
        },
        async renderChats() {
            try {
                const answer = await fetch(`http://localhost:3000/api/groups/${openedGroup.value}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-type": 'application/json'
                    }
                });

                const res = await answer.json();
                const groups = res.docs;
                console.log(res);
                console.log(groups);
                // console.log(res.docs);

                const group = groups.find(group => group.id === openedGroup.value);

                if (group) {
                    if(store.userID === group.memberOne || store.userID === group.memberTwo) {
                        console.log('Access Granted');

                        const response = await fetch(`http://localhost:3000/api/chats?where[groupID][equals]=${openedGroup.value}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            "Content-Type": 'application/json'
                        }
                    });

                    const data = await response.json();

                    const chatsWithUsernames = await Promise.all(data.docs.map(async chat => {
                        const username = await this.getUsername(chat.senderID);
                        return {
                            ...chat,
                            senderUsername: username,
                        };
                    }));

                    this.chats = chatsWithUsernames;
                    }

                    else {
                        openedGroup.value = null;
                        window.alert('You do not have access to view this chat!');
                        chats.value = null;
                    }
                }

                else {
                    console.log('Group not found');
                    // Handle group not found
                }

            } catch (error) {
                console.log(error);
            }
        },
        async sendMessage() {
            try {
                const response = await fetch('http://localhost:3000/api/chats/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        groupID: openedGroup.value,
                        content: message.value,
                    })
                });

                this.renderChats();
                this.message = '';

            } catch (error) {
                console.log(error);
            }
        },

        async getUsername(id) {
            try {
                const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                //console.log(data);
                //console.log(data.username);
                return data.username;
            } catch (error) {
                console.log(error);
            }
        },
    },


    setup() {

        const groups = ref([]);
        const chats = ref([]);

        const router = useRouter();

        const showCreateGroupForm = ref(false);

        const showCreateGroup = () => {
            showCreateGroupForm.value = true;
        }

        const hideCreateGroup = () => {
            showCreateGroupForm.value = false;
        }

        const showJoinGroupForm = ref(false);

        const showJoinGroup = () => {
            showJoinGroupForm.value = true;
        }

        const hideJoinGroup = () => {
            showJoinGroupForm.value = false;
        }

        const logout = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/accounts/logout/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data = await response.json();

                openedGroup.value = '';
                router.push('/');
            } catch (error) {
                console.log(error);
        } 
        }

        const newGroupName = ref('');
        const receiverID = ref('');

        const createGroup = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/groups/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        groupName: store.username + " and " + newGroupName.value,
                        memberOne: store.userID,
                        memberTwo: receiverID.value
                    }),
                });

                const data = await response.json();

                //console.log(data);

                store.groups.push(data.doc);

                newGroupName.value = '';
                receiverID.value = '';

                showCreateGroupForm.value = false;
            } catch (error) {
                console.log(error);
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/groups', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
                });

                const data = await response.json();
                groups.value = data.docs;
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();

        const groupIdToJoin = ref('');

        const joinGroup = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/groups/${groupIdToJoin.value}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    header: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({
                        member: {
                            memberID: store.userID,
                        },
                    }),
                });

                const data = await response.json();

                //console.log(data);

                if(data.message === 'Updated successfully.') {
                    if(data.group) {
                        store.groups.push(data.group);
                    } else {
                        //console.log('data.group is undefined');
                    }
                } else {
                    alert('Failed to join group');
                }

                groupIdToJoin.value = '';
                showJoinGroupForm.value = false;
            } catch (error) {
                console.log(error);
            }
        }
        
        return {
            ...toRefs(store),
            logout,
            showCreateGroup,
            showCreateGroupForm,
            hideCreateGroup,
            newGroupName,
            receiverID,
            createGroup,
            showJoinGroup,
            showJoinGroupForm,
            hideJoinGroup,
            groups,
            groupIdToJoin,
            joinGroup,
            openedGroup,
            chats,
            message,
        };
    },
};
</script>

<style scoped>

* img:hover {
    cursor: pointer;
}

* {
    box-sizing: border-box;
}

h1, h3, p {
    color: black;
}
.homepage-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: rgb(20, 96, 20)
}

.group-list-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 440px;
    height: 100%;
    background-color: rgb(240, 240, 240);
    border-right: 1px solid black;
}

.account-name-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding-top: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid black;
}

.account-name {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 100%;
}

.create-group-container {
    display: flex;
    flex-direction: row;
    width: 60px;
    height: 100%;
}

.join-group-container {
    display: flex;
    flex-direction: row;
    width: 60px;
    height: 100%;
}

.create-group-container img {
    border-radius: 45px;
}

.logout-logo-container {
    display: flex;
    flex-direction: row;
    width: 60px;
    height: 100%;
}


.groupchat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    margin: 20px;
    margin-bottom: 0;
    background-color: white;
    border: 1px solid black;
    border-radius: 8px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
    transition: 0.2s;
}

.groupchat-container:hover {
    cursor: pointer;
    background-color: rgb(240, 240, 240);
}

.groupchat-container:active {
    background-color: rgb(158, 204, 144);
}

.chat-container {
    display: flex;
    flex-direction: column;
    flex: 5;
    height: 100vh;
    justify-content: start;
}

.chat-room {
    display: flex;
    flex-direction: column-reverse;
    height: 90vh;
    overflow: auto;
    padding: 20px;
    background-color: rgb(240, 240, 240);
}

.chat-bubble {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: 50%;
    height: max-content;
    border-radius: 20px;
    margin-top: 20px;
    align-self: flex-start;
    word-wrap: break-word;
    background-color: white;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
}

.chat-bubble p {
    margin-left: 18px;
    margin-right: 18px;
}

.chat-bubble-current-user {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: 50%;
    height: max-content;
    border-radius: 20px;
    margin-top: 20px;
    align-self: flex-end;
    word-wrap: break-word;
    background-color: rgb(158, 204, 144);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
}

.chat-bubble-current-user p {
    margin-left: 18px;
    margin-right: 18px;
}

.sender-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    height: max-content;
    border-bottom: 1px solid rgba(0, 0, 0, 0.75);
}

.chat-content-container {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    height: max-content;
    overflow-y: auto;
}

.chat-input-container {
    display: flex;
    flex-direction: row;
    height: 10vh;
}

.chat-input-box-container {
    display: flex;
    flex-direction: row;
    width: 90%;
    height: 100%;
}

.send-button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 10%;
    height: 100%;
    background-color: rgb(240, 240, 240);
    border-top: 1px solid black;
}

.chat-input-box-container input {
    width: 100%;
    height: 100%;
}
.create-group-form-container {
    z-index: 99;
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 50vw;
    height: 50vh;
    background-color: rgb(158, 204, 144);
}

.close-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    background-color: rgb(240, 240, 240);
    border: 1px solid rgba(0, 0, 0, 0.75);
}

.close-button button {
    width: 40px;
    height: 40px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 40px;
}

.form-container input {
    width: 80%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.75);
    border-radius: 8px;
    padding-left: 10px;
}

.form-container button {
    width: 20%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.75);
    border-radius: 8px;
    background-color: rgb(240, 240, 240);
    transition: 0.2s;
}
.join-group-form-container {
    z-index: 99;
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 50vw;
    height: 50vh;
}
</style>