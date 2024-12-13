import {createEffect, createSignal, For, Show} from "solid-js"
import {getAllChatsByUserId} from "~/routes/chats/api"
import {useUserContext} from "~/shared/lib/useUserContext"
import {A, useNavigate} from "@solidjs/router"
import CreateChatWithUserModal from "~/shared/ui/createChatWithUserModal";

interface IChat {
    id: number
    previewMessage: string,
    recipient_name: string,
    lastMessageTime: Date,
}

export default function Chats() {
    const {userState} = useUserContext()

    const [chats, setChats] = createSignal<IChat[] | undefined>(undefined)

    const [isCreateChatModalVisible, setIsCreateChatModalVisible] = createSignal<boolean>(false)

    if (!userState.logged) {
        useNavigate()("/login")
    }

    createEffect(async () => {
        await getAllChatsByUserId(userState.id as number)
            .then(async res => {
                setChats((await res.json()).sort((c: IChat) => c.lastMessageTime))
            })
            .catch(err => {
                console.log(err)
            })
    })

    const handleCreateNewChatButtonClick = () => {
        setIsCreateChatModalVisible(true)
    }

    return (
        <>
            <div
                class="flex h-3/4 w-3/4 flex-col items-center justify-center rounded-lg border border-gray-500 overflow-auto">
                <ul class="w-full h-full flex flex-col">
                    <For each={chats()}>
                        {item =>
                            <li
                                class="inline-flex bg-gray-200 p-2 border-b border-gray-400 last:border-0 first:rounded-t-lg last:rounded-b-lg w-full text-xl font-medium hover:bg-sky-100"
                            >
                                <A href={`/chats/${item.id}`} class="w-full">
                                    <div class="border-b border-gray-300 pb-1">
                                        <span>Chat {item.id} with</span>

                                        <span class="ml-2 mr-auto font-semibold">{item.recipient_name}</span>

                                        <Show when={item.lastMessageTime}>
                                            <span>{new Date(item.lastMessageTime).toLocaleDateString()}</span>
                                        </Show>
                                    </div>

                                    <div class="pt-1">
                                        {item.previewMessage ? item.previewMessage : "No message in the chat now"}
                                    </div>
                                </A>
                            </li>
                        }
                    </For>

                    <button
                        class="ml-auto mr-2 my-2 p-2 bg-green-200 hover:bg-green-300 rounded-lg"
                        onclick={handleCreateNewChatButtonClick}
                    >
                        create new chat
                    </button>
                </ul>
            </div>

            <CreateChatWithUserModal
                isModalVisible={isCreateChatModalVisible()}
                setModalVisibility={setIsCreateChatModalVisible}
            />
        </>
    )
}
