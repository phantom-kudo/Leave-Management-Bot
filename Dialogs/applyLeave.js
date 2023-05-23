const {
  ComponentDialog,
  WaterfallDialog,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
  TextPrompt,
  Dialog,
} = require("botbuilder-dialogs");
const { applyLeaveDialog } = require("../Constants/DialogIds");
const { CardFactory } = require("botbuilder");
const { confirmLeave, applyLeave } = require("../Resources/cards");

const applyLeaveDialogWF1 = "applyLeaveDialogWF1";
const choicePromptDialog = "choicePromptDialog";
const numberPromptDialog = "numberPromptDialog";
const textPromptDialog = "textPromptDialog";
const applyLeaveDialogWithFormWF1 = "applyLeaveDialogWithFormWF1";
let initDialogId;

class ApplyLeaveDialog extends ComponentDialog {
  constructor(conversationState) {
    super(applyLeaveDialog);
    if (!conversationState) {
      console.log("Conversation State Required");
    }

    this.conversationState = conversationState;
    this.applyLeaveStateAccessor =
      this.conversationState.createProperty("applyLeaveState");

    this.addDialog(new ChoicePrompt(choicePromptDialog));
    this.addDialog(new NumberPrompt(numberPromptDialog));
    this.addDialog(new TextPrompt(textPromptDialog));
    this.addDialog(
      new WaterfallDialog(applyLeaveDialogWF1, [
        this.askTypeOfLeave.bind(this),
        this.askNoOfDays.bind(this),
        this.askLeaveDate.bind(this),
        this.applyApplication.bind(this),
      ])
    );

    this.addDialog(
      new WaterfallDialog(applyLeaveDialogWithFormWF1, [
        this.showForm.bind(this),
        this.preprocessUserInput.bind(this),
        this.applyApplication.bind(this),
      ])
    );

    this.initialDialogId = applyLeaveDialogWithFormWF1;
  }

  async showForm(stepContext) {
    try {
      await stepContext.context.sendActivity({
        attachments: [CardFactory.adaptiveCard(applyLeave())],
      });
      return Dialog.EndOfTurn;
    } catch (err) {
      console.log(err);
    }
  }

  async preprocessUserInput(stepContext) {
    try {
      let dialogData = await this.applyLeaveStateAccessor.get(
        stepContext.context,
        {}
      );
      let userInput = stepContext.context.activity.value;
      dialogData.leaveType = userInput.leavetype;
      dialogData.leaveDate = userInput.startingDate;
      dialogData.noOfDays = userInput.noOfDays;
      if (parseInt(dialogData.noOfDays) > 3) {
        await stepContext.context.sendActivity(
          "You can apply for 3 leaves in a row. Please enter the details once again."
        );
        return stepContext.endDialog();
      } else {
        await stepContext.context.sendActivity(
          "Thank you I have all the details. Please wait while I apply your leave."
        );
        return stepContext.next();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async askTypeOfLeave(stepContext) {
    try {
      return await stepContext.prompt(choicePromptDialog, {
        prompt: "Please help me with the leave you want: ",
        choices: ChoiceFactory.toChoices([
          "Sick Leave",
          "Casual Leave",
          "Paid Leave",
        ]),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async askNoOfDays(stepContext) {
    try {
      let dialogData = await this.applyLeaveStateAccessor.get(
        stepContext.context,
        {}
      );
      dialogData.leaveType = stepContext.result.value;
      return await stepContext.prompt(
        numberPromptDialog,
        `For how many days do you want to apply for ${dialogData.leaveType}?`
      );
    } catch (err) {
      console.log(err);
    }
  }

  async askLeaveDate(stepContext) {
    try {
      let dialogData = await this.applyLeaveStateAccessor.get(
        stepContext.context,
        {}
      );
      dialogData.noOfDays = stepContext.result;
      return await stepContext.prompt(
        textPromptDialog,
        `From which date should I apply for ${dialogData.leaveType}?`
      );
    } catch (err) {
      console.log(err);
    }
  }

  async applyApplication(stepContext) {
    try {
      let dialogData = await this.applyLeaveStateAccessor.get(
        stepContext.context,
        {}
      );
      await stepContext.context.sendActivity({
        attachments: [
          CardFactory.adaptiveCard(
            confirmLeave(
              dialogData.leaveType,
              dialogData.noOfDays,
              dialogData.leaveDate
            )
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports.ApplyLeaveDialog = ApplyLeaveDialog;
