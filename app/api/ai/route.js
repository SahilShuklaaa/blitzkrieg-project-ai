export async function POST(req) {
  try {
    const body = await req.json();
    const { clicksA, clicksB } = body;

    const prompt = `
Version A got ${clicksA} clicks.
Version B got ${clicksB} clicks.
Suggest 3 short ways to improve a lemonade shop website UI to increase conversions.
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("gemini response:", JSON.stringify(data, null, 2));

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n");

    if (!text) {
      text = `
• Add stronger urgency messaging near the CTA
• Highlight discounts more clearly
• Reduce friction by simplifying checkout steps
`;
    }

    return Response.json({ text });
  } catch (error) {
    console.error("AI route error:", error);

    return Response.json({
      text: `
• Add stronger urgency messaging near the CTA
• Highlight discounts more clearly
• Reduce friction by simplifying checkout steps
`,
    });
  }
}