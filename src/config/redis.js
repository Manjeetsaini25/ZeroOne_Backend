const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'skirt-trendy-toes-44450.db.redis.io',
        port: 12374
    }
});

module.exports = redisClient;