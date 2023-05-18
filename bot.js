const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client({
    intents: [ 
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent
      ],
});
const config = require('./config.json');
const PREFIX = config.prefix;
const LOGINTOKEN = config.token;
const CHANNELID = config.channelId;
const APIKEY = config.apiKey;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return; // Ignore messages from other bots  
    if (msg.content.startsWith(PREFIX)) {
        const args = msg.content.substring(PREFIX.length).split(' ');
        const command = args[0].toLowerCase();
        if (command === 'checkrank') {
            if (args.length !== 2) {
                msg.reply('Please enter a summoner name');
                return;
            }
            const summonerName = args[1];
            try {
                const response = await axios.get(
                    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${APIKEY}`
                );
                const summonerID = response.data.id;
                msg.channel.send("Summoner ID: " + summonerID);
                console.log(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${APIKEY}`);
                const response2 = await axios.get(
                    `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${APIKEY}`
                );
                msg.channel.send(`${summonerName} is currently ranked ${response2.data[0].tier} ${response2.data[0].rank} ${response2.data[0].leaguePoints}LP. They're pobably hardstuck :)`);
            } catch (error){
                msg.channel.send(`Error: ${error}`);
                console.error(error);
            }
        }
    }
});
client.login(LOGINTOKEN);
