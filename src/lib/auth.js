import pb from '@/lib/pocketbase';

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

export async function signIn(email, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    // console.log('Auth successful, authData:', authData);
    
    // Log the auth store state
    // console.log('Auth store state after login:', pb.authStore.isValid, pb.authStore.token);
    
    // Explicitly set the cookie
    const cookieString = pb.authStore.exportToCookie({ httpOnly: false });
    document.cookie = cookieString;
    // console.log('Cookie set:', cookieString);
    
    return authData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export function signOut() {
  pb.authStore.clear();
  
  // Clear the pb_auth cookie
  document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // console.log('Signed out, auth store cleared and cookie removed');
}

export function getCurrentUser() {
  const user = pb.authStore.model;
  console.log('Current user:', user);
  return user;
}

export function isAuthenticated() {
  const isValid = pb.authStore.isValid;
  // console.log('Is authenticated:', isValid);
  return isValid;
}