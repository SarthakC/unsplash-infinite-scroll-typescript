import { Image } from './unplash.models';

const imageContainer = document.getElementById(
  'image-container',
) as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;

const COUNT = 10;
const API_KEY = process.env.UNSPLASH_API_KEY;

const API_URL = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${COUNT}`;

let ready = false;
let imagesLoaded = 0;

const getPhotos = async (): Promise<Image[]> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const setAttributes = (
  element: HTMLAnchorElement | HTMLImageElement,
  attributes: Record<string, any>,
) => {
  Object.keys(attributes).forEach((key) =>
    element.setAttribute(key, attributes[key]),
  );
};

const imageLoaded = (photos: Image[]) => {
  if (ready == false) loader.style.display = 'flex';
  imagesLoaded += 1;
  if (imagesLoaded === photos.length) {
    ready = true;
    loader.style.display = 'none';
  }
};

const displayPhotos = (photos: Image[]) => {
  imagesLoaded = 0;
  photos.forEach((photo) => {
    const item = document.createElement('a');
    setAttributes(item, { href: photo.links.html, target: '_blank' });
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    img.addEventListener('load', () => imageLoaded(photos));
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
};

const loadAndDisplayPhotos = async () => {
  const photos = await getPhotos();
  displayPhotos(photos);
};

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    loadAndDisplayPhotos();
  }
});

const onLoad = () => {
  loadAndDisplayPhotos();
};

onLoad();
