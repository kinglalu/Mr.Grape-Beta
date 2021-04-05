const { Op: { or } } = require("sequelize");
const { EconomyCommand } = require("../../structures");

module.exports =
    class extends EconomyCommand {
        constructor(...args) {
            super(...args, {
                name: "sell",
                type: "economy",
                description: "Get a user's balance.",
                usage: "<ore> <amount>",
                saying: "This ain't a bazaar bud.",
                cooldown: 2
            });
        }

        getNameAmt(msg) {
            if (msg.params.length < 3) return super.getNameAmt(msg);
            const number = msg.params.find(p => Number.isInteger(p));
            return [msg.params.filter(p => p !== number).join(" "), number ? +number : 1];
        }

        async main(msg) {
            const all = msg.params.find(p => p === "all");
            const parse = all ? msg.params.filter(p => p !== "all") : this.getNameAmt(msg);
            const parsedItem = all ? parse : parse[0];

            this.client.console.debug(parsedItem)

            const refined = parsedItem.startsWith("refined");

            const oreName = refined ? parsedItem.substr(8) : parsedItem;

            const sale = { type: "shop", item: null };

            const item = await this.eco.shop.findOne({
                where: {
                    [or]: {
                        name: parsedItem,
                        alias: parsedItem
                    }
                }
            })

            const ore = await this.eco.ores.getOre(msg.author.id, oreName, refined);

            ore ? sale.type = "ore" : null;
            ore ? sale.item = ore.data : sale.item = item;

            if (!sale.item) return msg.send("That's not a valid item!");

            const itemEntry =
                sale.type === "shop" ?
                    await this.eco.items.findOne({ where: { user_id: msg.author.id, item_id: sale.item.id } }) : ore;

            const quantity = all ? itemEntry.amount : parse[1];

            if (quantity > itemEntry.amount) return msg.send(`You don't have that many ${sale.item.name}'s!`);

            itemEntry.amount -= quantity
            itemEntry.amount ? itemEntry.save() : itemEntry.destroy();

            let profit = quantity * sale.item.price;

            refined ? profit = profit * 2 : null;

            this.eco.users.add(msg.author.id, profit);

            const sellEmbed = new msg.embed()
                .setTitle("Sale")
                .addField(`${msg.author.username} sold`, `${this.format(parsedItem, quantity)} ${sale.type === "ore" ? msg.emojis[oreName] : "!"}`)
            msg.send(sellEmbed)
        }
    };
