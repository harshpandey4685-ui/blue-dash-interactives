import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare, User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all hover:scale-105"
          >
            BlogNest
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/create">
                  <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="transition-all hover:scale-[1.02]"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
