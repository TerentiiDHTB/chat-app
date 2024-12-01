import {createSignal, Setter, Show} from "solid-js"
import {createNewUser} from "~/routes/registration/api";
import {A} from "@solidjs/router";

interface IRegistrationErrors {
    email: string | null,
    password: string | null,
    confirmPassword: string | null,
    name: string | null,
}

const onRegistrationSubmit = async (
    e: MouseEvent,
    email: string,
    password: string,
    name: string,
    confirmPassword: string,
    setErrors: Setter<IRegistrationErrors>
): Promise<void> => {
    let isValid = false

    if (email.length) {
        setErrors((value) => ({...value, email: null}))
        isValid = true
    } else if (!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
        setErrors((value) => ({...value, email: "Field must be valid email"}))
    }

    if (name.length) {
        setErrors((value) => ({...value, name: null}))
        isValid = true
    } else {
        setErrors((value) => ({...value, name: "Name is required"}))
    }

    if (password.length) {
        setErrors((value) => ({...value, password: null}))
        isValid = true
    } else {
        setErrors((value) => ({...value, password: "Password is required"}))
    }

    if (confirmPassword.length) {
        if (confirmPassword !== password) {
            setErrors((value) => ({...value, confirmPassword: "Passwords is not equal"}))
        } else {
            setErrors((value) => ({...value, confirmPassword: null}))
            isValid = true
        }
    } else {
        setErrors((value) => ({...value, confirmPassword: "Confirm password is required"}))
    }

    e.preventDefault()

    if (isValid) {
        await createNewUser(email, password, name).then(res => console.log(res, "success")).catch(err => console.log(err, "nope("))
    }
}

export default function Registration() {
    const [email, setemail] = createSignal<string>("")
    const [password, setPassword] = createSignal<string>("")
    const [confirmPassword, setConfirmPassword] = createSignal<string>("")
    const [name, setName] = createSignal<string>("")
    const [errors, setErrors] = createSignal<IRegistrationErrors>({
        email: null,
        password: null,
        confirmPassword: null,
        name: null,
    })

    return (
        <div class="flex h-screen w-screen flex-col items-center justify-center">
            <form class="flex h-4/6 w-4/6 flex-col items-center justify-center rounded-md border border-black">
                <h1 class="mb-6 text-3xl font-bold">Registration</h1>

                <div class="mb-3 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="name">
                        Your name
                    </label>

                    <input
                        value={name()}
                        onChange={(e) => setName(e.target.value)}
                        id="name"
                        type="text"
                        class="mb-1 rounded-md border border-gray-700 px-2 py-1"
                    />

                    <Show when={errors().name}>
                        <small class="text-sm font-medium text-red-600">{errors().name}</small>
                    </Show>
                </div>

                <div class="mb-3 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="email">
                        email
                    </label>

                    <input
                        value={email()}
                        onChange={(e) => setemail(e.target.value)}
                        id="email"
                        type="text"
                        class="mb-1 rounded-md border border-gray-700 px-2 py-1"
                    />

                    <Show when={errors().email}>
                        <small class="text-sm font-medium text-red-600">{errors().email}</small>
                    </Show>
                </div>

                <div class="mb-3 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="password">
                        Password
                    </label>

                    <input
                        value={password()}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        type="password"
                        class="mb-1 rounded-md border border-gray-700 px-2 py-1"
                    />

                    <Show when={errors().password}>
                        <small class="text-sm font-medium text-red-600">{errors().password}</small>
                    </Show>
                </div>

                <div class="mb-6 flex w-1/2 flex-col">
                    <label class="mb-2 font-medium" for="confirm_password">
                        Confirm password
                    </label>

                    <input
                        value={confirmPassword()}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        id="confirm_password"
                        class=" mb-1 rounded-md border border-gray-700 px-2 py-1"
                    />

                    <Show when={errors().confirmPassword}>
                        <small class="text-sm font-medium text-red-600">{errors().confirmPassword}</small>
                    </Show>
                </div>


                <button
                    onClick={(e) => onRegistrationSubmit(e, email(), password(), name(), confirmPassword(), setErrors)}
                    type="submit"
                    class="w-1/2 mb-2 rounded-md bg-gray-700 py-1 font-medium text-white hover:bg-gray-600 active:bg-gray-500"
                >
                    Register
                </button>

                <div class="mb-2">Already have an account? <A href="/login" class="text-sky-600 underline">Log in</A>
                </div>
            </form>
        </div>
    )
}
