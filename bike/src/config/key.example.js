const POSTGRESHOST = 'localhost'; 
const POSTGRESUSER = 'postgres'; 
const POSTGRESPASSWORD = '1234'; 
const POSTGRESDATABASE = 'back'; 
const POSTGRESPORT = '5432'; 
const POSTGRES_URI = process.env.POSTGRES_URI || ''; 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adonis';


module.exports = {
    POSTGRESHOST,
    POSTGRESUSER,
    POSTGRESPASSWORD,
    POSTGRESDATABASE,
    POSTGRESPORT,
    POSTGRES_URI,
    MONGODB_URI
};