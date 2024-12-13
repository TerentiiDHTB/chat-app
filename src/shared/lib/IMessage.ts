export interface IMessage {
    id: number;
    chat_id: number;
    author_id: number;
    recipient_id: number;
    message_body: string;
    is_read: boolean;
    send_time: Date;
}