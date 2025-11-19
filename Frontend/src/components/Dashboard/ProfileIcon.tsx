import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/Supabase/useAuth";
import CurrentUserAvatar from "../current-user-avatar";

export default function ProfileIcon() {
  return (
    <Link to="/settings">
      <CurrentUserAvatar />
    </Link>
  );
}
