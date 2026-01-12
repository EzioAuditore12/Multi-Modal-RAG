import { createApp } from "./lib/create-app";
import authRouter from "./routes/auth.routes";

import router from "./routes/index.route";

const app = createApp();

app.use(router);
app.use("/auth", authRouter);

export default app;
