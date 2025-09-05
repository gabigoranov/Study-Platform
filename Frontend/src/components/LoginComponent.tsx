import { useAuth } from "../hooks/useAuth";
import type { ProfileIconProps } from "./ProfileIcon";
import ProfileIcon from "./ProfileIcon";

type LoginComponentProps = {
    iconProps: ProfileIconProps;
}

export default function LoginComponent({ iconProps }: LoginComponentProps) {
    const { user } = useAuth();

    return (
        user ? (
            <ProfileIcon {...iconProps} />
        ) : (
            <div className="flex gap-2 items-center">
                <a href="/signin"className="text-lg text-text-muted hover:text-text hover:cursor-pointer">Sign In</a>
            </div>
        )
    );
}
