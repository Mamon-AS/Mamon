<template>
    <div class="flex items-center gap-2 bg-gray-100 p-2 rounded-lg shadow-sm mb-2">
      <p class="text-sm text-gray-700 flex-grow">{{ name }} har sendt deg en følgeforespørsel</p>
      <button @click="acceptFollowRequest" class="bg-mamonblue hover:bg-lightblue text-white text-xs font-semibold py-1 px-2 rounded">
        Aksepter
      </button>
      <button @click="declineFollowRequest" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded">
        Slett
      </button>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { useStore } from 'vuex';
  
  export default defineComponent({
    props: {
      requesterId: {
        type: String,
        required: true,
      },
      receiverId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      followRequestId: {
        type: String,
        required: true,
      }, 
    },
    setup(props) {
      const store = useStore();
    
      const acceptFollowRequest = async () => {
        console.log("acceptFollowRequest");
         store.dispatch('following/acceptFollowRequest', {
           requesterId: props.requesterId,
           receiverId: props.receiverId,
           followRequestId: props.followRequestId,
         });
      };
  
      const declineFollowRequest = async () => {
        console.log("declineFollowRequest");
         store.dispatch('following/declineFollowRequest', {
           requesterId: props.requesterId,
           receiverId: props.receiverId,
           followRequestId: props.followRequestId,});
       };
  
      return {
        acceptFollowRequest,
        declineFollowRequest,
      };
    },
  });
  </script>
  