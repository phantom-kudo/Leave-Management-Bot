const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { rootDialog } = require("../Constants/DialogIds");
const { HelpDialog } = require("./helpDialog");
const { helpDialog, applyLeaveDialog } = require("../Constants/DialogIds");
const { ApplyLeaveDialog } = require("./applyLeave");

const parseMessage = "parseMessage";

class RootDialog extends ComponentDialog {
  constructor(conversationState) {
    super(rootDialog);

    this.addDialog(
      new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)])
    );
    this.addDialog(new HelpDialog(conversationState));
    this.addDialog(new ApplyLeaveDialog(conversationState));

    this.initialDialogId = parseMessage;
  }

  async run(context, accessor) {
    try {
      const dialogSet = new DialogSet(accessor);
      dialogSet.add(this);
      const dialogContext = await dialogSet.createContext(context);
      const results = await dialogContext.continueDialog();
      if (results && results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
      } else {
        console.log("Dialog stack is empty");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async routeMessage(stepContext) {
    switch (stepContext.context.activity.text.toLowerCase()) {
      case "apply leave":
        return await stepContext.beginDialog(applyLeaveDialog);
        break;
      case "leave status":
        break;
      case "help":
        return await stepContext.beginDialog(helpDialog);
      default:
        await context.sendActivity("Try refreshing I am still learning things");
        break;
    }
    return await stepContext.endDialog();
  }
}

module.exports.RootDialog = RootDialog;
