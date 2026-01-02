import app from './app';
import env from './env';

//Email Job
import '@/jobs/send-email';
import '@/jobs/send-sms';

app.listen(env.PORT, () => {
  console.log(`server started on http://localhost:${env.PORT}`);
  console.log(`Scalar UI available at http://localhost:${env.PORT}/reference`);
});
