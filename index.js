'use strict';

require('dotenv').config()
const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();

let qaQ = "";
let qaAns = "";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  let isAtMe = false;
  const isChuck = (msg.content.toLowerCase().includes('chuck'));
  const isTrivia = (msg.content.toLowerCase().includes('trivia'));
  const isAns = (msg.content.toLowerCase().includes('trivia') && msg.content.toLowerCase().includes('answer'));

  msg.mentions.users.forEach((mention) => {
    if (mention.bot && mention.username === 'butlerbaggins') isAtMe = true;
  });
  if (isAtMe) {
    console.log(msg);
    if (isAns) {
      msg.reply(`The answer was ${qaAns}.`);
    }
    else if (isTrivia) {
      fetch('https://jservice.io/api/random')
      .then(res => res.json())
      .then((json) => {
        const [qa] = json;
        const {question, answer, value, category} = qa;
        const {title} = category;

        qaQ = question.toLowerCase();
        qaAns = answer.toLowerCase();
        msg.reply(`${title} for ${value}... ${question}?`);
      });
    }
    else if (isChuck) {
      fetch('https://api.chucknorris.io/jokes/random')
      .then(res => res.json())
      .then((json) => {
        const {value} = json;
        msg.reply(value);
      });
    }
    else {
      fetch('https://the-one-api.dev/v2/character/5cd99d4bde30eff6ebccfc38/quote', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.LOTR_API_KEY}`
        }
      })
      .then(res => res.json())
      .then((json) => {
        const {docs} = json;
        const ri = getRandomInt(0, docs.length - 1);
        msg.reply(docs[ri].dialog.replace(/\s+/g, ' ').trim());
      })
      .catch((e) => {
        console.log(e);
      });
    }
  }
  
});

client.login(`${process.env.DISCORD_TOKEN}`);
