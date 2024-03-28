import { ManagementClient } from 'auth0';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';
import pgp from 'pg-promise';

config();

const DB = pgp()('postgres://admin:password@localhost:5432/tmu_connect');

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
});

const getAllTestUsers = async () => managementClient.users.getAll({
  q: 'user_metadata.isTestUser:true',
}).then((users) => users.data);

const generatePostsForUser = async (userId: string) => {
  const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Miscellaneous', 'Tutoring', 'Housing', 'Cars', 'Phone', 'Food'];
  const cities = ['Barrie', 'Toronto', 'Scarborough', 'Richmond Hill', 'Vaughn', 'Mississauga', 'Brampton'];
  const adTypes = ['W', 'S', 'A'];

  for (let i = 0; i < 2; i += 1) {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const adType = adTypes[Math.floor(Math.random() * adTypes.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];

    const categoryCount = Math.floor(Math.random() * 2) + 2;
    const category = Array.from(
      { length: categoryCount },
      () => categories[Math.floor(Math.random() * categories.length)],
    );
    const price = Math.floor(Math.random() * 500) + 1;

    await DB.none(
      'INSERT INTO posts (user_id, title, ad_type, description, location, categories, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, title, adType, description, location, category, price],
    );
  }
};

const populateDatabase = async () => {
  const auth0Users = await getAllTestUsers();
  const majors = ['Computer Science', 'Mathematics', 'Statistics', 'Physics', 'Chemistry', 'Biology', 'Engineering'];

  auth0Users.forEach(async (user: any) => {
    const phoneNumber = `+1${faker.string.numeric(10)}`;
    const major = majors[Math.floor(Math.random() * majors.length)];
    const year = Math.floor(Math.random() * 4) + 1;

    await DB.none(
      'INSERT INTO users (id, phone_number, major, year) VALUES ($1, $2, $3, $4)',
      [user.user_id, phoneNumber, major, year],
    );

    await generatePostsForUser(user.user_id);
  });
};

populateDatabase().then(() => {
  console.log('=== SUCCESSFULLY POPULATED DATABASE ===');
});
