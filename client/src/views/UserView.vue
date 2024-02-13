<template>
    <UserProfile 
        :photoUrl="photoUrl" 
        :name="name" 
        :reviews="reviews" 
        :isCurrentUser="true" 
        :handleFileInputChange="handleFileInputChange" 
        :updateUserProfile="updateUserProfile"
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
import { ref as vueRef, onMounted } from 'vue';

import sanity from '../client';
import ReviewCard from '../components/ReviewCard.vue';
import UserProfile from '../components/UserProfile.vue';

export default {
    components: {
        ReviewCard,
        UserProfile
    },

    setup() {
        const auth = getAuth();
        const provider = vueRef(auth.currentUser.providerData[0].providerId);
        const defaultPhotoUrl = '/images/frosk.png';
        const photoUrl = vueRef(auth.currentUser?.photoURL || defaultPhotoUrl);
        const name = vueRef(auth.currentUser?.displayName);
        const reviews = vueRef([]);




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
            provider,
            photoUrl,
            name,
            reviews,
            handleFileInputChange,
            updateUserProfile,
        };
    }
};
</script>
