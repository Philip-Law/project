import { AuthenticationClient } from 'auth0';
import { config } from 'dotenv';
import { argv } from 'process';

config();

const authClient = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
});

const getAccessToken = async (email: string) => {
  const response = await authClient.oauth.passwordGrant({
    audience: process.env.BACKEND_AUDIENCE!!,
    username: email,
    password: 'ComplexPassword321!',
    realm: 'Username-Password-Authentication',
  });

  if (response.status !== 200) {
    console.log(`Failed to get access token: ${response.statusText}`);
    process.exit(1);
  }
  console.log(response.data);
};

const email = argv[2];

if (!email) {
  console.log('Please provide an email as an argument.');
  process.exit(1);
}

getAccessToken(email);
