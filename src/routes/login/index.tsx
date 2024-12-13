import {createSignal, Match, Setter, Show, Switch, useContext} from "solid-js"
import {loginViaPassword} from "./api"
import {A, useNavigate} from "@solidjs/router";
import {IconEye} from "~/shared/ui/icons/IconEye";
import {IconEyeCrossed} from "~/shared/ui/icons/IconEyeCrossed";
import {UserContext} from "~/shared/lib/userContext";

interface ILoginErrors {
    email: string | null,
    password: string | null,
    submitErrors: string | null,
}

//todo: вынести функцию в model
const onLoginSubmit = async (
    email: string,
    password: string,
    setErrors: Setter<ILoginErrors>
): Promise<void> => {
    let isFormValid: boolean = false

    if (email.length) {
        setErrors((value) => ({...value, email: null}))
        isFormValid = true
    } else {
        setErrors((value) => ({...value, email: "Email is required"}))
    }

    if (password.length) {
        setErrors((value) => ({...value, password: null}))
        isFormValid = true
    } else {
        setErrors((value) => ({...value, password: "Password is required"}))
    }

    if (isFormValid) {
        return await loginViaPassword(email, password)
            .then(async res => {
                const {setUserState} = useContext(UserContext)
                setUserState('logged', true)
                setUserState(await res.json())
            })
            .catch((err) => {
                if (err.status === 400) {
                    setErrors(value => ({...value, submitErrors: err.statusText}))
                } else {
                    setErrors(value => ({...value, submitErrors: err.statusText}))
                }
                return Promise.reject()
            })
    }
}

const togglePasswordVisibility = (e: MouseEvent, setVisibility: Setter<"password" | "text">) => {
    e.preventDefault()
    setVisibility(visibility => visibility == "password" ? "text" : "password")
}

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = createSignal<string>("")
    const [password, setPassword] = createSignal<string>("")
    const [passwordInputType, setPasswordInputType] = createSignal<"password" | "text">("password")

    const [isFormDisabled, setIsFormDisabled] = createSignal<boolean>(false)

    const [errors, setErrors] = createSignal<ILoginErrors>({
        email: null,
        password: null,
        submitErrors: null,
    })

    const handleSubmitForm = async (e: SubmitEvent) => {
        e.preventDefault()

        setIsFormDisabled(true)

        await onLoginSubmit(email(), password(), setErrors)
            .then(() => {
                navigate('/chats')
            }).finally(() => {
                setIsFormDisabled(false)
            })
    }

    return (
        <div class="flex h-screen w-screen flex-col items-center justify-center">
            <form
                class="flex h-4/6 w-4/6 flex-col items-center justify-center rounded-md border border-black"
                onSubmit={handleSubmitForm}
                method="post"
            >
                <h1 class="mb-6 text-3xl font-bold">Please, log in!</h1>

                <div class="mb-3 flex w-1/2 flex-col">
                    <label class="mb-2 text-lg font-medium" for="email">
                        Email
                    </label>

                    <input
                        value={email()}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        type="text"
                        class="mb-1 rounded-md border border-gray-700 px-2 py-1"
                        disabled={isFormDisabled()}
                    />

                    <Show when={errors().email}>
                        <small class="text-sm font-medium text-red-600">{errors().email}</small>
                    </Show>
                </div>

                <div class="mb-6 flex w-1/2 flex-col">
                    <label class="mb-2 text-lg font-medium" for="password">
                        Password
                    </label>

                    <div class="relative">
                        <input
                            value={password()}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type={passwordInputType()}
                            class="w-full mb-1 rounded-md border border-gray-700 px-2 py-1"
                            disabled={isFormDisabled()}
                        />

                        <button
                            class="absolute top-2 right-2"
                            onclick={e => togglePasswordVisibility(e, setPasswordInputType)}
                            disabled={isFormDisabled()}
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
                    type="submit"
                    class="w-1/2 mb-2 rounded-md bg-gray-700 py-1 font-medium text-white hover:bg-gray-600 active:bg-gray-500"
                    disabled={isFormDisabled()}
                >
                    Log In
                </button>

                <Show when={errors().submitErrors}>
                    <small class="mb-2 text-sm font-medium text-red-600">
                        {errors().submitErrors}
                    </small>
                </Show>

                <div>
                    Do not have an account&nbsp;
                    <A class="text-sky-700 underline" href="/registration">Create one</A>
                </div>
            </form>
        </div>
    )
}
