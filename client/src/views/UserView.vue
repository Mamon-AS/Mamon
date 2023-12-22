<template>
    <main class="user">
        <div class="name">
            <h1 class="text-2xl text-bold">{{ name ? name : "Justin Timberlake, er det deg?" }}</h1>
            <form @submit.prevent="editName">
                <input type="text" class="border rounded transition hidden w-0 opacity-0"> 
                <p v-if="editName.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{{ editName.error }}</p>
                <button type="submit" v-if="provider == 'password'" class="hover:text-underline">Endre navn</button>
            </form>
        </div>

        <div class="photo">
            <img v-if="photoUrl" :src="photoUrl" alt="profilbilde" class="max-h-40 w-auto">
            <form @submit.prevent="editPhoto">
                <input class="transition hidden w-0 opacity-0" type="file" name="profile">
                <button type="submit" class="hover:text-underline">Endre bilde</button>
            </form>
        </div>
        
        <div class="email">
            <p>E-post: {{ email }}</p>
            <form @submit.prevent="editEmail">
                <input type="text" class="border rounded transition hidden w-0 opacity-0"> 
                <p v-if="editEmail.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{{ editEmail.error }}</p>
                <button v-if="provider == 'password'" class="hover:text-underline">Endre e-post</button>
            </form>
        </div>

        <div class="reviews">
            <h2 class="text-xl font-bold">Mine anmeldelser</h2>
            <ul>
            <li v-for="review in reviews" :key="review._id">
                {{ review.reviewedItem }} - {{ review.rating }} stjerner
            </li>
            </ul>
        </div>

        <form @submit.prevent="editPassword">
            <input type="text" class="border rounded transition hidden w-0 opacity-0"> 
            <p v-if="editPassword.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{{ editPassword.error }}</p>
            <button v-if="provider == 'password'" class="hover:text-underline password">Endre passord</button>
        </form>
    </main>
</template>

<script>
import { getAuth, updateProfile } from 'firebase/auth';

import sanity from '../client';

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
            console.log('input: ' + input);
            console.log(typeof input);
            if (button.innerHTML == "Endre navn") {
                button.innerHTML = "OK";
            } else {
                if (input =! '') {
                    updateProfile(getAuth().currentUser, {
                        displayName: input,
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
            alert("edit photo dialog started");
        };
        const editEmail = () => {
            alert("edit email dialog started");
        };
        const editPassword = () => {
            alert("edit password dialog started");
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

    data() {
        return {
            reviews: [],
        }
    },

    created() {
        this.fetchUserReviews();
    },

    methods: {
    fetchUserReviews() {
        const userId = getAuth().currentUser.uid;

        sanity.fetch(
        `*[_type == "review" && userId == $userId]`,
        { userId }
        ).then((data) => {
        this.reviews = data;
        }).catch((error) => {
        console.error('Error fetching reviews:', error);
        });
    },
    },
};


</script>