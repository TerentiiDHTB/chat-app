"use server"

import {prisma} from "~/shared/api/prismaClientInstance";

export const getAvailableForChatUsers = async (user_id: number) => {
    let user_chats: number[] = []

    await prisma.chat_Member.findMany({where: {member_id: user_id}, select: {chat_id: true}}).then(res => {
        user_chats = res.map(c => c.chat_id)
    })

    console.log(user_chats)

    let occupiedUsersIds: number[] = []

    await prisma.chat_Member.findMany({where: {chat_id: {in: user_chats}}})
        .then(res => occupiedUsersIds = res.map(u => u.member_id))

    console.log(occupiedUsersIds)

    return prisma.user.findMany({where: {id: {not: {in: occupiedUsersIds}}}, select: {id: true, name: true}})
}

export const createChatWithMembers = async (chat_creator_id: number, recipient_id: number) =>
    await prisma.chat.create({data: {}})
        .then(async chatRes =>
            await prisma.chat_Member.createMany({
                data: [
                    {
                        chat_id: chatRes.id, member_id: chat_creator_id
                    },
                    {
                        chat_id: chatRes.id, member_id: recipient_id
                    }
                ]
            })
                .then(res => new Response(JSON.stringify({chatId: chatRes.id, ...res}), {status: 200}))
                .catch(() => new Response(null, {status: 400, statusText: "An error occurred chat members"}))
        )
        .catch(() => new Response(null, {status: 400, statusText: "An error occurred while creating chat"}))