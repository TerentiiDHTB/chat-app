"use server"

import bcrypt from "bcrypt";
import {prisma} from "~/shared/api/prismaClientInstance";

export const loginViaPassword = async (login: string, password: string) => {
    return await prisma.user.findFirstOrThrow({where: {email: login}})
        .then(async (res) => {
            const passwordEquality = await bcrypt.compare(password, res.password)

            if (passwordEquality) {
                return new Response(JSON.stringify(res), {
                    status: 200,
                    statusText: "Success",
                    headers: {"Content-Type": "application/json"}
                })
            } else {
                return Promise.reject(new Response(null, {
                    status: 400,
                    statusText: "Wrong email or password",
                    headers: {"Content-Type": "application/json"}
                }))
            }
        })
        .catch((err) => {
            return Promise.reject(new Response(JSON.stringify(err), {
                status: 400,
                statusText: "Wrong email or password",
                headers: {"Content-Type": "application/json"}
            }))
        })
}
