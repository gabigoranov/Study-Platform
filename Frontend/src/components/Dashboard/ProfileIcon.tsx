import { Link } from "react-router";

export type ProfileIconProps = {
  imgUrl?: string;
  notifications: number;
};

export default function ProfileIcon({
  imgUrl,
  notifications,
}: ProfileIconProps) {

  return (
    <Link to="/settings">
      <div className={`relative rounded-full`}>
        <img
          src={
            imgUrl ??
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          }
          className="w-14 h-14 rounded-full"
        ></img>
        <p className="absolute bottom-[-0.4rem] left-1/2 translate-x-[-50%] text-xs text-white font-bold bg-neutral-500 px-4 py-1 rounded-full">
          {notifications}
        </p>
      </div>
    </Link>
  );
}
