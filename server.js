const restify = require("restify");
require("dotenv/config");
const PORT = 3900 || process.env.PORT;
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
const mongoose = require("mongoose");
require("dotenv/config");

const {
  ConfigurationBotFrameworkAuthentication,
  CloudAdapter,
  MemoryStorage,
  ConversationState,
  UserState,
  ConfigurationServiceClientCredentialFactory,
} = require("botbuilder");

const { BotActivityHandler } = require("./Bot/BotActivityHandler");
const { RootDialog } = require("./Dialogs/rootDialog");

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId,
  MicrosoftAppPassword: process.env.MicrosoftAppPassword,
  MicrosoftAppType: process.env.MicrosoftAppType,
  MicrosoftAppTenantId: process.env.MicrosoftAppTenantId,
});

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
  credentialsFactory
);
const adapter = new CloudAdapter(botFrameworkAuthentication);

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${error}`);
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );
  await context.sendActivity("The bot encountered an error or bug.");
  await context.sendActivity(
    "To continue to run this bot, please fix the bot source code."
  );
  await conversationState.delete(context);
};

const db = process.env.MONGO_URI;
mongoose
  .set("strictQuery", true)
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

server.listen(PORT, () => {
  console.log(`${server.name} listening to ${server.url}`);
});

const rootDialog = new RootDialog(conversationState);
const bot = new BotActivityHandler(conversationState, rootDialog);

server.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => await bot.run(context));
});
