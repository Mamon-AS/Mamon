<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
        
        <div v-else-if="error" class="text-center text-red-500 p-4">
            {{ error }}
        </div>

        <div v-else>
            <!-- Page Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                    {{ howItWorksData?.pageTitle }}
                </h1>
                <p class="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                    {{ howItWorksData?.introduction }}
                </p>
            </div>

            <!-- Horizontal Cards -->
            <div class="w-full max-w-7xl mx-auto px-4 mb-16 space-y-8">
                <div v-for="(card, index) in howItWorksData?.horizontalCards" :key="index" 
                     :class="[
                         'rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden',
                         card.backgroundColor === 'light-blue' ? 'bg-blue-50' : 
                         card.backgroundColor === 'light-green' ? 'bg-green-50' : 'bg-white'
                     ]">
                    <div class="flex flex-col md:flex-row">
                        <!-- Image Section -->
                        <div class="md:w-1/2">
                            <img v-if="card.image" 
                                 :src="CreateURL(card.image)" 
                                 :alt="card.title"
                                 class="w-full h-full object-cover min-h-[300px]">
                        </div>
                        
                        <!-- Content Section -->
                        <div class="md:w-1/2 p-8 flex flex-col justify-center">
                            <h2 class="text-3xl font-bold mb-4 text-primary-700">{{ card.title }}</h2>
                            <p class="text-lg text-secondary-600 mb-6">{{ card.description }}</p>
                            
                            <!-- Call to Action -->
                            <div v-if="card.cta" class="mt-auto">
                                <router-link :to="card.cta.link" 
                                           class="inline-block bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 text-lg font-semibold">
                                    {{ card.cta.text }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sections Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                <div v-for="(section, index) in howItWorksData?.sections" :key="index" 
                     class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary-100 flex flex-col">
                    <div class="flex-grow">
                        <h1 class="text-2xl font-bold mb-6 text-primary-700">{{ section.title }}</h1>
                        
                        <p v-if="section.description" class="mb-6 text-secondary-600 leading-relaxed">
                            {{ section.description }}
                        </p>

                        <ol v-if="section.steps" class="space-y-4 w-full">
                            <li v-for="step in section.steps" :key="step.number" 
                                class="flex items-center space-x-4 p-4 rounded-lg">
                                <span class="flex items-center justify-center min-w-8 w-8 h-8 bg-primary-500 text-white rounded-full font-bold">
                                    {{ step.number }}
                                </span>
                                <span class="text-secondary-700">{{ step.text }}</span>
                            </li>
                        </ol>
                    </div>

                    <img v-if="section.image" 
                         :src="CreateURL(section.image)" 
                         :alt="section.title"
                         class="w-full h-auto mt-6 rounded-lg">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sanity from '../client';
import { CreateURL } from '../utils';

const howItWorksData = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        const query = `*[_type == "howItWorks"][0] {
            pageTitle,
            introduction,
            horizontalCards[] {
                title,
                description,
                image,
                backgroundColor,
                cta {
                    text,
                    link
                }
            },
            sections[] {
                title,
                description,
                image,
                steps[] {
                    number,
                    text
                }
            }
        }`;
        
        const data = await sanity.fetch(query);
        howItWorksData.value = data;
    } catch (err) {
        error.value = 'Kunne ikke laste inn innhold. Vennligst prøv igjen senere.';
        console.error('Error fetching how it works data:', err);
    } finally {
        loading.value = false;
    }
});
</script>