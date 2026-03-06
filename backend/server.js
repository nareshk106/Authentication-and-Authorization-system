import express from 'express';
import cors from "cors";
import { authMiddleware } from "./middleware/authMiddleware.js";
import routerss from "./route/catroutes.js";
import 'dotenv/config';
import router from './route/getuser.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use('/', authMiddleware, routerss);
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    console.log(`http://localhost:5000/`);
});
//# sourceMappingURL=server.js.map