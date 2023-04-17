import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Viject',
  description: 'Ejecting and Migrating tool for Vite compatible with Create React App (react-scripts)',
  base: "/viject/",
  themeConfig: {
    search: {
      provider: 'local'
    }
  }
})
