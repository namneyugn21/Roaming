import { Cloudinary } from "@cloudinary/url-gen";
import Constants from "expo-constants";

export const cld = new Cloudinary({
  cloud: {
      cloudName: Constants.expoConfig?.extra?.CLOUDINARY_CLOUD_NAME,
  },
  url: {
      secure: true
  }
});