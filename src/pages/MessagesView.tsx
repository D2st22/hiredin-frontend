import { Navigate } from "react-router-dom";
import ChatApiView from "../components/ChatApiView";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../services/hiredInTypes";

export default function MessagesView() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/candidateLogin" replace />;
  }

  if (role === UserRole.Admin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <ChatApiView mode={role === UserRole.Employer ? "company" : "candidate"} />
  );
}
