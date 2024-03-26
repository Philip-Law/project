import { ManagementClient } from 'auth0';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';

config();

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
});

interface UserData {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
}

const createUser = async (user: UserData) => {
  await managementClient.users.create({
    ...user,
    connection: 'Username-Password-Authentication',
    email_verified: true,
    verify_email: false,
    user_metadata: {
      isTestUser: true,
    },
  });
};

const createTestUsers = async (numUsers: number) => {
  const promises = Array.from({ length: numUsers }, async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = {
      email: `temp.${firstName}.${lastName}@torontomu.ca`,
      name: `${firstName} ${lastName}`,
      password: 'ComplexPassword321!',
      given_name: firstName,
      family_name: lastName,
      picture: faker.image.avatar(),
    };
    console.log(user);
    await createUser(user);
  });

  await Promise.all(promises);
};

createTestUsers(10).then(() => {
  console.log('== SUCCESS == ');
});
