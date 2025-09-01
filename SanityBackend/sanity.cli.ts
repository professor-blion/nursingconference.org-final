import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'fl5uetho',
    dataset: 'production'
  },
  studioHost: 'nursing-conferences-cms',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   * Updated: 2025-07-30 - Force schema refresh for multi-currency fields
   */
  autoUpdates: true,
})
