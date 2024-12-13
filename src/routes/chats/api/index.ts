"use server"

import {prisma} from "~/shared/api/prismaClientInstance"

export const getRecipientById = async (chat_id: number, author_id: number) =>
    await prisma.chat_Member.findFirst({where: {chat_id: chat_id, member_id: {not: author_id}}})
        .then(async res => {

                if (res) {
                    return prisma.user.findFirst({where: {id: res.member_id}})
                        .then(res => new Response(JSON.stringify(res), {status: 200}))
                } else {
                    return new Response(null, {status: 400, statusText: "Error while getting user"})
                }
            }
        )
        .catch(() => new Response(null, {status: 400, statusText: "Error while getting user"}))

export const getMessagesByChatId = async (chat_id: number) =>
    await prisma.message.findMany({where: {chat_id: chat_id}, orderBy: {id: "asc"}})

export const getAllChatsByUserId = async (user_id: number) =>
    await prisma.chat_Member.findMany({
        where: {member_id: {equals: user_id}},
        select: {chat_id: true},
    }).then(async chats => {
            const chat_ids: Array<{
                id: number,
                recipient_name?: string,
                last_message_time: Date | null,
                previewMessage?: string,
            }> = await prisma.chat.findMany({where: {id: {in: chats.map(chat => chat.chat_id)}},})
            for (const chat of chat_ids) {
                const chat_recipient = await prisma.chat_Member.findFirst({
                    where: {
                        chat_id: chat.id,
                        member_id: {not: user_id}
                    },
                    select: {user: true}
                })

                const chatLastMessage = await prisma.message.findFirst({
                    where: {chat_id: {equals: chat.id}},
                    orderBy: {id: "desc"}
                })

                chat["recipient_name"] = chat_recipient?.user.name
                chat["previewMessage"] = chatLastMessage?.message_body || "there is no messages in the chat now"
            }

            return new Response(JSON.stringify(chat_ids), {status: 200})
        }
    )
        .catch(() => new Response(null, {status: 400, statusText: "error"}))

