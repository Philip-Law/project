import React from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Home from "./components/Home";
import {PassageAuth, PassageProfile, PassageProvider} from "@passageidentity/passage-react";
import NotFound from "./components/NotFound";

const App = () => {
    const router = createBrowserRouter([
        { path: "/", element: <Home /> },
        { path: "/login", element: <PassageAuth /> },
        { path: "/profile", element: <PassageProfile /> },
        { path: "*", element: <NotFound /> },
    ]);

  return (
      <PassageProvider appId={process.env.REACT_APP_PASSAGE_APP_ID || ""}>
          <RouterProvider router={router} />
      </PassageProvider>
  );
}

export default App;
