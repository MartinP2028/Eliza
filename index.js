const { error } = require("console");
const { Client } = require("discord.js");
const { OpenAI } = require("openai");

require("dotenv/config");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log("Bot is online");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  console.log("Message received");

  try {
    await message.channel.sendTyping();

    const prevMessages = await message.channel.messages.fetch({ limit: 15 });
    let conversationLog = [
      {
        role: "system",
        content:
          "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
      },
    ];

    prevMessages.forEach((msg) => {
      if (msg.author.id === message.author.id) {
        conversationLog.push({ role: "user", content: message.content });
      }
    });
    conversationLog.push({ role: "user", content: message.content });

    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationLog,
    });

    message.reply(result.choices[0].message.content);
    console.log(result.choices[0].message.content);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
