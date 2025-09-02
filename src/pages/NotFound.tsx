import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-text-primary">404</h1>
        <p className="text-lg sm:text-xl text-text-secondary mb-4">Oops! Página não encontrada</p>
        <a 
          href="/" 
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
