<template>
    <main class="user">
        <section class="mx-auto split-color rounded-lg shadow-2xl">
            <div class="border-b px-4 pb-6">
                <div class="text-center my-3">
                    <div class="flex flex-col items-center justify-center">
                        <div class="w-32 h-32 mb-6">
                            <img v-if="photoUrl" :src="photoUrl" alt="profilbilde" class="object-cover rounded-full w-full h-full border-4 border-white dark:border-gray-800" />
                            <img v-else :src="defaultPhotoUrl" alt="profilbilde" class="object-cover rounded-full w-full h-full border-4 border-white dark:border-gray-800" /> 
                          </div>
                        <form v-if="isCurrentUser" action="/api" method="post" enctype="multipart/form-data" class="upload-form mt-7">
                            <input id="file" name="file" type="file" class="file-input hidden" @change="handleFileInputChange" />
                            <label for="file" class="file-label inline-block darkblue hover:bg-blue-700
                             text-white font-bold py-2 px-4 rounded cursor-pointer">
                                <i class="fa-solid fa-upload"></i> Endre Bilde
                            </label>
                        </form>
                        <button v-if="!isCurrentUser" @click="toggleFollow" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4
                        focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5  mb-7 
                            text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">   {{ isFollowing ? 'Slutt å følge' : 'Følg' }}
                        </button>                     
                    </div>
                    <div class="py-2 mt-5">
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
                        Stolt eier av {{ reviews.length }} anmeldelser og {{ followerCount }} følgere <i class="fa-solid fa-heart fa-beat"></i>
                    </p>
                    <p v-else class="text-black text-lg" >
                        Beholder sin mystiske aura med sine {{ reviews.length }} anmeldelser  🤔
                    </p>
                </div>
            </div> 

        </section>
    </main>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth } from 'firebase/auth';
import { doc, setDoc , getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from "../firebaseInit";

export default {
  props: {
    userId: String,
    photoUrl: String,
    name: String,
    email: String,
    reviews: {
      type: Array,
        default: () => []
    },
    isCurrentUser: {
      type: Boolean,
      default: false
    },
    handleFileInputChange: Function,
    updateUserProfile: Function
  },
  setup(props) {
    const followerCount = ref(0);
    const isFollowing = ref(false);

    const getFollowerCount = async (userId) => {
      const followersRef = collection(db, `users/${userId}/followers`);
      const querySnapshot = await getDocs(followersRef);
      followerCount.value = querySnapshot.size;
    };

    const checkFollowingStatus = async (currentUserId, targetUserId) => {
      const followingDocRef = doc(db, `users/${currentUserId}/following/${targetUserId}`);
      const docSnap = await getDoc(followingDocRef);
      isFollowing.value = docSnap.exists();
    };

    const toggleFollow = async () => {
      const currentUserId = getAuth().currentUser?.uid;
      if (!currentUserId) {
        console.error("No authenticated user found!");
        return;
      }

      const targetUserId = props.userId;
      
      const followingRef = doc(db, `users/${currentUserId}/following/${targetUserId}`);
      const followersRef = doc(db, `users/${targetUserId}/followers/${currentUserId}`);

      if (isFollowing.value) {
        // unfollow
        await deleteDoc(followingRef);
        // update the followers list of the target user
         await deleteDoc(followersRef);
      } else {
        // follow logic
        await setDoc(followingRef, { userId: targetUserId, createdAt: serverTimestamp() });
        // update the followers list of the target user
         await setDoc(followersRef, { userId: currentUserId, createdAt: serverTimestamp() });
      }

      // refresh the states
      await getFollowerCount(props.userId);
      await checkFollowingStatus(currentUserId, targetUserId);
    };
    
    onMounted(async () => {
      console.log(props.photoUrl)
      const auth = getAuth();
      const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
      if (currentUserId && props.userId) {
        await getFollowerCount(props.userId);
        await checkFollowingStatus(currentUserId, props.userId);
      }
    });

    return { followerCount, isFollowing, toggleFollow };
  },
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