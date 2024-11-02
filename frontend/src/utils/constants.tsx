export const BASE_URL = process.env.DEPLOY_MODE === "server" 
? "https://simplifymytext.org:7171" 
: "http://localhost:7171";
export const audienceOptions = [
  { value: "scientists", label: "Scientists and Researchers" },
  { value: "students", label: "Students and Academics" },
  { value: "industry", label: "Industry Professionals" },
  { value: "journalists", label: "Journalists and Media Professionals" },
  { value: "general", label: "General Public (Non-Expert)" },
];
