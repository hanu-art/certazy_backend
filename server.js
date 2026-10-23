import './src/jobs/emailWorker.js' 
import './src/config/db.js'
import './src/config/redis.js'
import { connectRedis } from './src/config/redis.js'
import textConnection from './src/config/db.js'
import env from './src/config/env.js'
import app from './src/app.js' ;


(async () => {
    await textConnection();
    await connectRedis();
    app.listen(env.PORT, () => {
        console.log(`\n🚀 Server running on localhost:${env.PORT} [${env.NODE_ENV}]\n`)
    })
})();
