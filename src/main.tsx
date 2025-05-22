import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PharmacyProvider } from "./context/PharmacyContext.tsx";
import "./index.css";
import MapLayout from "./layout/MapLayout.tsx";
import PharmacyLayout from "./layout/PharmacyLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PharmacyProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MapLayout />}>
            <Route path="/" element={<PharmacyLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PharmacyProvider>
  </StrictMode>
);
