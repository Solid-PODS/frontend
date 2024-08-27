import pb from '@/lib/pocketbase';

export async function signUp(email, password, name) {
  const data = {
    username: name,
    email: email,
    email_visibility: true,
    password: password,
    passwordConfirm: password,
  };

  // const records = 
  // await pb.collection('users').requestVerification(email);

  return await pb.collection('users').create(data);
}

export async function signIn(email, password) {
  return await pb.collection('users').authWithPassword(email, password);
}

export function signOut() {
  pb.authStore.clear();
}

export function getCurrentUser() {
  return pb.authStore.model;
}

export function isAuthenticated() {
  return pb.authStore.isValid;
}

// export async function resendVerification(email) {
//   try {
//     await pb.collection('users').requestVerification(email);
//   } catch (error) {
//     console.error('Resend verification error:', error);
//     throw error;
//   }
// }