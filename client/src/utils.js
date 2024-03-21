import sanity from "./client"
import imageUrlBuilder from '@sanity/image-url'
import { getAuth } from "firebase/auth";
import { ref } from "vue";

const builder = imageUrlBuilder(sanity)
const currentUser = ref(null);

export const CreateURL = (source, width = 300, height = 300) => {
    return builder.image(source).width(width).height(height).url()
}

//Dag måned år
export const FormatDate = (date) => {
    return new Date(date).toLocaleDateString()
}
// finn newline og bytt ut med <br>
export const TextToHTML = (text) => {
    return text.replace(/\n/g, '<br>')
}

getAuth().onAuthStateChanged(user => {
    currentUser.value = user;

  });

// Navigerer til brukerprofilen til brukeren, eller til innlogget bruker
export const navigateToProfile = (router, userId) => {
    const currentUserId = currentUser.value ? currentUser.value.uid : null;

    if (userId === currentUserId) {
        router.push({ name: 'user' });
    } else {
        router.push({ name: 'UserProfile', params: { userId } });
    }
};

// Firebase timestamp til Måned Dag Time:Minutt
export const timeStampToDate = (timestamp) => {
    let date;
    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === 'string' || timestamp instanceof String) {
        date = new Date(timestamp);
    } else if (timestamp && typeof timestamp === 'object' && "_seconds" in timestamp) {
        date = new Date(timestamp._seconds * 1000);
    } else {
        console.warn("timeStampToDate called with invalid timestamp format:", timestamp);
        return "Invalid Date";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month} ${day.toString().padStart(2, '0')} ${year} ${hours.toString().padStart(2, '0')}:${minutes}`;
};
