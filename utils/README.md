# Utility Scripts

This package contains scripts that are useful for tasks related to handling test users including:
- Creating test users
- Deleting test users
- Getting access tokens for test users
- Getting list of test users.

### Populate Test Users

**NOTE:** You shouldn't need to run this script unless you are setting up a new auth0 environment. Most of the time,
your environment will already have test users populated. You can use the `get_test_users` script to check if there
are any test users in your environment.

Run the following command to populate test users:
```bash
npm run populate
```

### Get Test Users

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

### Delete Test Users

**WARNING:** You should rarely use this script. It is only useful if the test users are corrupt and you need to 
delete them all and start over. This will delete all test users in the environment.

Run the following command to delete all test users:
```bash
npm run delete
```
