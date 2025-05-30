import { useEffect, useState } from "react";

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Call handleResize immediately to set the initial value
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}
