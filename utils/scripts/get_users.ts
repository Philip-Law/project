import { ManagementClient } from 'auth0';
import { config } from 'dotenv';

config();

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
});

const getAllTestUsers = async () => {
  const users = await managementClient.users.getAll({
    q: 'user_metadata.isTestUser:true',
  });
  console.log(users.data);
};

getAllTestUsers().then(() => {
  console.log('== SUCCESS == ');
});
