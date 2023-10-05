<template>
  <main class="marketing-page">
      <section v-if="post" class="container mx-auto p4">
          
        <div class="buttons">
        <h2>Buttons</h2>
        <button @click="shareButton" id="share-button" class="btn btn-primary">Share</button>
      </div>
          <img :src="CreateURL(post.image, 1280, 300)" class="w-full mb-8" />

          <button
              @click="$router.back()"
              class="flex-items-center text-lg text-green-500 hover:text-green-600 duration-300 mb-4">
              <span class="material-icons text-lg mr-1">keyboard_double_arrow_left</span> Tilbake
          </button>

          <h1 class="text-white text-4xl md:text-5xl mb-8 font-bold">
              {{ post.title }}
          </h1>
          
          <p class="text-gray-500-italic mb-8">{{ post.excerpt }}</p>

          <p v-html="TextToHTML(post.body)">  </p>
          <div class="flex items-center mb-8" v-if="post.author">
      <img 
        :src="CreateURL(post.author.avatar, 300, 300)" 
        class="inline-block rounded-full w-10 h-10 mr-4"  />

      <h1 class="text-gray-500 text-lg">
        {{ post.author.full_name }}
      </h1>
    </div>
          <div class="text-container">
              <p>{{ currentText }}</p>
          </div>
              <button @click="captureAndPostToInstagram" class="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
               Publiser til Instagram
              </button>
      </section>
      <section v-else>
          <p class="text-white italic text-2xl">
              Laster inn...
          </p>
      </section>

  </main>
</template>

<script>
import { onMounted, ref  } from 'vue';
import { useRoute } from 'vue-router'
import sanity from '../../client';
import { CreateURL, TextToHTML } from '../../utils';
import html2canvas from 'html2canvas';
import { getAuth } from 'firebase/auth'; // Import the getAuth function from Firebase
import { useStore } from 'vuex'

// import { initFacebookSdk, getFB } from '../../utils';

export default {
setup() {
  const route = useRoute();
  const id = ref(route.params.id);
  const post = ref(null);

  const store = useStore();
  const accessToken = store.getters.getAccessToken;
  const accessFuck = "BRfBSUGF3HT8iRqo2_jzXlsTEuShJnxiCH4Iwkt5t_I.eyJ1c2VyX2lkIjoiMTAxNTg5NjgxOTIwMDEyNjAiLCJjb2RlIjoiQVFEalR0YlNmODdVZkZlanhSWTZvQ1FVeVcxOHRUei1SU0gtM2d6TWlBUGd6WGJmXzdvUV9SZHlQRE1iVWtvUWJUejlsX3NrX3pEXzIyajJ1VDAyTnNhM3VZT0J6WGJLQngxMzFBRU5KTUdydEF6bGZvTzhWbFB5MjFuLVNyYjI2b1VjNUNnbWV1SXZHcFNIQVFRTXlhY3dYREhiMnlzQldrSkZ5VEZGeEo2REtRYzNxNmdjd3pzWkViTFp2NkxqYXBEbU1MY0l6THJtMUUwWUFXdVhXclhjck84WWs1UV9aWkNpbHhSb2FQS2djVTBqU3Vfc3NzSnoyWThUeEJDNDFTQmVHWmNuUTNhSlV1UEhMMHpNZ250RzEzcmZ2eUdQUW5iNnJHT19tMjJzbGROVjBpQWVKQlljdXpUdHJ2T2hvODNRQVNackxiT2JoUDYwMWg3dkRlb3IiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTY5NjE4NzI0MX0"

  const apiVersion = 'v17.0';
  const igUserId = "17841400880530849";
  const apiUrl = `https://graph.facebook.com/${apiVersion}/${igUserId}/media`;

  const caption = '#reklame #sponset #annonse #reklameinnlegg #spons #sponsa #sponsing #sponsede #sponsorer #sponsorerer #sponsoreret #spons';
  const user_tags = '{"username":"mamon"}';
  const fakeIMGSrc = "../../images/High_Resolution_Image_1.jpg"
  let FBaccessToken = 0;
  let FBUSerID = 0;
  const eriksIG = "54365351"

  function shareButton() {
    // initFacebookSdk().then(() => {
       FB.ui({
         method: 'share',
         href: 'https://developers.facebook.com/docs/'
       }, function(response){
         console.log(response);
       });

    // });
    }
  


  onMounted(() => {
    const query = '*[_type == "marketing" && _id == $id][0] {..., author->}';
    const params = { id: id.value };

    sanity.fetch(query, params).then((data) => {
      post.value = data;
    });

 
    
  });

async function captureAndPostToInstagram() {
const auth = getAuth(); // Initialize the authentication service
const user = auth.currentUser; // Retrieve the currently logged-in user
const userLOL = "ok"

  // if (user) {
  //   // Check if the user's provider is Facebook
  //   const isFacebookProvider = user.providerData.some(
  //     (provider) => provider.providerId === 'facebook.com'
  //   );

  //   if (isFacebookProvider) {
  //     // Get the Facebook user ID from the user's UID
  //     const facebookUserId = user.uid;
  //     console.log(user);
  //     console.log('Facebook User ID:', facebookUserId);

      // Capture image data
      const textContainer = document.querySelector('.text-container');
      const canvas = await html2canvas(textContainer);
      const imageData = canvas.toDataURL('image/jpeg');

      // Call the function to simulate posting to Instagram
      console.log("Sending to simulateIGPost")
      simulateInstagramPost(imageData);
   // }
  // } else {
  //   console.log('No user is signed in.');
  // }
}


function simulateInstagramPost(imageData) {
    console.log('Welcome!  Fetching your information.... ');
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FBaccessToken = response.authResponse.accessToken;
        FBUSerID = response.authResponse.userID;
      } 
    } );

    FB.api(
  '/54365351/media',
  'POST',
  {
    image_url: fakeIMGSrc,
    caption: 'YOUR_IMAGE_CAPTION',
    access_token: FBaccessToken
  },
  function (response) {
    if (response && !response.error) {
      // Handle the result
      console.log('Media created:', response);

      // Now publish the media
      FB.api(
        '/{instagram-user-id}/media_publish',
        'POST',
        {
          creation_id: response.id,
          access_token: 'PAGE_ACCESS_TOKEN'
        },
        function (publishResponse) {
          if (publishResponse && !publishResponse.error) {
            console.log('Media published:', publishResponse);
          } else {
            console.error('Error publishing media:', publishResponse.error);
          }
        }
      );
    } else {
      console.error('Error creating media:', response.error);
    }
  }
);





    }
  return {
    post,
    CreateURL,
    TextToHTML,
    captureAndPostToInstagram,
    shareButton,
  };
},
};
</script>



