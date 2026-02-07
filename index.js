const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.TOKEN;

// lê fichas do arquivo
let fichas = {};
if (fs.existsSync("./fichas.json")) {
  fichas = JSON.parse(fs.readFileSync("./fichas.json"));
}

client.once("ready", () => {
  console.log(`✅ Logado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== TESTE PING =====
  if (message.content === "?ping") {
    message.reply("pong 🏓");
  }

  const ROLE_ID = "1469689840982425670";

  // ===== CRIAR FICHA =====
  if (message.content === "?rpgfichacriar") {
    // Verifica se o membro tem a role
    if (!message.member.roles.cache.has(ROLE_ID)) {
      return message.reply(
        ":x: Você não tem permissão para usar este comando!"
      );
    }

    const filter = (m) => m.author.id === message.author.id;

    try {
      await message.reply("Qual ID da ficha?");

      let id;
      while (true) {
        const idMsg = (
          await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
        ).first();
        id = idMsg.content;

        if (fichas[id]) {
          await message.reply(
            ":x: Esse ID já existe! Por favor, escolha outro ID."
          );
        } else {
          break;
        }
      }

      await message.reply("Personagem?");
      const nomeMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const nome = nomeMsg.content;

      await message.reply("Vida?");
      const vidaMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const vida = vidaMsg.content;

      await message.reply("Encantamento?");
      const encantamentoMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const encantamento = encantamentoMsg.content;

      await message.reply("Energia Amaldiçoada?");
      const energiaMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const energia = energiaMsg.content;

      await message.reply("Domínio Simples (Sim[ ] / Não[ ])?");
      const dominioSimplesMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const dominioSimples = dominioSimplesMsg.content;

      await message.reply("Expansão de Domínio (Sim[ ] / Não[ ])?");
      const expansaoMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const expansao = expansaoMsg.content;

      await message.reply("Arma?");
      const armaMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const arma = armaMsg.content;

      await message.reply("Força?");
      const forcaMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const forca = forcaMsg.content;

      await message.reply("Velocidade?");
      const velocidadeMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const velocidade = velocidadeMsg.content;

      await message.reply("Resistência?");
      const resistenciaMsg = (
        await message.channel.awaitMessages({ filter, max: 1, time: 60000 })
      ).first();
      const resistencia = resistenciaMsg.content;

      fichas[id] = {
        nome,
        vida,
        encantamento,
        energia,
        dominioSimples,
        expansao,
        arma,
        forca,
        velocidade,
        resistencia,
      };

      fs.writeFileSync("./fichas.json", JSON.stringify(fichas, null, 2));

      await message.reply(`Ficha de ID \`${id}\` criada com sucesso!`);
    } catch (err) {
      message.reply(
        "Você demorou muito para responder. Por favor, tente criar a ficha novamente."
      );
    }
  }

  // ===== CONSULTAR FICHA =====
  if (message.content === "?rpgconsultarfichas") {
  const ids = Object.keys(fichas);

  if (ids.length === 0) {
    return message.reply("Não existe nenhuma ficha criada.");
  }

  const embed = new EmbedBuilder()
    .setTitle("📜 Todas as Fichas de RPG")
    .setColor("Blue");

  for (const id of ids) {
    const f = fichas[id];

    embed.addFields({
      name: `🆔 ID: ${id} — ${f.nome}`,
      value:
        `❤️ Vida: ${f.vida}\n` +
        `✨ Encantamento: ${f.encantamento}\n` +
        `🔮 Energia: ${f.energia}\n` +
        `🛡 Domínio Simples: ${f.dominioSimples}\n` +
        `🌌 Expansão: ${f.expansao}\n` +
        `⚔ Arma: ${f.arma}\n` +
        `💪 Força: ${f.forca}\n` +
        `💨 Velocidade: ${f.velocidade}\n` +
        `🧱 Resistência: ${f.resistencia}`,
    });
  }

  message.channel.send({ embeds: [embed] });
}

  if (message.content.startsWith("?rpgconsultarficha")) {
    const args = message.content.split(" ");
    const id = args[1];
    if (!id) return message.reply("Use: ?rpgconsultarficha <ID>");

    const f = fichas[id];
    if (!f) return message.reply("Ficha não encontrada.");

    const embed = new EmbedBuilder()
      .setTitle(`Ficha de ${f.nome}`)
      .addFields([
        { name: "ID", value: id, inline: true },
        { name: "Vida", value: f.vida, inline: true },
        { name: "Encantamento", value: f.encantamento, inline: true },
        { name: "Energia Amaldiçoada", value: f.energia, inline: true },
        { name: "Domínio Simples", value: f.dominioSimples, inline: true },
        { name: "Expansão de Domínio", value: f.expansao, inline: true },
        { name: "Arma", value: f.arma, inline: true },
        { name: "Força", value: f.forca, inline: true },
        { name: "Velocidade", value: f.velocidade, inline: true },
        { name: "Resistência", value: f.resistencia, inline: true },
      ])
      .setColor("Blue");

    message.channel.send({ embeds: [embed] });
  }



});

client.login(TOKEN);
