import {createContext} from "solid-js";
import {setUserState, userState} from "~/shared/lib/userStore";

export const UserContext = createContext({userState, setUserState});