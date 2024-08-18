import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";
  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

// https://res.cloudinary.com/dj5q966nb/image/upload/dpr_auto/w_200/v1710344436/fafceddc-2845-4ae7-a25a-632f01922b4d.png

// /dpr_auto/w_200
// console.log(fileFormat)
// const transformImage = (url = "", width = 100) => {
//   const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
// // console.log(newUrl)
//   return newUrl;
// };
const transformImage = (url = "", width = 100) => {
  // Handle case where url is an array
  if (Array.isArray(url)) {
    url = url[0]; // Extract the first element, assuming it's the string you want
  }

  if (typeof url !== 'string') {
    console.error('Expected url to be a string but received:', typeof url, url);
    return ''; // or handle the error as needed
  }

  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};


const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7Days.unshift(dayName);
  }

  return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

// const getOrSaveFromStorage = ({ key, value, get }) => {
//   if (get) {
//     const item = localStorage.getItem(key);
//     return item ? JSON.parse(item) : null;
//   } else {
//     localStorage.setItem(key, JSON.stringify(value));
//   }
// };


export { fileFormat, transformImage, getLast7Days};