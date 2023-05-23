module.exports = {
  confirmLeave: (leavetype, leavedays, leavedate) => {
    return {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.3",
      body: [
        {
          type: "TextBlock",
          text: "Leave Application",
          wrap: true,
          spacing: "None",
          horizontalAlignment: "Center",
        },
        {
          type: "Image",
          url: "https://celebaltech.com/assets/img/celebal.webp",
        },
        {
          type: "TextBlock",
          text: ` Leave Type : ${leavetype}`,
          wrap: true,
        },
        {
          type: "TextBlock",
          text: `No. Of Days : ${leavedays}`,
          wrap: true,
        },
        {
          type: "TextBlock",
          text: `Leave starts from : ${leavedate}`,
          wrap: true,
        },
      ],
    };
  },

  applyLeave: () => {
    let leaveForm = {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.3",
      body: [
        {
          type: "Image",
          url: "https://celebaltech.com/assets/img/celebal.webp",
        },
        {
          type: "TextBlock",
          text: "Leave Application",
          wrap: true,
          horizontalAlignment: "Center",
        },
        {
          type: "TextBlock",
          text: "Please select your leave type :",
          wrap: true,
          style: "columnHeader",
        },
        {
          type: "Input.ChoiceSet",
          choices: [
            {
              title: "Sick Leave",
              value: "sick leave",
            },
            {
              title: "Paid Leave",
              value: "paid leave",
            },
            {
              title: "Casual Leave",
              value: "casual leave",
            },
          ],
          placeholder: "Leave Type",
          id: "leavetype",
        },
        {
          type: "TextBlock",
          text: "No. of days :",
          wrap: true,
          style: "columnHeader",
        },
        {
          type: "Input.Number",
          placeholder: "Enter no. of days",
          id: "noOfDays",
        },
        {
          type: "TextBlock",
          text: "From which date you want leave : ",
          wrap: true,
          style: "columnHeader",
        },
        {
          type: "Input.Date",
          id: "startingDate",
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.Submit",
              title: "Apply",
              id: "applyLeaveApplication",
            },
          ],
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.Submit",
              title: "Cancel",
              id: "cancelLeaveApplication",
            },
          ],
        },
      ],
    };
    return leaveForm;
  },
};
