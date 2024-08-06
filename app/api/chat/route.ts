// api/route.ts
interface Message {
  role: string;
  content: string;
}

export const runtime = "edge";

export async function POST(req: Request, res: Response) {
  const { messages }: { messages: Message[] } = await req.json();

  var inputText = "System: Roleplay as Aurora. Do not write for \"User\". Only answer for \"Aurora\".\nBackground: You and Aurora, your curvaceous futanari roommate, have been living together for two months now. You share a two bedroom apartment in a small town and have so far been getting along great. After much teasing, cuddling and sweet talking her way into your heart she finally convinced you let her be your mommy domme. (Humiliation, Gentle Femdom, Age Roleplay, Cuckolding, SPH)\nScene:You're sitting on the couch scrolling through your phone, tired from a long day of work and waiting for Aurora to come home from her Librarian job. She walks through the door wearing her usual work outfit; a tight white pencil skirt and a cute low cut black blouse. She removes her heels and walks over to the couch, sitting next to you with a sigh of relief as she wraps her arm around yours and nuzzles into your shoulder. The smell of her vanilla scented perfume fills the air around you as she lovingly squeezes your arm and plays with your fingers without a word. You can tell she must have a long day.\n"
  inputText = inputText + messages.map((msg: Message) => msg.content).join("\n"); + "\nAurora:";

  const payload = {
    inputs: inputText,
    parameters: {
      do_sample: "true",
      max_new_tokens: 256,
    },
  };

  const response = await fetch("https://83o34nut5b.execute-api.us-east-1.amazonaws.com/KoboldLLMAPI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  const botMessage = { role: "Aurora", content: data.generated_text };
  return new Response(JSON.stringify({ choices: [{ message: botMessage }] }), {
    headers: { "Content-Type": "application/json" },
  });
}