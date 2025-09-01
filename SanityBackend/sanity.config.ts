
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'
import './components/GlobalPDFHandler'  // Initialize global PDF handler

export default defineConfig({
  name: 'default',
  title: 'Eventapp',

  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',

  plugins: [structureTool({structure: deskStructure}), visionTool(), colorInput(), table()],

  schema: {
    types: schemaTypes,
  },

  cors: {
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://127.0.0.1:3000',
      'https://127.0.0.1:3000',
      'http://localhost:3001',
      'https://localhost:3001',
      'http://localhost:3333',
      'https://localhost:3333',
      'http://127.0.0.1:3333',
      'https://127.0.0.1:3333',
      'http://localhost:3334',
      'https://localhost:3334',
      'http://127.0.0.1:3334',
      'https://127.0.0.1:3334',
      'https://nursingeducationconferences.org',
      'https://nursing-conferences-cms.sanity.studio'
    ],
    credentials: true,
  },

  // Enable real-time updates
  useCdn: false,

  // Add development-specific settings
  ...(process.env.NODE_ENV === 'development' && {
    studioHost: 'localhost',
  }),

  // Add studio configuration for better connectivity
  studio: {
    components: {
      // Add custom studio components if needed
    }
  },

  // Add document actions for better editing experience
  // document: {
  //   // Enable real-time collaboration
  //   unstable_liveEdit: true,
  // },
})
