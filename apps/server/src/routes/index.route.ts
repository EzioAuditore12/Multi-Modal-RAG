import { createRouter } from '@/lib/create-app';
import { rateLimiter } from '@/middleware/rate-limiter';

const indexRoute = createRouter();

indexRoute.get('/', rateLimiter, (_, res) => {
  res.send('Hello World!');
});

export default indexRoute;
