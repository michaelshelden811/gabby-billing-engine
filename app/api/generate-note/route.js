import OpenAI from "openai"

export async function POST(req) {

  const body = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Convert shorthand peer support notes into AHCCCS compliant SOAIP documentation." },
      { role: "user", content: body.input }
    ]
  })

  return Response.json({
    result: completion.choices[0].message.content
  })
}