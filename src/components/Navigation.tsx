import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="mb-6 sm:mb-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <Link to="/index">
          <Button 
            variant={location.pathname === "/index" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/index" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Compras
          </Button>
        </Link>
        <Link to="/sales">
          <Button 
            variant={location.pathname === "/sales" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/sales" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Vendas
          </Button>
        </Link>
        <Link to="/assets">
          <Button 
            variant={location.pathname === "/assets" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/assets" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Ativos
          </Button>
        </Link>
        <Link to="/dividends">
          <Button 
            variant={location.pathname === "/dividends" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/dividends" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Proventos
          </Button>
        </Link>
        <Link to="/derivatives">
          <Button 
            variant={location.pathname === "/derivatives" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/derivatives" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Derivativos
          </Button>
        </Link>
        <Link to="/">
          <Button 
            variant={location.pathname === "/" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-colors text-xs sm:text-sm",
              location.pathname === "/" 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;