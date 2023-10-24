<template>
    <main class="user">
        <div class="name">
            <h1>{{ name ? name : "Justin Timberlake, er det deg?" }}</h1>
            <form @submit.prevent="editName">
                <input type="text" class="border rounded transition hidden w-0 opacity-0"> 
                <p v-if="editName.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{{ editName.error }}</p>
                <button type="submit" v-if="provider == 'password'" class="edit">Endre navn</button>
            </form>
        </div>

        <div class="photo">
            <img v-if="photoUrl" :src="photoUrl" alt="profilbilde" class="max-h-40 w-auto">
            <button class="edit" @click="editPhoto">{{ photoUrl ? "Endre" : "Legg til" }} bilde</button>
        </div>
        
        <div class="email">
            <p>E-post: {{ email }}</p>
            <button v-if="provider == 'password'" class="edit" @click="editEmail">Endre</button>
        </div>
        <button v-if="provider == 'password'" class="edit password" @click="editPassword">Endre passord</button>
    </main>
</template>

<script>
import { getAuth, updateProfile } from 'firebase/auth';

export default {
    setup() {
        const provider = getAuth().currentUser.providerData[0].providerId;
        const photoUrl = getAuth().currentUser.photoURL;
        const name = getAuth().currentUser.displayName;
        const email = getAuth().currentUser.email;
        const editName = (event) => {
            console.log("edit name dialog started");
            ['hidden', 'w-0', 'opacity-0'].map(className => 
                document.querySelector(".name input").classList.toggle(className)
            );
            let button = document.querySelector(".name button");
            let input = document.querySelector(".name input").value;
            if (button.innerHTML == "Endre navn") {
                button.innerHTML = "OK";
            } else {
                if (input =! '') {
                    updateProfile(getAuth().currentUser, {
                    displayName: input
                    }).then(() => {
                        console.log("name updated");
                        input = '';
                        ['hidden', 'w-0', 'opacity-0'].map(className => 
                            document.querySelector(".name input").classList.toggle(className)
                        );
                    }).catch((e) => {
                        editName.error = e.message;
                        console.log(e);
                    });
                    button.innerHTML = "Endre navn";
                } else {
                    editName.error = "Navn kan ikke være tomt";
                }
            }
        };
        const editPhoto = () => {
            console.log("edit photo dialog started");
        };
        const editEmail = () => {
            console.log("edit email dialog started");
        };
        const editPassword = () => {
            console.log("edit password dialog started");
        };
        return {
            provider,
            photoUrl,
            name,
            email,
            editName,
            editPhoto,
            editEmail,
            editPassword
        }
    },
    components: {
        
    }
};


</script>
<style scoped>
.edit {
  
}
</style>