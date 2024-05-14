export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43881942-8dac17283930b8539e88965c4';

export const options = {
  params: {
    key: API_KEY,
    q:  "",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: 1,
    per_page: 40,
  },
}; 