import { AppUser } from "./AppUser"

export type AppUserFriend = {
    requesterId: string,
    addresseeId: string,
    isAccepted: boolean,
    requestedAt: Date,
    acceptedAt?: Date,
    requester: AppUser,
    addressee: AppUser,
}