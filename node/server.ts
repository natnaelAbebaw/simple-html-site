import "./Controllers/index";

import App from "./app";

const port = process.env.PORT || 8000;

App.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
