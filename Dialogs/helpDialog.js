const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { helpDialog, helpDialogWF1 } = require("../Constants/DialogIds");

class HelpDialog extends ComponentDialog {
  constructor(conversationState) {
    super(helpDialog);
    if (!conversationState) {
      console.log("Provide Conversation State");
    }
    this.conversationState = conversationState;

    this.addDialog(
      new WaterfallDialog(helpDialogWF1, [this.sendHelpSuggestion.bind(this)])
    );

    this.initialDialogId = helpDialogWF1;
  }

  async sendHelpSuggestion(stepContext) {
    await stepContext.context.sendActivity(
      'Hello, User! I can help you by applying leave. Please click on "Apply Leave" to proceed further.'
    );
    await stepContext.context.sendActivity({
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
    return await stepContext.endDialog();
  }
}

module.exports.HelpDialog = HelpDialog;
