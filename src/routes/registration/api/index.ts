"use server"

import {PrismaClient} from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const createNewUser = async (email: string, password: string, name: string) => {
    const passwordHash = await bcrypt.hash(password, 10)

    return await prisma.user
        .create({
            data: {
                email,
                password: passwordHash,
                name,
            },
        })
        .then((res) => Promise.resolve(new Response(JSON.stringify(res), {status: 200})))
        .catch((err) =>
            Promise.reject(new Response(JSON.stringify(err), {
                status: 400,
                statusText: "User with this email already exists"
            }))
        )


    // return new Promise(async (resolve, reject) => {
    //     await prisma.user.create({
    //         data: {
    //             email,
    //             password: passwordHash,
    //             name
    //         }
    //     }).then(res => res).catch(err => reject(err))
    // })
}
