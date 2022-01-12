import { toastAlerts } from "../utils/Alerts";

export default (error) => toastAlerts({
    title: "Error!",
    text: error.message,
    icon: "error"
});