import ClientFetch from "../../proxies/ClientFetch";

type LiftWingModel = "revertRisk" | "damaging" | "badFaith";

// Note, limit for anon calls is 50k per hour. Might be worth considering using a token depending on how users use this.

const modelMap: Record<LiftWingModel, string> = {
    revertRisk: "https://api.wikimedia.org/service/lw/inference/v1/models/revertrisk-language-agnostic:predict",
    damaging: "https://api.wikimedia.org/service/lw/inference/v1/models/enwiki-damaging:predict",
    badFaith: "https://api.wikimedia.org/service/lw/inference/v1/models/enwiki-goodfaith:predict",
};


export default async function LiftWingInsights(revisionId: number, model: LiftWingModel): Promise<number> {
    const params = {
        rev_id: revisionId,
        lang: "en",
    };

    // Client fetch - POST request to the model with params
    const json = await ClientFetch._.cFetchJson(modelMap[model], {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json",
        },
    });

    switch (model) {
        case "revertRisk":
            if (!json.output?.probabilities?.true) return 0;
            else return json.output.probabilities.true;
        case "damaging":
            if (!json.enwiki.scores[revisionId]?.damaging?.score?.probability?.true) return 0;
            else return json.enwiki.scores[revisionId].damaging.score.probability.true;
        case "badFaith":
            // As this is good faith we need to invert the probability
            if (!json.enwiki.scores[revisionId]?.goodfaith?.score?.probability?.true) return 1;
            else return 1 - json.enwiki.scores[revisionId].goodfaith.score.probability.true;
    }
}