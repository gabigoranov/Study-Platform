import type { ProfileIconProps } from "./ProfileIcon";
import ProfileIcon from "./ProfileIcon";

type LoginComponentProps = {
    iconProps: ProfileIconProps;
    isAuth: boolean;
}

export default function LoginComponent({ iconProps, isAuth }: LoginComponentProps) {
    return (
        isAuth ? (
            <ProfileIcon {...iconProps} />
        ) : (
            <div className="flex gap-2 items-center">
                <a href="#" className="text-lg text-text-muted hover:text-text hover:cursor-pointer">Login</a>
                <a href="#"className="text-lg text-text-muted hover:text-text hover:cursor-pointer">Sign Up</a>
            </div>
        )
    );
}
