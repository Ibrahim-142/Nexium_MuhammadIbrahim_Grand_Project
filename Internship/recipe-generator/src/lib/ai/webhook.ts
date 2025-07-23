export async function generateRecipe(sessionId: string | undefined, chatInput: string) {
  const res = await fetch('http://localhost:5678/webhook/e41dc0ad-9a7f-4795-860d-a26f64bd1b85/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, chatInput }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate recipe.');
  }

  const data = await res.json();
  return data.output;
}
