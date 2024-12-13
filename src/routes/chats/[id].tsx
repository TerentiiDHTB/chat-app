import {useNavigate, useParams} from "@solidjs/router";
import {createEffect, createSignal, For, onCleanup, onMount, Setter, Suspense} from "solid-js";
import {getMessagesByChatId, getRecipientById} from "~/routes/chats/api";
import {IMessage} from "~/shared/lib/IMessage";
import {useUserContext} from "~/shared/lib/useUserContext";
import ChatSocketClient from "~/features/chatSocketClient";

const sendMessage = (client: ChatSocketClient | undefined, messageBody: string, setMessageBody: Setter<string>) => {
    if (client) {
        client.sendMessage(messageBody)
    }
    setMessageBody("")
}

export default function Chat() {
    const {userState} = useUserContext()

    const [recipient, setRecipient] = createSignal<{ id: number, name: string } | undefined>(undefined)

    const [messages, setMessages] = createSignal<Array<IMessage>>([])

    const [chatSocketInstance, setChatSocketInstance] = createSignal<ChatSocketClient | undefined>(undefined)

    const [messageBody, setMessageBody] = createSignal<string>("")

    const routeParams = useParams()

    if (!userState.logged) {
        useNavigate()("/login")
    }

    onMount(async () => {
        if (userState.id) {
            await getRecipientById(Number(routeParams.id), userState.id)
                .then(async res => {
                    const body = await res.json()

                    console.log(body)

                    if (body) {
                        setRecipient(body)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            await getMessagesByChatId(Number(routeParams.id)).then(res => setMessages(res)).catch(err => console.log(err))

            setChatSocketInstance(new ChatSocketClient(Number(routeParams.id), userState.id, recipient()?.id as number, setMessages))
        }
    })

    createEffect(() => {
        messages() //необходимо вызвать геттер переменной чтобы эффект зависел от нее

        const container = document.getElementById("messages-container")

        if (container) {
            container.scrollIntoView({behavior: "smooth", block: "end"})
        }
    })

    onCleanup(
        () => {
            chatSocketInstance()?.closeSocket()
        }
    )

    return (
        <>
            <Suspense fallback={<>loading...</>}>
                <h1 class="text-2xl font-bold">
                   Chat with {recipient()?.name}
                </h1>

                <div class="w-3/4 h-3/4 p-2 border border-gray-500 rounded-xl flex flex-col justify-end">
                    <div class="w-full h-full flex overflow-auto">
                        <ul id="messages-container"
                            class="py-3 w-full h-fit flex flex-col gap-4 justify-end text-lg font-medium">
                            <For each={messages()}>
                                {(value, idx) =>
                                    <li class="flex flex-col w-[40%] h-fit data-[user-message-author='false']:mr-auto data-[user-message-author='true']:ml-auto"
                                        data-user-message-author={Number(value.author_id) === userState.id}
                                    >
                                        <span
                                            class="w-full text-wrap break-all whitespace-normal p-2 border-gray-500 bg-green-100 rounded-lg "
                                        >
                                            {value.message_body}
                                        </span>

                                        <small class="text-sm font-bold">
                                            {new Date(value.send_time).toLocaleString()}
                                        </small>
                                    </li>
                                }
                            </For>
                        </ul>
                    </div>


                    <div class="h-20 flex flex-row">
                        <textarea
                            placeholder="type your message here"
                            class="w-full resize-none border border-gray-500 rounded-l-lg p-1 text-lg font-bold leading-tight"
                            onchange={e => {
                                setMessageBody(e.target.value)
                            }}
                        />
                        <button
                            class="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-lg font-bold leading-tight rounded-r-lg"
                            onclick={() => sendMessage(chatSocketInstance(), messageBody(), setMessageBody)}
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            </Suspense>
        </>
    )
}