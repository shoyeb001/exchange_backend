import { app } from "./index";
import { config } from "./config";
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
