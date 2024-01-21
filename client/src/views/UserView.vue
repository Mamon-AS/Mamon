<template>
    <main class="user">
        <section class="name container mx-auto p-4">
            <div class="photo darkblue rounded-lg p-4 flex flex-col sm:flex-row mb-4">
                <img v-if="photoUrl" :src="photoUrl" alt="profilbilde"  class="block w-full sm:max-w-xs mr-4 
        object-cover mb-4 sm:mb-0" /> 
                    <form @submit.prevent="editPhoto">
                        <input class="transition hidden w-0 opacity-0" type="file" name="profile">
                        <!-- <button type="submit" class="hover:text-underline">Endre bilde</button> -->
                    </form>
                    <div class="flex-1 flex flex-col">
                        <h3 class="text-lg md:text-2xl font-bold mb-4">  {{ name ? name : "Justin Timberlake, er det deg?" }} </h3>
                        <p class="text-white md:text-lg mb-4 flex-1">
                            {{ email }}
                        </p>
                        <div class="flex sm:flex-col md:flex-row justify-between items-start md:items-end">
                            <div class="flex items-center sm:mb-4 md:mb-0">
                                <p v-if="reviews.length > 0" class="text-white text-sm" >
                                    Stolt eier av {{ reviews.length }} anmeldelser  <i class="fa-solid fa-heart fa-beat"></i>
                                </p>
                                <p v-else class="text-white text-sm" >
                                    Beholder sin mystiske aura med sine {{ reviews.length }} anmeldelser  🤔
                                </p>
                            </div>
                        </div>
                    </div>
            </div>
    </section>
    
        <div class="container mx-auto p-4">
            <div class="md:grid md:grid-cols-3 md:gap-4">
                <ReviewCard v-for="review in reviews" :key="review._id" :reviewItems="review" /> 
            </div>
    
        </div>
    </main>
</template>

<script>
import { getAuth, updateProfile } from 'firebase/auth';

import sanity from '../client';
import ReviewCard from '../components/ReviewCard.vue'

export default {
    components: {
        ReviewCard
    },

    setup() {
        const provider = getAuth().currentUser.providerData[0].providerId;
        const photoUrl = getAuth().currentUser.photoURL;
        console.log(photoUrl)
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

        return {
            provider,
            photoUrl,
            name,
            email,
            editName,
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
<style>
.fa-heart {
    color: #ff0000;

}
</style>