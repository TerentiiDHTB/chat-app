import {Router} from "@solidjs/router";
import {FileRoutes} from "@solidjs/start/router";
import {Suspense} from "solid-js";
import "./app.css";
import {UserContext} from "~/shared/lib/userContext";
import {setUserState, userState} from "~/shared/lib/userStore";

export default function App() {

    return (
        <UserContext.Provider value={{userState, setUserState}}>
            <Router
                root={props => (
                    <>
                        <Suspense>{props.children}</Suspense>
                    </>
                )}
            >
                <FileRoutes/>
            </Router>
        </UserContext.Provider>
    );
}
