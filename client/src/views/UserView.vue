<template>
    <main class="user">
        <section class="mx-auto split-color rounded-lg shadow-2xl ">
            <div class="border-b px-4 pb-6">
                <div class="text-center my-4">
                    <div class="flex flex-col items-center justify-center">
                        <div class="w-32 h-32 mb-6">
                            <img v-if="photoUrl" :src="photoUrl" alt="profilbilde" class="object-cover rounded-full w-full h-full border-4 border-white dark:border-gray-800" />
                        </div>
                        <form action="/api" method="post" enctype="multipart/form-data" class="upload-form mt-7">
                            <input id="file" name="file" type="file" class="file-input hidden" @change="handleFileInputChange" />
                            <label for="file" class="file-label inline-block darkblue hover:bg-blue-700
                             text-white font-bold py-2 px-4 rounded cursor-pointer">
                                <i class="fa-solid fa-upload"></i> Endre Bilde
                            </label>
                        </form>
                    </div>
                    <div class="py-2">
                        <h3 class="fond-bold text-3xl text-black mb-1">  {{ name ? name : "Justin Timberlake, er det deg?" }} </h3>
                        <div class="inline-flex text-gray-400 items center">
                            {{ email }}  
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <div class="flex items-center">
                    <p v-if="reviews.length > 0" class="text-black text-sm" >
                        Stolt eier av {{ reviews.length }} anmeldelser  <i class="fa-solid fa-heart fa-beat"></i>
                        
                    </p>
                    <p v-else class="text-black text-lg" >
                        Beholder sin mystiske aura med sine {{ reviews.length }} anmeldelser  🤔
                    </p>
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
import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as vueRef, onMounted } from 'vue';

import sanity from '../client';
import ReviewCard from '../components/ReviewCard.vue';

export default {
    components: {
        ReviewCard
    },

    setup() {
        // Reactive references
        const provider = vueRef(getAuth().currentUser.providerData[0].providerId);
        const photoUrl = vueRef(getAuth().currentUser.photoURL);
        const name = vueRef(getAuth().currentUser.displayName);
        const email = vueRef(getAuth().currentUser.email);
        const reviews = vueRef([]);

        // Fetch user reviews on component mount
        onMounted(() => {
            fetchUserReviews();
        });

        // Methods
        const fetchUserReviews = () => {
            const userId = getAuth().currentUser.uid;
            sanity.fetch(`*[_type == "review" && userId == $userId]`, { userId })
                .then((data) => {
                    reviews.value = data;
                }).catch((error) => {
                    console.error('Error fetching reviews:', error);
                });
        };

        const handleFileInputChange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                console.error('No file selected.');
                return;
            }
            const userId = getAuth().currentUser.uid;
            const storage = getStorage();
            const storageRef = firebaseRef(storage, 'users/' + userId + '/profilePicture.png');

            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');

                // Get the download URL and update user profile
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    updateUserProfile(downloadURL);
                });
            }).catch((error) => {
                console.error('Error uploading file:', error);
            });
        };

        const updateUserProfile = (photoURL) => {
            const user = getAuth().currentUser;
            updateProfile(user, { photoURL: photoURL })
                .then(() => {
                    console.log('Profile picture updated!');
                    photoUrl.value = photoURL;
                }).catch((error) => {
                    console.error('Error updating profile picture:', error);
                });
        };

        return {
            provider,
            photoUrl,
            name,
            email,
            reviews,
            handleFileInputChange,
            updateUserProfile
        };
    }
};
</script>

<style>
.fa-heart {
    color: #ff0000;

}
.split-color {
    background: linear-gradient(to bottom, #096191 50%, #f5f5f5 50%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>