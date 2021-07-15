const config = require('config');
const Discord = require('discord.js');
const {
	DiscordInteractions,
	ApplicationCommandOptionType: OptionType
} = require('slash-commands');
const parse = require('./parseCmd');

const client = new Discord.Client();

client.login(config.get('token'));

client.on('ready', () => {
	console.log('logined!');
	client.ws.on('INTERACTION_CREATE', i => parse(i, client));
});

// register commands
const interaction = new DiscordInteractions({
	applicationId: config.get('appID'),
	authToken: config.get('token'),
	publicKey: config.get('publicKey'),
});

// delete command
// const delCmd = ['865065460683505685', '865110899685720065', '865112530368069652'];
// delCmd.forEach(i => interaction.deleteApplicationCommand(i, null).then(console.log, console.error));

// list commands
interaction
	.getApplicationCommands()
	.then(console.log)
	.catch(console.error);

// const cmdPing = {
//     name: "ping",
//     description: "ping server",
//     options: [
//         {
//             name: "n",
//             description: "times to ping",
//             type: OptionType.INTEGER
//         },
//     ],
// };

const cmdServer = {
	name: 'server',
	description: 'manage channels in the list',
	options: [
		{
			name: 'listen',
			description: 'Add url to the channel listening list',
			type: OptionType.SUB_COMMAND,
			options: [
				{
					name: 'url',
					description: 'url to monitor',
					required: true,
					type: OptionType.STRING
				},
				{
					name: 'channel',
					description: 'On which channel the message will be displayed',
					required: false,
					type: OptionType.CHANNEL
				}
			]
		},
		{
			name: 'remove',
			description: 'Remove url from channel listening list',
			type: OptionType.SUB_COMMAND,
			options: [
				{
					name: 'url',
					description: 'url to monitor',
					required: true,
					type: OptionType.STRING
				},
				{
					name: 'channel',
					description: 'On which channel the message will be displayed',
					required: false,
					type: OptionType.CHANNEL
				}
			]
		},
		{
			name: 'list',
			description: 'Show channel listening list',
			type: OptionType.SUB_COMMAND
		}
	]
};

interaction.createApplicationCommand(cmdServer, config.get('guildID'))
	.then(console.log)
	.catch(console.error);
