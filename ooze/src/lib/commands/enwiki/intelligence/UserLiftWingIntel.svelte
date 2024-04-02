<!--
    Risk analysis display
-->

<script lang="ts">
  import ClientWorkerCommunicationProvider from "../../../ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider";
  import type GetUserRevIDs from "../../../worker/functions/enwiki/GetUserRevIDs";
  import type LiftWingInsights from "../../../worker/functions/enwiki/LiftWingInsights";

  // Take in username and edit count - username must be set but edit count is optional
  export let username: string;
  export let editCount: number;
  export let isReportedToAIV: boolean | undefined;
  export let warningLevel: number | undefined;

  let initScore: number | undefined = undefined;
  let aivScore = 0;
  let warningScore = 0;
  let classList = "oozeLoading";

  $: if (username) {
    (async () => {
      // Get the user's last 3 edits - should be setting too
      const userEdits =
        await ClientWorkerCommunicationProvider._.workerFunction<
          typeof GetUserRevIDs
        >("enwikiGetUserRevIDs", username, 3);

      // Convert RevIDs into a map of good faith, vandalism, and reverted likelihoods
      let promiseWaiting: Promise<any>[] = [];

      // For each edit, add a promise which will then return
      // As we average everything out, the only real logic we need to do is inverting the good faith likelihood

      for (const edit of userEdits) {
        // Damaging likelihood
        promiseWaiting.push(
          ClientWorkerCommunicationProvider._.workerFunction<
            typeof LiftWingInsights
          >("enwikiLiftWingInsights", edit, "damaging")
        );

        // Bad faith likelihood
        promiseWaiting.push(
          ClientWorkerCommunicationProvider._.workerFunction<
            typeof LiftWingInsights
          >("enwikiLiftWingInsights", edit, "badFaith")
        );

        // Reverted likelihood
        promiseWaiting.push(
          ClientWorkerCommunicationProvider._.workerFunction<
            typeof LiftWingInsights
          >("enwikiLiftWingInsights", edit, "revertRisk")
        );
      }

      const values = await Promise.all(promiseWaiting);

      // Add everything and average it out
      let averagePercentage = 0;
      for (let i = 0; i < values.length; i += 3) {
        const damaging = values[i];
        const badFaith = values[i + 1];
        const revertRisk = values[i + 2];

        // Average the three percentages
        averagePercentage += (badFaith + damaging + revertRisk) / 3;
      }

      averagePercentage /= userEdits.length;
      averagePercentage *= 100;

      if (isNaN(averagePercentage) || averagePercentage === Infinity) {
        averagePercentage = 0;
      }

      // Add points based on edit count
      let points = 0;
      if (editCount <= 15) {
        points = 25 - 25 / editCount;
      } else if (editCount <= 50) {
        points = 20 - 15 / editCount;
      } else if (editCount <= 100) {
        points = 5 - 5 / editCount;
      } else if (editCount <= 200) {
        points = 0 - 5 / editCount;
      } else if (editCount <= 500) {
        points = -5 - 5 / editCount;
      } else if (editCount <= 1000) {
        points = -10 - 5 / editCount;
      }

      let totalPoints = Math.round(averagePercentage - 25 + points);

      // Cap the score at 100 or 0
      if (totalPoints > 100) {
        totalPoints = 100;
      } else if (totalPoints < 0) {
        totalPoints = 0;
      }

      if (isNaN(totalPoints) || totalPoints === Infinity){
        initScore = 100; // No edits most likely means good faith
      } else {
        initScore = totalPoints;
      }


      console.log({
        averagePercentage,
        points,
        totalPoints,
        username,
        values,
      })
    })();
  }

  $: if (isReportedToAIV === true) {
    // An AIV report automatically adds 15 points
    aivScore = 50;
  } else {
    aivScore = 0;
  }

  $: if (warningLevel !== undefined && warningLevel > 0) {
    warningScore = warningLevel * 10;
    // If final warning, add 10 points (in total 50 points for a final warning)
    if (warningLevel === 4) {
      warningScore += 10;
    }
  } else {
    warningScore = 0;
  }

  // Remove the loading class once all the scores are calculated
  $: if (isReportedToAIV !== undefined && warningLevel !== undefined && initScore !== undefined) {
    classList = "";
  }

  $: console.log({ initScore, aivScore, warningScore, isReportedToAIV, warningLevel });

</script>

<span class="oozeUserLiftWingIntel {classList}">
  <span style="color: hsl(
    {100 - Math.min(100, (initScore ?? 0) + aivScore + warningScore)},
    50%,
    50%
  );">&bull; Risk:</span>
  {Math.min(100, (initScore ?? 0) + aivScore + warningScore)}%
</span>
