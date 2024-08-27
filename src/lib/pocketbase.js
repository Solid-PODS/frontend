import PocketBase from 'pocketbase';

const pb = new PocketBase('https://solidpods.pockethost.io');

// Enable sending credentials
// pb.autoCancellation(false);
// pb.authStore.onChange(() => {
//   console.log('authStore changed');
// });

export default pb;