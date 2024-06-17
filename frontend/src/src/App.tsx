import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Retrieval from "./routes/info_retrieval";
import Extraction from "./routes/info_extraction";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Retrieval />,
    },
    {
      path: "/extraction",
      element: <Extraction />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
