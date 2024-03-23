import { config } from 'dotenv';
import { ManagementClient } from 'auth0';

config();

const ADMIN_ROLE_ID = 'rol_pwJO1mvNxCRJn6av';

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  clientId: process.env.AUTH0_CLIENT_ID!!,
});

const assignAdminRole = async (id: string) => managementClient
  .roles.assignUsers({ id: ADMIN_ROLE_ID }, { users: [id] });

const auth0Id = process.argv[2];

if (!auth0Id) {
  console.log('Please provide an Auth0 ID as an argument.');
  process.exit(1);
}

assignAdminRole(auth0Id).then(() => {
  console.log('== SUCCESS ==');
});
