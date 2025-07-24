const webhookUrlRaw = process.env.NEXT_PUBLIC_WEBHOOK_URL
if (!webhookUrlRaw) {
  throw new Error('NEXT_PUBLIC_WEBHOOK_URL is not defined in environment variables.')
}
const WEBHOOK_URL: string = webhookUrlRaw
export async function generateRecipe(sessionId: string | undefined, chatInput: string): Promise<string> {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, chatInput }),
  })

  if (!res.ok) {
    throw new Error('Failed to generate recipe.')
  }

  const data = await res.json()
  return data.output
}

export async function initializeSession(email: string): Promise<void> {
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: email,
        chatInput: '__init__',
      }),
    })

    console.log('Assistant session initialized')
  } catch (err) {
    console.error('Failed to initialize assistant session:', err)
  }
}
