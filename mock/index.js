import sprints from "./sprints.json";
import issues from "./issuesBySprint.json";

function fake(source) {
  const delay = Math.round(Math.random() * 3) * 0;
  return new Promise((resolve) => {
    setTimeout(() => resolve(source), delay);
  });
}

async function getSprints(page) {
  console.log("getSprints: ", page);
  const r = await fake(sprints[page]);
  return r;
}

async function getIssues(page) {
  const r = await fake(issues[page]);
  return r;
}

export { getSprints, getIssues };
