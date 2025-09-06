import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
const token = process.env.SANITY_API_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token, // read token is optional if dataset is public
})

export async function GET() {
  try {
    const query = `
      *[_type == "eventSchedule" && isActive == true] | order(displayOrder asc)[0]{
        "pdfUrl": schedulePdf.asset->url
      }
    `
    const data = await client.fetch<{ pdfUrl?: string }>(query)

    if (!data?.pdfUrl) {
      return NextResponse.json(
        { error: 'No schedule PDF found. Please upload a PDF in Sanity: Event Schedule -> "Schedule PDF".' },
        { status: 404 }
      )
    }

    // 302 redirect to the actual PDF URL so browser opens it in a new tab
    return NextResponse.redirect(data.pdfUrl, { status: 302 })
  } catch (err: any) {
    console.error('Error fetching schedule PDF from Sanity:', err)
    return NextResponse.json(
      { error: 'Failed to fetch schedule PDF from Sanity.' },
      { status: 500 }
    )
  }
}
