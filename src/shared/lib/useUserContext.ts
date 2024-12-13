import {Context, useContext} from "solid-js";
import {UserContext} from "~/shared/lib/userContext";

export const useUserContext = () => {
    const userContext = useContext(UserContext)

    if (!userContext) {
        throw new Error("User context is missing!")
    }

    return userContext
}