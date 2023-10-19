<template>
    <main class="user">
        <div class="name">
            <h1>{{ name ? name : "Justin Timberlake, er det deg?" }}</h1>
            <input type="text" class="border rounded transition hidden w-0 opacity-0"> 
            <button v-if="provider == 'password'" class="edit" @click="editName">Endre navn</button>
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
        const editName = () => {
            console.log("edit name dialog started");
            ['hidden', 'w-0', 'opacity-0'].map(className => 
                document.querySelector(".name input").classList.toggle(className)
            );
            let button = document.querySelector(".name button");
            let input = document.querySelector(".name input").value;
            if (button.innerHTML == "Endre navn") {
                button.innerHTML = "OK";
            } else {
                while (input =! '') {
                    button.innerHTML = "Endre";
                    console.log(input);
                    if (!input || !input.match(/^[\wæøå ]+/) ) {
                        alert("Navnet ditt kan ikke være tomt eller inneholde tall eller spesialtegn");
                        button.innerHTML = "Endre";
                        break;
                    }
                    updateProfile(getAuth().currentUser, {
                    displayName: input
                    }).then(() => {
                        console.log("name updated");
                    }).catch((error) => {
                        console.log(error);
                    });
                    input = '';
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