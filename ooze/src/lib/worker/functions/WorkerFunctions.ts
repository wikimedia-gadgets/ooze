import ExportSqliteDb from "./ExportSqliteDb";
import GetStorageAvailToOozeWorker from "./GetStorageAvailToOozeWorker";
import Heartbeat from "./Heartbeat";
import GetPageVisitHistory from "./PageVisitHistory";
import RegisterPageVisit from "./RegisterPageVisit";
import BasicSearch from "./enwiki/BasicSearch";
import CheckIfReportedToAIV from "./enwiki/CheckIfReportedToAIV";
import GetUserRevIDs from "./enwiki/GetUserRevIDs";
import GetUserWarningLevel from "./enwiki/GetUserWarningLevel";
import LastEditorsOnPage from "./enwiki/LastEditorsOnPage";
import LiftWingInsights from "./enwiki/LiftWingInsights";
import UsersSearch from "./enwiki/UsersSearch";

const WorkerFunctions = {
    "heartbeat": Heartbeat,
    "exportSqlDb": ExportSqliteDb,
    "getStorage": GetStorageAvailToOozeWorker,
    "enwikiLastEditorsOnPage": LastEditorsOnPage,
    "enwikiBasicSearch": BasicSearch,
    "enwikiUsersSearch": UsersSearch,
    "enwikiCheckAiv": CheckIfReportedToAIV,
    "enwikiGetUserWarningLevel": GetUserWarningLevel,
    "enwikiLiftWingInsights": LiftWingInsights,
    "enwikiGetUserRevIDs": GetUserRevIDs,
    "registerPageVisit": RegisterPageVisit,
    "pageVisitHistory": GetPageVisitHistory,
};

export default WorkerFunctions;