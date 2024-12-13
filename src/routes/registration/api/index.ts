"use server"

import bcrypt from "bcrypt"
import {prisma} from "~/shared/api/prismaClientInstance";

export const createNewUser = async (email: string, password: string, name: string) => {
    const passwordHash = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            name,
        },
    })
        .then((res) => new Response(JSON.stringify(res), {status: 200}))
        .catch((err) => Promise.reject(new Response(JSON.stringify(err), {
                status: 400,
                statusText: `User with this ${err.meta.target[0]} already exists`
            }))
        )
}
