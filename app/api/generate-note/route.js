import OpenAI from "openai"

export async function POST(req) {
  try {

    const body = await req.json()

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a peer support billing documentation assistant. Convert shorthand peer support notes into AHCCCS compliant SOAIP documentation. Use recovery-oriented language and refer to individuals only as 'client'."
        },
        {
          role: "user",
          content: body.note
        }
      ]
    })

    return Response.json({
      result: completion.choices[0].message.content
    })

  } catch (error) {

    console.error(error)

    return Response.json(
      { error: "Failed to generate note" },
      { status: 500 }
    )
  }
}