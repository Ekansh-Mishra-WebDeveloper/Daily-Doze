require('dotenv').config();
console.log('MJ_APIKEY_PUBLIC:', process.env.MJ_APIKEY_PUBLIC ? '✅ Loaded' : '❌ MISSING');
console.log('MJ_APIKEY_PRIVATE:', process.env.MJ_APIKEY_PRIVATE ? '✅ Loaded' : '❌ MISSING');