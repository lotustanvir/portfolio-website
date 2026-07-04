import logger from "../config/logger.js";
import * as settingRepository from "../repositories/setting.repository.js";

let cache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

function isCacheValid() {
  return cache && Date.now() - cacheTimestamp < CACHE_TTL;
}

function invalidateCache() {
  cache = null;
  cacheTimestamp = 0;
}

export async function getPublic() {
  if (isCacheValid()) {
    return cache;
  }

  const settings = await settingRepository.get();

  const publicFields = {
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroImage: settings.heroImage,
    about: settings.about,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    github: settings.github,
    linkedin: settings.linkedin,
    facebook: settings.facebook,
    instagram: settings.instagram,
    resumeUrl: settings.resumeUrl,
    themeColor: settings.themeColor,
    logo: settings.logo,
    favicon: settings.favicon,
    updatedAt: settings.updatedAt,
  };

  cache = publicFields;
  cacheTimestamp = Date.now();

  return publicFields;
}

export async function getAdmin() {
  const settings = await settingRepository.get();
  return settings;
}

export async function update(data) {
  const settings = await settingRepository.update(data);
  invalidateCache();
  logger.info({}, "Website settings updated");
  return settings;
}
