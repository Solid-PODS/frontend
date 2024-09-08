import pb from '@/lib/pocketbase';

const getExpireString = (exhours) => {
  const d = new Date();
  d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  return expires
}

function getCookie(cookieName) {
  // Check if we are in a browser environment
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
  }
  return null; // Return null if not found or if running on the server
}

export async function signUp(email, password, name) {
  const data = {
    username: name,
    email: email,
    email_visibility: true,
    password: password,
    passwordConfirm: password,
  };

  return await pb.collection('users').create(data);
}

export async function signUpMerchant(email, password, name, merchantName, contactName, businessType) {
  const data = {
    username: name,
    email: email,
    email_visibility: true,
    password: password,
    passwordConfirm: password,
    contactName: contactName,
    merchantName: merchantName,
    businessType: businessType
  };

  return await pb.collection('merchants').create(data);
}

export async function signIn(email, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    // console.log('Auth successful, authData:', authData);

    // console.log('Auth store state after login:', pb.authStore.isValid, pb.authStore.token);
    if (document) {
      const cookieString = pb.authStore.exportToCookie({ httpOnly: false });
      document.cookie = cookieString;
      let expires = getExpireString(72);
      document.cookie = 'is_user=1;' + expires + ';path=/;';
      document.cookie = 'is_merchant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // console.log('Cookie set:', cookieString);

    return authData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signInMerchant(email, password) {
  try {
    const authData = await pb.collection('merchants').authWithPassword(email, password);
    // Explicitly set the cookie
    if (document) {
      const cookieString = pb.authStore.exportToCookie({ httpOnly: false });
      document.cookie = cookieString;

      let expires = getExpireString(72);
      document.cookie = 'is_merchant=1;' + expires + ';path=/;';
      document.cookie = 'is_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    return authData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}


export function signOut() {
  pb.authStore.clear();

  // Clear the pb_auth cookie
  if (document) {
    document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'is_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'is_merchant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // console.log('Signed out, auth store cleared and cookie removed');
}

export function getCurrentUser() {
  let user = pb.authStore.model;
  // console.log(getCookie('is_user'));
  if (getCookie('is_user') != '1') {
    user = null;
  }
  console.log('Current user:', user);
  return user;
}

export function getCurrentMerchant() {
  let merchant = pb.authStore.model;
  // console.log(getCookie('is_merchant'));
  if (getCookie('is_merchant') != '1') {
    merchant = null;
  }
  console.log('Current user:', merchant);
  return merchant;
}

export async function getUserData() {
  const userID = pb.authStore.model.id;
  // get user data 
  const user = await pb.collection('users').getOne(userID);
  return user;
}

export async function getMerchantData() {
  const merchantID = pb.authStore.model.id;
  // get merchant data 
  const merchant = await pb.collection('merchants').getOne(merchantID);
  console.log("merchant data", merchant);
  return merchant;
}

export async function updateUserData(data) {
  const userID = pb.authStore.model.id;
  // update user data 
  const user = await pb.collection('users').update(userID, data);
  return user;
}

export async function updateMerchantData(data) {
  const merchantID = pb.authStore.model.id;
  // update merchant data 
  const merchant = await pb.collection('merchants').update(merchantID, data);
  return merchant;
}

export async function getMerchantOffers() {
  const merchantID = pb.authStore.model.id;
  // get merchant offers
  const offers = await pb.collection('offers').getFullList({ filter: `merchant_id.id="${merchantID}"` });
  console.log('Merchant offers:', offers);
  return offers;
}

export async function getMerchantOrders() {
  const merchantID = pb.authStore.model.id;
  // get merchant orders
  const orders = await pb.collection('orders').getFullList({ filter: `merchant_id.id="${merchantID}"` });
  return orders;
}

export async function getCategories() {
  // get categories
  const categories = await pb.collection('category').getFullList();
  console.log('Categories:', categories);
  return categories;
}

export async function getOffers() {
  // get offers
  const offers = await pb.collection('offers').getFullList();
  return offers;
}

export async function getMerchants() {
  // get merchants
  const merchants = await pb.collection('merchants').getFullList();
  return merchants;
}

export async function getOffersWithDetails() {
  // Fetch offers, merchants, and categories
  const offers = await getOffers();
  const merchants = await getMerchants(); // Fetch merchants data
  const categories = await getCategories(); // Fetch categories data

  // Create a mapping for merchant names and category names
  const merchantMap = merchants.reduce((acc, merchant) => {
    acc[merchant.id] = merchant.merchantName; // Assuming each merchant has an 'id' and 'name'
    return acc;
  }, {});

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name; // Assuming each category has an 'id' and 'name'
    return acc;
  }, {});

  // Map offers to the desired format
  const formattedOffers = offers.map((offer) => {
    return {
      merchant_name: merchantMap[offer.merchant_id] || 'Unknown Merchant',
      category_name: categoryMap[offer.category_id] || 'Unknown Category',
      discount: offer.discount,
      start_date: offer.start_date,
      end_date: offer.end_date,
    };
  });

  return formattedOffers;
}

export async function addMerchantOffer(data) {
  // add merchant offer
  const offer = await pb.collection('offers').create(data);
  return offer;
}

export async function updateMerchantOffer(offerID, data) {
  // update merchant offer
  const offer = await pb.collection('offers').update(offerID, data);
  return offer;
}

export async function deleteMerchantOffer(offerID) {
  // delete merchant offer
  const offer = await pb.collection('offers').delete(offerID);
  return offer;
}

export function isAuthenticated() {
  const isValid = pb.authStore.isValid;
  // console.log('Is authenticated:', isValid);
  return isValid;
}