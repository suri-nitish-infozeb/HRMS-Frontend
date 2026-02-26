# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

<!-- 
{
    "reply": "| Job Title                           | Department          | Resume Count | Career Page Link                                                                                  | Resume Links                                                                                     |\n|-----------------------------------|---------------------|--------------|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|\n| Senior Business Development Manager | Business Development | 0            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmlzpkv74000ss8h6maaz2uhh) | None                                                                                           |\n| Untitled Position                  | R&D Engineering      | 3            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmljg30e10010s1gzxji0zh4x) | Resumes available in system                                                                    |\n| Senior Sales Development Manager   | Sales                | 0            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmlznew000015s8h8eyrdj0vt) | None                                                                                           |\n| Senior Business Development Manager | Business Development | 0            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmlzl8x9m001hqgh0gghje787) | None                                                                                           |\n| SDE Intern                        | Engineering          | 0            | -                                                                                               | None                                                                                           |\n| Senior Business Development Manager | Business Development | 0            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmltpqjzk005arth0epvhufy8) | None                                                                                           |\n| Play Group Teacher                | Teaching             | 0            | -                                                                                               | None                                                                                           |\n| Senior Business Development       | Business Development | 1            | [Career Page](https://hrms-chat-api-e7eff0e2hvgphqh0.centralindia-01.azurewebsites.net/careers/cmlrp4txb0004qpgzsevlde2t) | Resume available in system                                                                     |\n| Senior Digital Marketing Specialist | Marketing            | 0            | -                                                                                               | None                                                                                           |\n\nLet me know if you want me to retrieve specific resumes or candidate details for any job.",
    "jdReady": true
}


{} -->