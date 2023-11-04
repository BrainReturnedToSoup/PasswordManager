//We are using postgres in order to leverage hash indexes
//for optimized artificial key querying. This is because
//artificial keys will be generated via the UUID library
//as opposed to within postgres itself

//the schema will have two main tables, the 'user' table
//and the 'credentials' table. The 'user' table will feature
//the information for authentication and logging into the app
//this is for only the username/email and password

//the 'credentials' table will store all records relating to user
//stored credentials. Each record represents a credential pair.
//the primary key for this table is the 'credential_id' column, which is auto
//incrementing. The records are normalized via the user uuid for the foreign key column
//'user_uuid'

//this way, logging in is a simple as querying the 'user' table 
//using the username and password supplied, and then using the corresponding
//artificial key in the web token.

//This allows for the simple querying of the credential pairs, as the records
//are within the same block clusters, and the primary key uses the same artificial key
//in combination with the auto incrementing column pertaining to all records of credentials
//for the specific user.

//The auto incrementing column in this case enables a more stable querying when it comes to 
//making api requests based on the clicked credential pair on the UI, because the credentials
//will not be shown until you click on such. This is so that each action you take when
//looking at sensitive data is vetted as the web token in question is checked each time.

//The username and password stored in the 'user' table will be permanently hashed using bcrypt
//as bcrypt provides tools for verifying a supplied value against a hash.

//The credentials stored in the 'credentials' table will be hashed using crypto instead, because
//of the need to be able to dehash into an original form. This is something that bcrypt does not possess,
//which is important considering that we are going to be sending these credentials back to the user.



const { Pool } = require("pg"); //postgreSQL

const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DB,
  password: process.env.POSTGRESQL_PW,
  port: process.env.POSTGRESQL_PORT,
});

module.exports = pool;
