"use server"

import {PrismaClient} from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export const loginViaPassword = async (login: string, password: string) => {
    return await prisma.user.findFirstOrThrow({where: {email: login}})
        .then(async (res) => {
            const passwordEquality = await bcrypt.compare(password, res.password)

            if (passwordEquality) {
                return Promise.resolve(new Response(JSON.stringify(res), {status: 200}))
            } else {
                return Promise.reject(new Response(null, {status: 400, statusText: "Wrong email or password"}))
            }
        })
        .catch((err) => Promise.reject(new Response(err, {status: 400, statusText: "Wrong email or password"})))
}
