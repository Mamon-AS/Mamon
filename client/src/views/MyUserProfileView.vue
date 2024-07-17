<template>
    <UserProfile 
        :photoUrl="photoUrl" 
        :name="name" 
        :reviews="reviews" 
        :isCurrentUser="true" 
        :handleFileInputChange="handleFileInputChange" 
        :optOutFeed="optOutFeed"
        />

    <div class="container mx-auto p-4">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <ReviewCard v-for="review in reviews" :key="review._id" :reviewItems="review" /> 
        </div>
    </div>

</template>

<script>
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { ref as vueRef, onMounted, computed } from 'vue';
import { useStore } from 'vuex'

import ReviewCard from '../components/Reviews/ReviewCard.vue';
import UserProfile from '../components/UserProfile.vue';

export default {
    components: {
        ReviewCard,
        UserProfile
    },

    setup() {
        const auth = getAuth();
        const defaultPhotoUrl = '/images/blank_profile.jpg';
        const photoUrl = vueRef(auth.currentUser?.photoURL || defaultPhotoUrl);
        const name = vueRef(auth.currentUser?.displayName);
        const store = useStore();

        const reviews = computed(() => store.getters['reviews/reviewItems']);
        
        onMounted(() => {
            fetchUserReviews();
        });

        // Methods
        const fetchUserReviews = () => {
            try {
                store.dispatch('reviews/FetchPersonalReviews', auth.currentUser.uid);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const handleFileInputChange = async (event) => {
            const file = event.target.files[0];
            if (!file) {
                console.error('No file selected.');
                return;
            }
            const userId = auth.currentUser.uid;
            const storage = getStorage();
            
            const fileRef = ref(storage, `users/${userId}/profilePicture.png`);

            try {
                const snapshot = await uploadBytes(fileRef, file);
                console.log('Uploaded a blob or file!');
                const downloadURL = await getDownloadURL(snapshot.ref);
                await updateUserProfile(downloadURL);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };

        const updateUserProfile = async (photoURL) => {
        try {
            await updateProfile(auth.currentUser, { photoURL });
            console.log('Profile picture updated!');
            photoUrl.value = photoURL;
        } catch (error) {
            console.error('Error updating profile picture:', error);
            }
        };

        return {
            photoUrl,
            name,
            handleFileInputChange,
            updateUserProfile,
            reviews
        };
    }
};
</script>