import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export type ProfileIconProps = {
  imgUrl?: string | '';
};

export default function ProfileIcon({
  imgUrl,
}: ProfileIconProps) {

  const { user } = useAuth();

  return (
    <Link to="/settings">
      <Avatar>
        <AvatarImage src={imgUrl} />
        <AvatarFallback>
          {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
