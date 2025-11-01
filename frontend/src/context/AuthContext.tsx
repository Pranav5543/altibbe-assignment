import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    company: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get("/api/auth/user");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["x-auth-token"];
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post("/api/auth/login", { email, password });
    const { token } = res.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["x-auth-token"] = token;
    await loadUser();
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    company: string
  ) => {
    const res = await axios.post("/api/auth/register", {
      name,
      email,
      password,
      company,
    });
    const { token } = res.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["x-auth-token"] = token;
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
