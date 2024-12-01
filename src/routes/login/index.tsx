import {createSignal, Match, Setter, Show, Switch} from "solid-js"
import {loginViaPassword} from "./api"
import {A} from "@solidjs/router";
import {IconEye} from "~/shared/ui/icons/IconEye";
import {IconEyeCrossed} from "~/shared/ui/icons/IconEyeCrossed";

interface IEmailErrors {
    email: string | null
    password: string | null
}

const onEmailSubmit = async (
    e: MouseEvent,
    email: string,
    password: string,
    setErrors: Setter<IEmailErrors>
): Promise<void> => {
    if (email.length) {
        setErrors((value) => ({...value, email: null}))
    } else {
        setErrors((value) => ({...value, email: "Email is required"}))
    }

    if (password.length) {
        setErrors((value) => ({...value, password: null}))
    } else {
        setErrors((value) => ({...value, password: "Password is required"}))
    }

    e.preventDefault()

    console.log(email, password)

    await loginViaPassword(email, password).then(res => console.log(res, "succes")).catch(err => console.log(err, "nope("))
}

const togglePasswordVisibility = (e:MouseEvent, setVisibility: Setter<"password" | "text">) => {
    e.preventDefault()
    setVisibility(visibility => visibility == "password" ? "text" : "password")
}

export default function email() {
    const [email, setEmail] = createSignal<string>("")
    const [password, setPassword] = createSignal<string>("")
    const [passwordInputType, setPasswordInputType] = createSignal<"password" | "text">("password")

    const [errors, setErrors] = createSignal<IEmailErrors>({
        email: null,
        password: null,
    })

    return (
        <div class="flex h-screen w-screen flex-col items-center justify-center">
            <form class="flex h-4/6 w-4/6 flex-col items-center justify-center rounded-md border border-black">
                <h1 class="mb-6 text-3xl font-bold">Please, log in!</h1>

                <div class="mb-3 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="email">
                        email
                    </label>

                    <input
                        value={email()}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        type="text"
                        class="mb-1 rounded-md border border-gray-700 px-2 py-1"
                    />

                    <Show when={errors().email}>
                        <small class="text-sm font-medium text-red-600">{errors().email}</small>
                    </Show>
                </div>

                <div class="mb-6 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="password">
                        Password
                    </label>

                    <div class="relative">
                        <input
                            value={password()}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type={passwordInputType()}
                            class="w-full mb-1 rounded-md border border-gray-700 px-2 py-1"
                        />

                        <button
                            class="absolute top-2 right-2"
                            onclick={e => togglePasswordVisibility(e, setPasswordInputType)}
                        >
                            <Switch>
                                <Match when={passwordInputType() === 'password'}>
                                    <IconEye
                                        class="peer-[type='password']:block h-4 w-4 stroke-gray-700 hover:stroke-gray-500 active:stroke-gray-400"
                                    />
                                </Match>
                                <Match when={passwordInputType() === 'text'}>
                                    <IconEyeCrossed
                                        class="h-4 w-4 stroke-gray-700 hover:stroke-gray-500 active:stroke-gray-400"
                                    />
                                </Match>
                            </Switch>
                        </button>
                    </div>

                    <Show when={errors().password}>
                        <small class="text-sm font-medium text-red-600">{errors().password}</small>
                    </Show>
                </div>

                <button
                    onClick={(e) => onEmailSubmit(e, email(), password(), setErrors)}
                    type="submit"
                    class="w-1/2 mb-2 rounded-md bg-gray-700 py-1 font-medium text-white hover:bg-gray-600 active:bg-gray-500"
                >
                    Log In
                </button>

                <div>
                    Do not have an account? <A class="text-sky-700 underline" href="/registration">Create one</A>
                </div>
            </form>
        </div>
    )
}
