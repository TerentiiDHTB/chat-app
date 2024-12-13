import {createStore} from "solid-js/store";
import {IUser} from "~/shared/lib/IUser";

export const [userState, setUserState] = createStore<Partial<IUser> & { logged: boolean }>({
    logged: false,
    id: undefined,
    email: undefined,
    name: undefined
})