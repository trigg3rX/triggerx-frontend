import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  apiVersion: '2023-05-03', // Use a recent API version date
  useCdn: true, // `false` if you want to ensure fresh data
  studioHost: 'triggerx-devhub'
});

// Helper function to get image URLs from Sanity image objects
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client;