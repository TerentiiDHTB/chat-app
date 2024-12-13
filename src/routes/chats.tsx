import {A, RouteSectionProps, useNavigate} from "@solidjs/router";
import {useUserContext} from "~/shared/lib/useUserContext";
import {Portal} from "solid-js/web";
import {createSignal, Show} from "solid-js";
import CreateChatWithUserModal from "~/shared/ui/createChatWithUserModal";

export default function ChatsBaseLayout(props: RouteSectionProps) {
    const {userState} = useUserContext()

    const navigate = useNavigate();

    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = createSignal<boolean>(false)

    const handleLogoutButtonClick = async () => {
        const {setUserState} = useUserContext()
        setUserState({})
        navigate("/login")
    }

    return (
        <>
            <div class="flex flex-col w-screen h-screen">
                <header
                    class="grid grid-cols-3 flex-row-reverse items-end justify-end gap-2 w-full h-14 border-b border-gray-700">
                    <div class="col-start-2 h-full flex flex-row justify-center items-end">
                        <A href="/chats"
                           class="p-2 font-medium text-lg justify-self-center transition-all duration-150"
                           activeClass="bg-gray-200 rounded-t-lg"
                           inactiveClass="hover:text-sky-700 hover:underline"
                        >
                            Chats
                        </A>

                        <A href={`/profile/${userState.id}`}
                           class="p-2 font-medium text-lg hover:text-sky-700 hover:underline transition-all duration-150"
                           activeClass="bg-grey-200 rounded-t-lg"
                        >
                            My profile
                        </A>
                    </div>

                    <div id="top-nav-menu-button" class="w-44 relative ml-auto mr-1">
                        <button
                            class="w-full p-2 border border-b-0 rounded-t-lg border-gray-700"
                            onclick={() => setIsOptionsMenuVisible(prev => !prev)}
                        >
                            {userState.name}
                        </button>
                    </div>
                </header>

                <div class="w-full h-[calc(100%-3.5rem)] flex flex-col justify-center items-center">
                    {props.children}
                </div>

                <Show when={isOptionsMenuVisible()}>
                    <Portal mount={document.getElementById("top-nav-menu-button") || undefined}>
                        <button
                            onClick={handleLogoutButtonClick}
                            class="absolute w-full mt-[1px] p-2 top-10 right-0 bg-red-500 hover:bg-red-600 text-white border border-gray-500 rounded-b-lg"
                        >
                            Logout
                        </button>
                    </Portal>
                </Show>
            </div>

        </>
    )
}