import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthResponse,
  getStoredAccessToken,
  storeAuthResponse,
} from "../services/hiredInApi";
import { UserRole, type UserRoleValue } from "../services/hiredInTypes";

type AuthState = {
  accessToken: string | null;
  user: AuthResponse["user"] | null;
  role: UserRoleValue | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (auth: AuthResponse) => void;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const validRoles = [UserRole.Candidate, UserRole.Employer, UserRole.Admin];

function normalizeRole(value: unknown): UserRoleValue | null {
  if (typeof value === "string") {
    const roleName = value.trim().toLowerCase();

    if (roleName === "candidate") return UserRole.Candidate;
    if (roleName === "employer") return UserRole.Employer;
    if (roleName === "admin") return UserRole.Admin;
  }

  const roleValue = Number(value);

  return validRoles.includes(roleValue as UserRoleValue)
    ? (roleValue as UserRoleValue)
    : null;
}

function getStoredRole(): UserRoleValue | null {
  return normalizeRole(localStorage.getItem("hiredin.userRole"));
}

function getStoredUser(): AuthResponse["user"] | null {
  const rawUser = localStorage.getItem("hiredin.user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthResponse["user"];
  } catch {
    return null;
  }
}

function getStoredAuthState(): AuthState {
  const accessToken = getStoredAccessToken();
  const user = getStoredUser();
  const avatarUrl = localStorage.getItem("hiredin.avatarUrl");

  let role =
    getStoredRole() ??
    normalizeRole(user?.role) ??
    normalizeRole(user?.Role) ??
    normalizeRole((user as any)?.userRole) ??
    normalizeRole((user as any)?.UserRole);

  if (role != null) {
    localStorage.setItem("hiredin.userRole", String(role));
  }

  return {
    accessToken,
    user,
    role,
    avatarUrl,
    isAuthenticated: Boolean(accessToken && role != null),
  };
}

function getRoleFromAuth(auth: AuthResponse): UserRoleValue | null {
  const user = auth.user ?? auth.User;

  return (
    normalizeRole(user?.role) ??
    normalizeRole(user?.Role) ??
    normalizeRole((user as any)?.userRole) ??
    normalizeRole((user as any)?.UserRole) ??
    normalizeRole((auth as any).role) ??
    normalizeRole((auth as any).Role) ??
    normalizeRole((auth as any).userRole) ??
    normalizeRole((auth as any).UserRole)
  );
}

function emitAuthUpdate() {
  window.dispatchEvent(new Event("auth-update"));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getStoredAuthState);

  const refresh = () => {
    setAuthState(getStoredAuthState());
  };

  const login = (auth: AuthResponse) => {
    storeAuthResponse(auth);

    const accessToken =
      (auth as any).accessToken ??
      (auth as any).AccessToken ??
      (auth as any).token ??
      (auth as any).Token ??
      getStoredAccessToken();

    const user = auth.user ?? auth.User ?? null;
    const role = getRoleFromAuth(auth);
    const avatarUrl =
      user?.avatarUrl ??
      user?.AvatarUrl ??
      localStorage.getItem("hiredin.avatarUrl");

    if (accessToken) {
      localStorage.setItem("hiredin.accessToken", accessToken);
    }

    if (user) {
      localStorage.setItem("hiredin.user", JSON.stringify(user));
    }

    if (role != null) {
      localStorage.setItem("hiredin.userRole", String(role));
    }

    if (avatarUrl) {
      localStorage.setItem("hiredin.avatarUrl", avatarUrl);
    }

    setAuthState({
      accessToken,
      user,
      role,
      avatarUrl,
      isAuthenticated: Boolean(accessToken && role != null),
    });

    emitAuthUpdate();
  };

  const logout = () => {
    [
      "hiredin.accessToken",
      "hiredin.user",
      "hiredin.userId",
      "hiredin.userRole",
      "hiredin.resumeId",
      "hiredin.avatarUrl",
    ].forEach((key) => localStorage.removeItem(key));

    setAuthState({
      accessToken: null,
      user: null,
      role: null,
      avatarUrl: null,
      isAuthenticated: false,
    });

    emitAuthUpdate();
  };

  useEffect(() => {
    const handleStorage = () => setAuthState(getStoredAuthState());
    const handleAuthUpdate = () => setAuthState(getStoredAuthState());

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-update", handleAuthUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-update", handleAuthUpdate);
    };
  }, []);

  const value = useMemo(
    () => ({ ...authState, login, logout, refresh }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
