import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type ProfileIconProps = {
  imgUrl?: string;
};

export default function ProfileIcon({
  imgUrl,
}: ProfileIconProps) {

  return (
    <Link to="/settings">
      <Avatar>
        <AvatarImage src={imgUrl ?? "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"} />
      </Avatar>
    </Link>
  );
}
