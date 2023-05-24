const {
  WaterfallDialog,
  ComponentDialog,
  Dialog,
} = require("botbuilder-dialogs");
const { leaveStatus } = require("../Resources/cards");
const Leave = require("../Model/Leave");
const { leaveStatusDialog } = require("../Constants/DialogIds");
const { CardFactory } = require("botbuilder");

const leaveStatusDialogWF1 = "leaveStatusDialogWF1";

class LeaveStatusDialog extends ComponentDialog {
  constructor(conversationState) {
    super(leaveStatusDialog);
    if (!conversationState) {
      console.log("Conversation State Required");
    }

    this.conversationState = conversationState;
    this.leaveStatusAccessor =
      this.conversationState.createProperty("leaveStatusState");

    this.addDialog(
      new WaterfallDialog(leaveStatusDialogWF1, [
        this.leaveStatusForm.bind(this),
        this.preprocessStatus.bind(this),
      ])
    );

    this.initialDialogId = leaveStatusDialogWF1;
  }

  async leaveStatusForm(stepContext) {
    try {
      await stepContext.context.sendActivity({
        attachments: [CardFactory.adaptiveCard(leaveStatus())],
      });
      return Dialog.EndOfTurn;
    } catch (err) {
      console.log(err);
    }
  }

  async preprocessStatus(stepContext) {
    try {
      let dialogData = await this.leaveStatusAccessor.get(
        stepContext.context,
        {}
      );
      let userInput = stepContext.context.activity.value;
      dialogData.id = userInput.id;
      const leaveStatus = await Leave.findOne({ _id: dialogData.id });
      await stepContext.context.sendActivity(
        `Your leave has been ${leaveStatus.leaveStatus}`
      );
      return stepContext.endDialog();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports.LeaveStatusDialog = LeaveStatusDialog;
