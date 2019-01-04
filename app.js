const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const HttpUtil = require('./http-util');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const httpUtil = new HttpUtil();

  if(command === "define") {
    if (args.join(" ") < 1){
      message.channel.send('Enter word[s] to define!');
    } else {
      httpUtil.httpsGetText('urbandictionary.com', `define.php?term=${args.join("+")}`)
        .then((text) => {
          let div_regex = /<div class="meaning">(.*?)<\/div>/g;
          let msg = text.match(div_regex);

          if (msg === null) {
            message.channel.send(`No result for query ${args.join(" ")}`);
          } else {
            let elem_regex = /<(.*?)>/g;
            let sym_regex = /&(.*?);/g;
            message.channel.send(msg[0].replace(elem_regex, "").replace(sym_regex, ""));
          }
        })
        .catch(e => console.log(e));  
    }   
  }
});

client.login(config.token);