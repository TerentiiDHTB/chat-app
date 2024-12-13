import {Portal} from "solid-js/web";
import {createEffect, createSignal, For, onMount, Setter, Show} from "solid-js";
import {createChatWithMembers, getAvailableForChatUsers} from "~/shared/ui/createChatWithUserModal/api";
import {useUserContext} from "~/shared/lib/useUserContext";
import {useNavigate} from "@solidjs/router";


export const CreateChatWithUserModal = (props: { isModalVisible: boolean, setModalVisibility: Setter<boolean> }) => {
    const {userState} = useUserContext()

    const [availableChatUsers, setAvailableChatUsers] = createSignal<Array<{ id: number, name: string }>>([])

    const navigate = useNavigate()

    createEffect(async () => {
        if (props.isModalVisible && userState.id) {
            getAvailableForChatUsers(userState.id).then(res => setAvailableChatUsers(res)).catch(err => console.log(err))
        }
    })

    const handleCreateChatWithUserButtonClick = async (recipientId: number) => {
        if (userState.id) {
            await createChatWithMembers(userState.id, recipientId).then(async  res => {
                const body = await res.json()

                console.log(body)

                if ('chatId' in body) {
                    navigate(`/chats/${body.chatId}`)
                }
            }).catch(err => console.log(err))
        }
    }

    const handleCloseChatButtonClick = () => {
        props.setModalVisibility(false)
    }

    return (
        <Show when={props.isModalVisible}>
            <Portal>
                <div class="absolute bg-gray-500/20 w-full h-full flex top-0 right-0">
                    <div class="w-2/3 h-3/4 m-auto p-4 border border-gray-300 rounded-lg bg-white">
                        <div class="flex flex-row items-center justify-between">
                            <h1 class="text-2xl font-bold leading-none">Choose user for chatting</h1>

                            <button class="bg-red-400 rounded-full hover:bg-red-500 p-2 text-white" onclick={handleCloseChatButtonClick}>
                                exit
                            </button>
                        </div>


                        <ul class="w-full h-full mt-8 flex flex-col gap-2">
                            <For each={availableChatUsers()}>
                                {(item, value) =>
                                    <li class="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-lg p-2">
                                        <button class="w-full h-full" onclick={() => handleCreateChatWithUserButtonClick(item.id)}>
                                            {item.name}
                                        </button>
                                    </li>
                                }
                            </For>
                        </ul>
                    </div>
                </div>
            </Portal>
        </Show>

    )
}