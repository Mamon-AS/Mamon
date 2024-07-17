<template>
  <main class="flex justify-center items-center min-h-screen-43 mt-7">
    <section class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div class="text-center">
         <div v-if="isLoading" role="status" class="flex justify-center mt-7">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-red-500">{{ error }}</p>
      </div>
      
      <div v-else>
        <followRequestAction v-if="acceptOrDeclineFollowRequest" :name="name" :requesterId="userId" :receiverId="currentUserId" :followRequestId="acceptOrDeclineFollowRequest.id" />
        <span class="sr-only">Loading...</span>
   
        <img v-if="photoUrl" :src="photoUrl" alt="profile" class="object-cover rounded-full  w-32 h-32 mx-auto mb-4 border-2 border-gray-300" />
        <h3 class="text-xl text-gray-900" v-if="name">{{ name }}</h3>

        <!-- REVIEWS, FOLLOWERS, FOLLOWING -->
        <div class="mt-2 mb-2 flex justify-center gap-4">
          <div class="text-center">
            <span class="block text-xl font-semibold">{{ reviews.length }}</span>
            <span class="text-gray-400">anmeldelser</span>
          </div>
          <router-link :to="{ name: 'followers', params: { userId: internalUserId, action:'followers' } }" class="text-center">
            <span class="block text-xl font-semibold">{{ followerCount }}</span>
            <span class="text-gray-400">følgere</span>
          </router-link>
          <router-link :to="{ name: 'followers', params: { userId: internalUserId, action:'following'} }" class="text-center">
            <span class="block text-xl font-semibold">{{ followingCount }}</span>
            <span class="text-gray-400">følger</span>
          </router-link>
        </div>
 
      
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
            <label for="file" class="file-label inline-block bg-mamonblue hover:bg-blue-700
              text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
                <i class="fa-solid fa-upload"></i> Endre Bilde
            </label>
        </form>

        <button v-if="!isFollowing && !pendingFollowRequest && !loading && !isCurrentUser" @click="toggleFollow(name)" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 lg:mb-7 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Følg
        </button>
        <button v-else-if="!loading && pendingFollowRequest" class="text-white bg-gray-500 font-medium rounded-full text-sm px-5 py-2.5 lg:mb-7 text-center mb-2" disabled>
          Forespørsel sendt
        </button>
        <button v-if="isFollowing && !pendingFollowRequest && !loading && !isCurrentUser" @click="toggleUnfollow" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 lg:mb-7 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Følger
        </button>

        </div>
      </div>
      </div>

    </section>
  </main>
</template>


<script>
import { ref, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { getAuth } from 'firebase/auth';
import { doc, setDoc , getDoc, onSnapshot, collection  } from 'firebase/firestore';
import { useStore } from "vuex";

import { db } from "../firebaseInit";
import followRequestAction from "./FollowRequestAction.vue";

export default {
  components: {
    followRequestAction
  },
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
    optOutFeed: Function
    
  },
  setup(props) {
    const store = useStore();
    const isLoading = computed(() => store.state.users.isLoading);
    const followerCount = ref(0);
    const followingCount = ref(0);
    const isFollowing = ref(false);
    const bio = ref('');
    const showEditModal = ref(false);
    const currentUserId = getAuth().currentUser?.uid;
    let internalUserId = ref('')
    const initializeUserId = () => {
      const authUserId = getAuth().currentUser?.uid;
      internalUserId.value = props.userId || authUserId;
    };
    let unsubscribeFollowers, unsubscribeFollowing, unsubscribeFollowingStatus;

    initializeUserId();
    watchEffect(() => {
      initializeUserId();
    });
    console.log(props.name);
    // Methods && functions
    const pendingFollowRequest = computed(() => {
      return store.state.following.followRequests.some(req => 
        req.senderId === currentUserId && 
        req.receiverId === props.userId && 
        req.status === 'pending'
      );
    });
    const acceptOrDeclineFollowRequest = computed(() => {
      return store.getters['following/specificFollowRequestFromMe'](currentUserId, props.userId);  
    });
    
    const loading = computed(() => store.state.following.loading);

    const toggleFollow = async (name) => {
      if (!currentUserId) {
        console.error("No authenticated user found!");
        return;
      }
      
      store.dispatch('following/sendFollowRequest', {
        currentUserId,
        targetUserId: internalUserId.value,
        displayName: name, 
        });
 
    };

    const toggleUnfollow = async () => {
      if (!currentUserId) {
        console.error("No authenticated user found!");
        return;
      }
      store.dispatch('following/unfollowUser', {
        currentUserId,
        targetUserId: internalUserId.value
      });
    };

    const getFollowerCount = (userId) => {
      const followersRef = collection(db, `users/${userId}/followers`);
      unsubscribeFollowers = onSnapshot(followersRef, (querySnapshot) => {
        followerCount.value = querySnapshot.size;
      });
    };

    const getFollowingCount = (userId) => {
      const followingRef = collection(db, `users/${userId}/following`);
      unsubscribeFollowing = onSnapshot(followingRef, (querySnapshot) => {
        followingCount.value = querySnapshot.size;
      });
    };

    const checkFollowingStatus = (currentUserId, targetUserId) => {
      const followingDocRef = doc(db, `users/${currentUserId}/following/${targetUserId}`);
      unsubscribeFollowingStatus = onSnapshot(followingDocRef, (docSnap) => {
        isFollowing.value = docSnap.exists();
      });
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
        await Promise.all([
          getFollowerCount(internalUserId.value),
          getFollowingCount(internalUserId.value),
          checkFollowingStatus(currentUserId, internalUserId.value),
          fetchBio(internalUserId),
          store.dispatch('following/fetchFollowRequests', currentUserId)
        ]);

      }

    });

    onUnmounted(() => {
      if (unsubscribeFollowers) unsubscribeFollowers();
      if (unsubscribeFollowing) unsubscribeFollowing();
      if (unsubscribeFollowingStatus) unsubscribeFollowingStatus();
    });

    return { 
      isLoading,
      followerCount,
      followingCount,
      isFollowing,
      toggleFollow, 
      showEditModal, 
      bio,
      saveBio,
      internalUserId,
      pendingFollowRequest,
      loading,
      toggleUnfollow,
      acceptOrDeclineFollowRequest,
      currentUserId
    };
  },
};
</script>

<style>
.fa-heart {
    color: #ff0000;
}

</style>