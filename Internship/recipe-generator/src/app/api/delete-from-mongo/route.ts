import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import { SavedRecipe } from '../../../../models/SavedRecipee'
import { Types } from 'mongoose'

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('_id')

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing _id' }, { status: 400 })
    }

    await connectToDB()

    const result = await SavedRecipe.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE_RECIPE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}
