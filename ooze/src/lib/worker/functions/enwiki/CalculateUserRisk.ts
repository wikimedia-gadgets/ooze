// Calculates the risk of the user
/*
    The algorithm is based on LiftWing analysis of the last 3 edits, edit count and warning level.

    We get three percentages from liftwing:
    - Good faith likelihood
    - Vandalism likelihood
    - Reverted likelihood

    First we invert the good faith likelihood, so that 0% is absolutely good, and 100% is absolutely bad.
    Then for each edit, we average the three percentages, and then average the averages.
    We then subtract 25% from the final average, and add points based on edit count
    (usually if there has been a higher number of edits, the user is more likely to be good faith).

    First on a range of edits from
    0-15 we add 25 to 20 points (most vandals are around this range)
    From 15-50 we add 20 to 5 points
    From 50-100 we add 5 to 0 points
    From 100-200 we add 0 to -5 points
    From 200-500 we add -5 to -10 points
    From 500-1000 we add -10 to -15 points.

    If the user is reported to AIV, we add 15 points to the final score.

    For users with warnings, we add 5 * warning level to the final score.

    Example one:
    - User has 10 edits, and has a 70% good faith likelihood, 10% vandalism likelihood, and 5% reverted likelihood.
    - First (70 + 10 + 5) / 3 = 28.33%
    - Then -25% = 3.33%
    - Then we add 23 points, so 26.33% - this new editor is likely to be good faith.

    Example two:
    - User has 12 edits, has a 13% good faith likelihood, 80% vandalism likelihood, and 70% reverted likelihood. Level 4 warning and reported to AIV.
    - First (87 + 80 + 70) / 3 = 79% - this places them in the vandalism range.
    - Then -25% = 54%
    - For 12 edits, we add 22 points, so 76%
    - For a level 4 warning, we add 20 points, so 96%
    - For being reported to AIV, we add 15 points, but we clamp the score to 100, so 100%

    Example three:
    - User has 1 edit, a 1% good faith likelihood, 95% vandalism likelihood, and 98% reverted likelihood. Level 4 only warning.
    - First (99 + 95 + 98) / 3 = 97.33%
    - Then -25% = 72.33%
    - For 1 edit, we add 24 points, so 96.33%
    - For a level 4 warning, we add 20 points, so 116.33% - we clamp the score to 100, so 100%

    Note:
    Edit count is optional here - if it's not provided we'll fetch it for you.
*/


import CheckIfReportedToAIV from "./CheckIfReportedToAIV";
import GetUserRevIDs from "./GetUserRevIDs";
import LiftWingInsights from "./LiftWingInsights";
import UsersSearch from "./UsersSearch";

export default async function CalculateUserRisk(username: string, editCount?: number, isReportedToAiv?: boolean): Promise<number | null> {
    const userEdits = await GetUserRevIDs(username, 3);

    if (!editCount) {
        const searchResult = await UsersSearch(username, 1);
        if (!searchResult) {
            return null;
        } else {
            editCount = searchResult[0].editCount;
        }
    }

    if (isReportedToAiv === undefined) {
        const aivReports = await CheckIfReportedToAIV([username]);
        isReportedToAiv = aivReports[username] ?? false;
    }

    // Convert RevIDs into a map of good faith, vandalism, and reverted likelihoods
    let promiseWaiting: Promise<any>[] = [];

    // For each edit, add a promise which will then return
    // As we average everything out, the only real logic we need to do is inverting the good faith likelihood

    for (const edit of userEdits) {
        // Damaging likelihood
        promiseWaiting.push(
            LiftWingInsights(edit, "damaging")
        );

        // Bad faith likelihood
        promiseWaiting.push(
            LiftWingInsights(edit, "badFaith")
        );

        // Reverted likelihood
        promiseWaiting.push(
            LiftWingInsights(edit, "revertRisk")
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

    let initScore = 0;

    if (isNaN(totalPoints) || totalPoints === Infinity){
      initScore = 100; // No edits most likely means good faith
    } else {
      initScore = totalPoints;
    }

    return initScore;
}