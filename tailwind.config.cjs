/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                extend: {
                    colors: {
                        red: {
                            DEFAULT: '#FC503C',
                            disabled: '#FF7B6B',
                            background: '#FFE9E5',
                            hover: '#FFE9E5',
                            pressed: '#FFD4CC',
                            tag: {background: '#FB2309'},

                            50: '#feeae7',
                            100: '#f5c4bd',
                            300: '#f39287',
                            400: '#f77f6f',
                            500: '#f66e5e',
                            600: '#f03932',
                            700: '#f03c32',
                            800: '#ec2e24',
                            900: '#ea180c',
                        },
                        purple: {
                            DEFAULT: '#AD15F4',
                            background: '#F9E0FF',
                            tag: {background: '#913CA6'},
                        },
                        green: {
                            DEFAULT: '#00A441',
                            background: '#C7F9CC',
                            hover: '#1E9B60',
                            pressed: '#198754',
                            disabled: '#6AE2A9',
                            tag: {background: '#1C8C40'},

                            100: '#ebfaf3',
                            500: '#1ea97c',
                            700: '#29c76f',
                        },
                        yellow: {
                            DEFAULT: '#ffb000',
                            background: '#FFF4D6',
                            disabled: '#FFDF99',
                            hover: '#EFA500',
                            tag: {background: '#EF8B17'},
                            100: '#fff9ea',
                        },
                        white: {
                            DEFAULT: '#FAFBFC',
                        },
                        grey: {
                            DEFAULT: '#666666',
                            50: '#EBF0F7',
                            100: '#D5DCE5',
                            200: '#BEC4CC',
                            300: '#ABB0B8',
                            400: '#93989E',
                            500: '#777B80',
                            600: '#5F6266',
                            700: '#47494D',
                            800: '#37393B',
                            900: '#242526',
                        },
                        black: {
                            DEFAULT: '#000F1A',
                            900: '#000F1A',
                            800: '#202020',
                            700: '#232323',
                            600: '#262626',
                            500: '#292929',
                            400: '#323232',
                            300: '#353535',
                            200: '#383838',
                            100: '#414141',
                        },
                    },
                    fontFamily: {
                        sans: ['Roboto', 'sans-serif'],
                    }
                }
            },
            plugins: []
        }
    }
}