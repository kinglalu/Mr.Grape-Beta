const ytdl = require('ytdl-core');
module.exports = {
    name: 'e',
    description: 'get see what song is currently playin',
    cooldown: 0,
    async execute(message, args, d) {
        let f = await ytdl.getInfo('https://www.youtube.com/watch?v=D42Cexo75a0')
        console.log(f)
        let e = await ytdl.getInfo('https://www.youtube.com/watch?v=D42Cexo75a0')
        console.log(e.videoDetails)
     
    }
};
