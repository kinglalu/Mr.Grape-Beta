module.exports = {
	name: 'apod',
	description: 'get a daily nasapic',
	aliases: ['nasapic', 'npod', 'nasapicoftheday', 'nasa'],
	cooldown: 3,
	cd: "There's only one NASA pic",
	async execute(message, args, d) {
		const NASAURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA}`;
		const pic = await d.r2.get(NASAURL).json;
		const nasa = new d.Discord.MessageEmbed()
			.setColor('#dd2de0')
			.setTitle('NASA Picture of the Day!')
			.setImage(pic.hdurl)
			.setTimestamp()
			.setFooter('Grape Space and Astronomy');
		message.channel.send(nasa);
	}
};
