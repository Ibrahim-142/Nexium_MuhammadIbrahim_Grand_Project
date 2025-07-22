import mongoose, { Schema, models } from 'mongoose'

const SavedRecipeSchema = new Schema({
  userEmail: { type: String, required: true },
  recipeName: { type: String, required: true },
  recipeContent: { type: String, required: true },
  contentLabel: { type: String, enum: ['recipe', 'response'], default: 'response' } 
}, { timestamps: true })


export const SavedRecipe = models.SavedRecipe || mongoose.model('SavedRecipe', SavedRecipeSchema)
