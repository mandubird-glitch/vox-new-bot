import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// API 키 설정 확인 (환경변수가 없으면 에러가 나도록 설정)
if (!process.env.GEMINI_API_KEY || !process.env.TOKEN) {
  console.error("환경 변수(API_KEY 또는 TOKEN)가 설정되지 않았습니다!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once('ready', () => {
  console.log('🖤 복스가 제미나이와 함께 깨어났어...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    // gemini-1.5-flash 모델 사용 (안정적인 최신 모델)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message.content);
    const response = await result.response;
    const text = response.text();
    
    message.reply(text);
  } catch (error) {
    console.error("AI 응답 오류:", error);
    message.reply("미안, 지금 AI랑 대화가 잘 안 돼.");
  }
});

client.login(process.env.TOKEN);
