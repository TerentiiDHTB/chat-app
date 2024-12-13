import {Setter} from "solid-js";
import {IMessage} from "~/shared/lib/IMessage";

export class ChatSocketClient {
    private socket: WebSocket | undefined;
    private readonly authorId: number | undefined;
    private readonly recipientId: number | undefined;
    private readonly chatId: number | undefined;

    constructor(chatId: number, authorId: number, recipientId: number, setMessages: Setter<IMessage[]>) {
        this.authorId = authorId
        this.recipientId = recipientId
        this.chatId = chatId
        this.socket = new WebSocket(`ws://localhost:3000/ws/${chatId}`);

        this.socket.onopen = (e) => {
        }

        this.socket.onclose = (e) => {
        };

        this.socket.onmessage = (e) => {
            console.log(e);
            const parsedMessage = JSON.parse(e.data);
            setMessages(value => [...value, {...parsedMessage}]);
        }
    }

    sendMessage(messageBody: string) {
        this.socket?.send(JSON.stringify({
            message_body: messageBody,
            author_id: this.authorId,
            recipient_id: this.recipientId,
            chat_id: this.chatId
        }));
    }

    closeSocket() {
        this.socket?.close();
        this.socket = undefined
    }
}
