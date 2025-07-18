import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import { SavedRecipe } from '../../../../models/SavedRecipee'

export async function POST(req: Request) {
  try {
    const { userEmail, recipeName, recipeContent } = await req.json()

    if (!userEmail || !recipeName || !recipeContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectToDB()
    const newRecipe = await SavedRecipe.create({
      userEmail,
      recipeName,
      recipeContent,
    })

    return NextResponse.json({ success: true, data: newRecipe })
  } catch  {
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 })
  }
}
