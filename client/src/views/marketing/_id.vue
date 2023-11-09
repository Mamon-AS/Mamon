<template>
  <main class="marketing-page">
      <section v-if="post" class="container mx-auto p4">
            <img :src="CreateURL(post.image, 1280, 300)" class="w-full mb-8" />
            
            <button
                @click="$router.back()"
                class="flex-items-center text-lg text-green-500 hover:text-green-600 duration-300 mb-4">
                <span class="material-icons text-lg mr-1">keyboard_double_arrow_left</span> Tilbake
            </button>

            <h1 class="text-white text-4xl md:text-5xl mb-8 font-bold">
                {{ post.title }}
            </h1>
            
            <p class="text-gray-500-italic mb-8">
                {{ post.excerpt }}
            </p>

            <p v-html="TextToHTML(post.body)"> </p>

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
            <button @click="captureAndPostToInstagram" class="bg-blue-500 text-white px-4 py-2 mt-4 rounded"> Publiser til Instagram</button>
    

            <!-- Loading Spinner -->
            <div v-if="isLoading">
                <button type="button" class="bg-indigo-500 ..." disabled>
                    <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                    </svg>
                    Jobber...
                    </button>
            </div>

            <!-- Error Message -->
            <div v-if="error">
            {{ error.message }}
            </div>

            <!-- Success Message -->
            <div v-if="isSuccess">
            Tilbudet publisert på Instagram!
            </div>
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
import axios from 'axios';

function getLoginStatus() {
    return new Promise((resolve, reject) => {
        FB.getLoginStatus(response => {
            if (response) {
                resolve(response);
            } else {        
                reject(new Error('Failed to get login status'));
            }
        });
    });
}

export default {
setup() {
  const route = useRoute();
  const id = ref(route.params.id);
  const post = ref(null);

  const user_tags = '[{"username":"mamonnorge", "x":"0.5", "y":"0.5"}]';      
  let FBaccessToken = 0;
  let pageID = ""
  let igBusinessUserId = ""
  let containerID = 0;
  const isLoading = ref(false);
  const error = ref(null);
  const isSuccess = ref(false);


  onMounted(() => {
    const query = '*[_type == "marketing" && _id == $id][0] {..., author->}';
    const params = { id: id.value };

    sanity.fetch(query, params).then((data) => {
      post.value = data;
    });

 
    
  });

    async function captureAndPostToInstagram() {
        // Capture image data, IG expects an image URL so we need to convert the image data to a URL
        const image_data = CreateURL(post.value.image, 1080, 1080);
        const ig_title = post.value.title +" #reklame #mamonnorge";
        // Call the function to simulate posting to Instagram
        console.log("Sending to simulateIGPost")
        console.log(image_data);
        simulateInstagramPost(image_data, ig_title);

    }

    async function simulateInstagramPost(imageData, igTitle) {
        try {
        isLoading.value = true;
        error.value = null;
        isSuccess.value = false;

        // 2. Use the promisified version
        const fbResponse = await getLoginStatus();

        if (fbResponse.status === 'connected') {
          FBaccessToken = fbResponse.authResponse.accessToken      
            try {
            // Now that we have the accessToken we need to fetch the pageID in order to find the Instagram Business Account ID (dont ask why its like this) 
            // this pic explains the flow: https://miro.medium.com/v2/resize:fit:720/format:webp/1*eWKoYEesv8Mj679bAM23wA.png

                 // Fetching pageID
                let response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
                    params: {
                        "access_token": FBaccessToken
                    }
                });
                console.log(response.data.data);
                pageID = response.data.data[0].id;


                //Using pageID to make the second API call
                let igResponse = await axios.get(`https://graph.facebook.com/v18.0/${pageID}?fields=instagram_business_account`, {
                    params: {
                        "access_token": FBaccessToken
                    }
                });
                console.log(igResponse.data.instagram_business_account.id);
                igBusinessUserId = igResponse.data.instagram_business_account.id
                
                //  // Using the Instagram Business Account ID to make the third API call to create the container
                 let createContainer = await axios.post(`https://graph.facebook.com/v18.0/${igBusinessUserId}/media`, {
                     "image_url": imageData,
                     "caption": igTitle,
                     "user_tags": user_tags,
                     "access_token": FBaccessToken
                 });
                
                 containerID = createContainer.data.id;

                // // Using the containerID to make the fourth API call to publish the container
                 let publishContainer = await axios.post(`https://graph.facebook.com/v18.0/${igBusinessUserId}/media_publish`, {
                     "creation_id": containerID,
                     "access_token": FBaccessToken
                 });
                // console.log(publishContainer.data);
            } catch (error) {
                console.error('Error in API calls: ', error);
                if (error.response) {
                    console.log('Response data:', error.response.data);
                    console.log('Response status:', error.response.status);
                    console.log('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.log('Request data:', error.request);
                } else {
                    console.log('Error message:', error.message);
                }
            }
        } else {
          throw new Error('Not connected to Facebook');
        }
      } catch (error) {
        console.log("Error in FB getLoginStatus or API calls: ", error);
        error.value = error;
      } finally {
        isLoading.value = false;
        isSuccess.value = true;
      }
    }
  return {
    post,
    CreateURL,
    TextToHTML,
    captureAndPostToInstagram,
    isLoading,
    error,
    isSuccess
  };
},
};
</script>



