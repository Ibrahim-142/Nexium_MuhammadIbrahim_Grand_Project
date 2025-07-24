import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import { SavedRecipe } from '../../../../models/SavedRecipee' 
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userEmail = url.searchParams.get('userEmail')
    const contentLabel = url.searchParams.get('contentLabel')

    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail parameter' }, { status: 400 })
    }

    await connectToDB()

    const filter: Partial<{
      userEmail: string
      contentLabel: 'recipe' | 'response'
    }> = { userEmail }

    if (contentLabel === 'recipe' || contentLabel === 'response') {
      filter.contentLabel = contentLabel
    }

    const recipes = await SavedRecipe.find(filter)

    return NextResponse.json({ success: true, data: recipes }, { status: 200 })
  } catch (error) {
    console.error('[GET_RECIPES_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
  }
}
