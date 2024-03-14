import { ManagementClient } from 'auth0';
import { config } from 'dotenv';

config();

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
});

const deleteTestUsers = async () => {
  // Get all users
  const users = await managementClient.users.getAll({
    q: 'user_metadata.isTestUser:true',
  });

  // Delete each test user
  const promises = users.data.map(async (user) => {
    await managementClient.users.delete({ id: user.user_id });
  });

  await Promise.all(promises);
};

deleteTestUsers().then(() => {
  console.log('== SUCCESS == All test users have been deleted.');
});
