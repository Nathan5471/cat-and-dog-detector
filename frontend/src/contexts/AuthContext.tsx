import { createContext, useState, useContext } from "react";
import { getSelf, logoutUser } from "../utils/authAPIHandler";

interface AuthContextType {
  user:
    | {
        id: string;
        username: string;
      }
    | null
    | undefined;
  getUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);

  const getUser = async () => {
    try {
      const userData = await getSelf();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(undefined);
  };

  const contextValue = {
    user,
    getUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
