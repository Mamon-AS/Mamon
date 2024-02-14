<template>
  <main class="flex justify-center items-center min-h-screen-43">
    <section class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div class="text-center">
        <img v-if="photoUrl" :src="photoUrl" alt="profile" class="object-cover rounded-full  w-32 h-32 mx-auto mb-4 border-2 border-gray-300" />
        <h3 class="text-xl text-gray-900" v-if="name">{{ name }}</h3>
        <router-link :to="{ name: 'followers', params: { userId: internalUserId } }"> 
          <p class="text-gray-400 items center cursor-pointer text-decoration-line: underline">
            {{ followerCount }} følgere
          </p>
        </router-link>
        <div>
        <!-- Display Bio with Edit Icon -->
        <div class="flex items-center justify-center">
          <p class="text-center text-gray-600 mt-4">{{ bio }}</p>
          <button v-if="isCurrentUser" @click="showEditModal = true" class="ml-2">
            <i class="fa fa-pencil" aria-hidden="true"></i> 
          </button>
        </div>

        <!-- Edit Bio Modal -->
        <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Modal overlay, show/hide based on modal state. -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
  
      <!-- Modal content -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div class="bg-white p-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Rediger Bio
                  </h3>
                  <div class="mt-2">
                    <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="editableBio" placeholder="Skriv noe om deg selv..."></textarea>
                  </div>
                </div>
              </div>
            </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button @click="saveBio(editableBio), showEditModal=false" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Lagre
                </button>
                <button @click="showEditModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div class="mt-4">
          <form v-if="isCurrentUser" method="post" enctype="multipart/form-data" class="upload-form mt-7">
            <input id="file" name="file" type="file" class="file-input hidden" @change="handleFileInputChange" />
            <label for="file" class="file-label inline-block darkblue hover:bg-blue-700
              text-white font-bold py-2 px-4 rounded cursor-pointer">
                <i class="fa-solid fa-upload"></i> Endre Bilde
            </label>
        </form>
          <button v-if="!isCurrentUser" @click="toggleFollow" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4
          focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5  lg:mb-7
              text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">   {{ isFollowing ? 'Følger' : 'Følg' }}
          </button>    
        </div>
      </div>
      <p v-if="reviews.length > 0" class="text-center text-gray-600 mt-4">{{ reviews.length }} anmeldelser  <i class="fa-solid fa-heart fa-beat"></i></p>
    </section>
  </main>
</template>


<script>
import { ref, onMounted, watchEffect } from "vue";
import { getAuth } from 'firebase/auth';
import { doc, setDoc , getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from "../firebaseInit";

export default {
  props: {
    userId: String,
    photoUrl: String,
    name: String,
    updatedBio: String,
    reviews: {
      type: Array,
        default: () => []
    },
    isCurrentUser: {
      type: Boolean,
      default: false
    },
    handleFileInputChange: Function,
    updateUserProfile: Function,
    
  },
  setup(props) {
    const followerCount = ref(0);
    const isFollowing = ref(false);
    const bio = ref('');
    const showEditModal = ref(false);
    let internalUserId = ref('')

    const initializeUserId = () => {
      const authUserId = getAuth().currentUser?.uid;
      internalUserId.value = props.userId || authUserId;
    };

    initializeUserId();
    watchEffect(() => {
      initializeUserId();
    });
    // Methods && functions
    const toggleFollow = async () => {
      const currentUserId = getAuth().currentUser?.uid;
      if (!currentUserId) {
        console.error("No authenticated user found!");
        return;
      }

      const targetUserId = props.userId;
      const targetName = props.name
      const myName = getAuth().currentUser.displayName;
      
      const followingRef = doc(db, `users/${currentUserId}/following/${targetUserId}`);
      const followersRef = doc(db, `users/${targetUserId}/followers/${currentUserId}`);

      if (isFollowing.value) {
        // unfollow
        await deleteDoc(followingRef);
        // update the followers list of the target user
        await deleteDoc(followersRef);
      } else {
        // follow logic
        await setDoc(followingRef, { userId: targetUserId, name:targetName, createdAt: serverTimestamp() });
        // update the followers list of the target user
        await setDoc(followersRef, { userId: currentUserId, name: myName, createdAt: serverTimestamp() });
      }

      // refresh the states
      await getFollowerCount(props.userId);
      await checkFollowingStatus(currentUserId, targetUserId);
    };
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
    const saveBio = async (bioText) => {
      const userId = getAuth().currentUser.uid;
      const bioDocRef = doc(db, 'users', userId);    
      try {
        await setDoc(bioDocRef, { bio: bioText }, { merge: true });
        bio.value = bioText; 
        showEditModal.value = false; 
        console.log('Bio updated successfully in Firestore');
      } catch (error) {
        console.error("Error updating bio:", error);
      }
    };
    const fetchBio = async (userId) => {
    const bioDocRef = doc(db, 'users', userId.value);

    try {
      const docSnap = await getDoc(bioDocRef);
      if (docSnap.exists()) {
        bio.value = docSnap.data().bio;
        } else {
          console.log("No bio found.");
          bio.value = "Ingen bio funnet";
        }
      } catch (error) {
        console.error("Error fetching bio:", error);
      }
    };



onMounted(async () => {
      const auth = getAuth();
      const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
      // Because I can visit my own profile without a userId prop, I need to check if the prop is empty
      if (!internalUserId.value) { 
        internalUserId.value = currentUserId; 
      }

      if (currentUserId || internalUserId.value) {
        await getFollowerCount(internalUserId.value); 
        await checkFollowingStatus(currentUserId, internalUserId.value); 
        await fetchBio(internalUserId); 
      }
    });

    return { followerCount, isFollowing, toggleFollow, showEditModal, bio, saveBio, internalUserId };
  },
};
</script>

<style>
.fa-heart {
    color: #ff0000;
}

</style>