const { ActivityHandler, CardFactory } = require("botbuilder");

class BotActivityHandler extends ActivityHandler {
  constructor(conversationState, rootDialog) {
    super();
    if (!conversationState) {
      console.log("Provide Conversation State");
    }
    this.conversationState = conversationState;
    this.rootDialog = rootDialog;
    this.accessor = this.conversationState.createProperty("DialogAccessor");

    this.onMessage(async (context, next) => {
      await this.rootDialog.run(context, this.accessor);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      for (const idx in context.activity.membersAdded) {
        if (
          context.activity.membersAdded[idx].id !==
          context.activity.recipient.id
        ) {
          await context.sendActivity({
            attachments: [
              CardFactory.adaptiveCard({
                type: "AdaptiveCard",
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.0",
                body: [
                  {
                    type: "Image",
                    url: "https://media.tenor.com/hE0T8D0GpXsAAAAC/joinblink-blink.gif",
                  },
                  {
                    type: "TextBlock",
                    text: "Welcome, User! I am your personal assistant. I can help you with your leave application request. Type help to know all my features. How may I help you?",
                    wrap: true,
                    style: "default",
                    fontType: "Monospace",
                    size: "Default",
                    weight: "Lighter",
                    color: "Good",
                    isSubtle: true,
                  },
                ],
              }),
            ],
          });
          await context.sendActivity({
            attachments: [
              CardFactory.heroCard(
                "Here are some feature which you can refer to: ",
                null,
                CardFactory.actions([
                  {
                    type: "imBack",
                    title: "Apply Leave",
                    value: "Apply Leave",
                  },
                  {
                    type: "imBack",
                    title: "Leave Status",
                    value: "Leave Status",
                  },
                  {
                    type: "imBack",
                    title: "Help",
                    value: "Help",
                  },
                ])
              ),
            ],
          });
        }
      }
      await next();
    });
  }

  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
