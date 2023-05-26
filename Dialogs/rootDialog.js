const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { rootDialog } = require("../Constants/DialogIds");
const { HelpDialog } = require("./helpDialog");
const {
  helpDialog,
  applyLeaveDialog,
  leaveStatusDialog,
} = require("../Constants/DialogIds");
const { ApplyLeaveDialog } = require("./applyLeave");
const { LeaveStatusDialog } = require("./leaveStatus");
const { getClu } = require("../Clu/cluRecognizer");

const parseMessage = "parseMessage";

class RootDialog extends ComponentDialog {
  constructor(conversationState) {
    super(rootDialog);

    this.addDialog(
      new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)])
    );
    this.addDialog(new HelpDialog(conversationState));
    this.addDialog(new ApplyLeaveDialog(conversationState));
    this.addDialog(new LeaveStatusDialog(conversationState));

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
    const text = stepContext.context.activity.text.toLowerCase();
    // console.log(getClu(text));
    const cluResponse = await getClu(text);
    // console.log("cluResponse ==>", cluResponse);
    let intent;
    if (cluResponse.recieveConfidenceScore > 0.8) {
      intent = cluResponse.recievedIntent.toLowerCase();
    }
    // console.log("intent ==>", intent);
    switch (intent) {
      case "apply leave":
        return await stepContext.beginDialog(applyLeaveDialog);
        break;
      case "leave status":
        return await stepContext.beginDialog(leaveStatusDialog);
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
