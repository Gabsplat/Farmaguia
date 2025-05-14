import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { pharmacies as defaultPharmacies } from "../data/pharmacies";
import type { Pharmacy } from "../types/index";

interface PharmacyContextValue {
  pharmacies: Pharmacy[];
  filtered: Pharmacy[];
  selected: Pharmacy | null;
  searchTerm: string;
  selectedChain: string;
  selectPharmacy: (id: number) => void;
  backToList: () => void;
  setSearchTerm: (v: string) => void;
  setSelectedChain: (v: string) => void;
  /* Google maps */
  //   map: google.maps.Map | null;
  //   setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
}

const PharmacyContext = createContext<PharmacyContextValue | undefined>(
  undefined
);

export const PharmacyProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("Todas");
  const [filtered, setFiltered] = useState<Pharmacy[]>(defaultPharmacies);
  const [selected, setSelected] = useState<Pharmacy | null>(null);
  //   const [map, setMap] = useState<google.maps.Map | null>(null);

  /* filter logic */
  useEffect(() => {
    let res = defaultPharmacies;
    if (searchTerm) {
      const st = searchTerm.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(st) ||
          p.address.toLowerCase().includes(st)
      );
    }
    if (selectedChain !== "Todas")
      res = res.filter((p) => p.name.includes(selectedChain));
    setFiltered(res);
  }, [searchTerm, selectedChain]);

  const selectPharmacy = (id: number) => {
    const ph = defaultPharmacies.find((p) => p.id === id) ?? null;
    setSelected(ph);
  };

  const backToList = () => setSelected(null);

  return (
    <PharmacyContext.Provider
      value={{
        pharmacies: defaultPharmacies,
        filtered,
        selected,
        searchTerm,
        selectedChain,
        selectPharmacy,
        backToList,
        setSearchTerm,
        setSelectedChain,
        // map,
        // setMap,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacies = () => {
  const ctx = useContext(PharmacyContext);
  if (!ctx)
    throw new Error("usePharmacies must be used within PharmacyProvider");
  return ctx;
};
