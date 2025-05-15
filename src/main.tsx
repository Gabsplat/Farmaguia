import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PharmacyProvider } from "./context/PharmacyContext.tsx";
import "./index.css";
import MapLayout from "./layout/MapLayout.tsx";
import TestLayout from "./layout/TestLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PharmacyProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<MapLayout />} /> */}
          <Route element={<TestLayout />}>
            <Route path="/" element={<MapLayout></MapLayout>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PharmacyProvider>
  </StrictMode>
);
