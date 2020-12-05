module.exports = {
    name: 'volume',
    description: 'set volume of the bot',
    aliases: ['vol'],
    execute(message, args, d) {
        let title, number;
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Get in a voice channel if you wanna pump it up!')
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('There ain\'t any music!')
        if (!args[0]) { title = 'Current Volume'; number = queue.volume }
        let set = parseInt(args.join(' '))
        serverQueue.volume = set;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(set / 5);
        title = 'Volume set to'
        number = set
        const volumeEmbed = new d.Discord.MessageEmbed()
            .setColor('#dd2de0')
            .setTitle('Volume')
            .addField(title, number)
    }
};