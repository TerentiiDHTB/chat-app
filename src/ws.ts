"use server"

import {PrismaClient} from "@prisma/client";
import {eventHandler} from "vinxi/http";

type ChatStorage<T> = Record<string, Array<T>>

const prismaClient = new PrismaClient()

// @ts-ignore я не могу понять откуда берется класс Peer и не могу найти его с помощью IDE
const onlineChats: ChatStorage<Peer> = {}

const extractChatId = (peerUrl: string): number => Number(peerUrl.split("/").slice(-1)[0])

export default eventHandler({
    handler() {
    },
    websocket: {
        async open(peer) {
            const chatId = extractChatId(peer.url)

            if (chatId in onlineChats) {
                onlineChats[chatId].push(peer);
            } else {
                onlineChats[chatId] = [peer];
            }
        },
        async message(peer, msg) {
            const {message_body, author_id, recipient_id, chat_id} = JSON.parse(msg.text());

            const message = {
                author_id,
                message_body,
                recipient_id,
                is_read: false,
                chat_id,
                send_time: String(new Date().toISOString())
            }

            console.log(onlineChats, chat_id)
            onlineChats[chat_id].forEach((chat) => {
                chat.send(message)
            })

            await prismaClient.message.create({
                data: message,
            })
        },
        async close(peer, details) {
            const chatId = extractChatId(peer.url)

            if (chatId in onlineChats) {
                onlineChats[chatId] = onlineChats[chatId]?.filter(c => c?.id === peer.id)
            }

            console.log(onlineChats)
            console.log("close", peer.id, peer.url);
        },
        async error(peer, error) {
            console.log("error", peer.id, peer.url, error);
        },
    },
});