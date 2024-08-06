"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, ChangeEvent, FormEvent } from "react";

interface Message {
  role: "User" | "Aurora";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userMessage: Message = { role: "User", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    const botMessage: Message = data.choices[0].message;
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-4 mb-4 w-full overflow-y-auto">
        <div className="p-2 bg-gray-100">How can I help you?</div>
        {messages.map((message, index) => (
          <div
            className={cn(
              message.role === "User" ? "bg-none" : "bg-gray-100",
              "p-2"
            )}
            key={index}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 mt-auto absolute left-0 right-0 bottom-0"
      >
        <Input className="w-full" onChange={handleInputChange} value={input} />
        <Button>Submit</Button>
      </form>
    </section>
  );
}