import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

http.createServer((req, res) => {
  res.write("I am alive");
  res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once('ready', () => {
  console.log('🖤 봇이 온라인입니다!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // 명령어 !복스가 있는지 확인
  if (message.content.startsWith('!복스')) {
    console.log("명령어 감지됨:", message.content); // 로그에 찍히는지 확인
    
    try {
      const prompt = message.content.replace('!복스', '').trim();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt || "안녕");
      const response = await result.response;
      message.reply(response.text());
    } catch (error) {
      console.error("AI 응답 오류:", error);
      message.reply("연결 문제 발생!");
    }
  }
});

client.login(process.env.TOKEN);
