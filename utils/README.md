# Utility Scripts

This package contains scripts that are useful for tasks related to handling test users including:
- Creating test users
- Deleting test users
- Getting access tokens for test users
- Getting list of test users.

## Preparation

Before running any of the scripts. You will need to run `npm install` to install the necessary dependencies.

Also add a `.env` file to the root of the `utils` directory with the following content:
```env
AUTH0_DOMAIN='dev-cv8djkp6271234j7.us.auth0.com'
AUTH0_CLIENT_ID='aF5vGpwFPuQxuWJRclhETlm8hS7wgad5'
AUTH0_CLIENT_SECRET=<AUTH0_CLIENT_SECRET>
BACKEND_AUDIENCE='http://localhost:3000'
```

### Get Auth0 Test Users

Run the following command to get a list of test users:
```bash
npm run get_users
```

### Get Credentials (Access Token)

Use this script to get a valid access token for a test user. You will need to provide the email of the user
that you want to get the access token for.

Run the following command to get an access token:
```bash
npm run credentials -- <email>
```

### Assign Admin Role

This script assigns the admin role to a test user. You will need to provide the auth0 id of the user as an argument.
You can find the auth0 ID of a user by running the `get_users` script.

Run the following command to assign the admin role to a test user:
```bash
npm run assign_admin -- <auth0_id>
```

After that, any access token generated for that user will have the admin role. Make sure to re-generate any access
token you were previously using for that user and replace it with the new one generated by the `credentials` script.

### Populate Database with Users and Posts

This script populates the database with test users and posts. It will create a user for each auth0 test user that
is available and each user will have 2 posts associated with them. The contents of the post and users are random
so don't expect any meaningful data.

Run the following command to populate the database:
```bash
npm run populate_dbs
```

### Create Auth0 Test Users

**==WARNING==** You shouldn't need to run this script unless you are setting up a new auth0 environment. Most of the time,
your environment will already have test users populated. You can use the `get_users` script to check if there
are any test users in your environment.

Run the following command to populate test users:
```bash
npm run create_users
```

### Delete Auth0 Test Users

**==WARNING==** You should rarely use this script. It is only useful if the test users are corrupt and you need to
delete them all and start over. This will delete all test users in the environment.

Run the following command to delete all test users:
```bash
npm run delete
```
