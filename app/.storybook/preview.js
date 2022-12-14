import "../src/assets/tailwind.css"


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#080A1D',
      },
      {
        name: 'white',
        value: '#fff'
      }
    ],
  },
}

