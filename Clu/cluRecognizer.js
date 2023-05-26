const axios = require("axios");
require("dotenv").config();

const getClu = async (text) => {
  //   console.log(text);
  if (!text) {
    console.log("Please provide text");
  }
  try {
    const body = {
      kind: "Conversation",
      analysisInput: {
        conversationItem: {
          id: "PARTICIPANT_ID_HERE",
          text: `${text}`,
          modality: "text",
          language: "en",
          participantId: "PARTICIPANT_ID_HERE",
        },
      },
      parameters: {
        projectName: "ApplyLeaveBot",
        verbose: true,
        deploymentName: "Leave-management-bot",
        stringIndexType: "TextElement_V8",
      },
    };
    const headers = {
      "Ocp-Apim-Subscription-Key": process.env.CluAPIKey,
      "Apim-Request-Id": process.env.CluAPImHeader,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(process.env.CluAPIHostName, body, {
      headers,
    });

    let recievedIntent = data.result.prediction.topIntent;
    let recievedEntities = data.result.prediction.entities;
    let recieveConfidenceScore =
      data.result.prediction.intents[0].confidenceScore;
    let recievedResponse = {
      recievedIntent,
      recievedEntities,
      recieveConfidenceScore,
    };

    // console.log("data ==>>", recievedResponse);

    return recievedResponse;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getClu,
};
