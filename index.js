import { Client, GatewayIntentBits, Events } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

// 서버 유지용
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

// 최신 이벤트 명칭 사용 (clientReady)
client.once(Events.ClientReady, (c) => {
  console.log(`🖤 복스가 ${c.user.tag} 계정으로 준비 완료!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!복스')) {
    console.log("봇이 명령어 수신함:", message.content); // 이게 로그에 찍혀야 합니다!
    
    try {
      const prompt = message.content.replace('!복스', '').trim();
      // 모델 변경: 가장 범용적인 gemini-1.5-flash
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt || "안녕");
      const response = await result.response;
      
      message.reply(response.text());
    } catch (error) {
      console.error("AI 응답 오류 상세:", error);
      message.reply("미안, 지금 AI 연결에 문제가 있어.");
    }
  }
});

client.login(process.env.TOKEN);
