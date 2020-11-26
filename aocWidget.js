/*
 *   set your leaderboard ID and session cookie here
 */

const YEAR = "2020";
const LEADERBOARD_ID = "";
const SESSION_COOKIE = "";

const YELLOW = new Color("#ffffcc");
const DARKYELLOW = new Color("#f5dd0a");
const DARKBLUE = new Color("#19193b");
const DARKGREEN = new Color("#0f6922");
const FONT = new Font("Menlo", 12);
const FONTLARGE = new Font("Menlo", 18);

const url = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`


async function getLeaderboard() {
  try {
    console.log("fetching leaderboard...");
    const request = new Request(url);
    request.headers = {
      cookie: `session=${SESSION_COOKIE}`
    };
    const response = await request.loadJSON();
    return response;
  } catch (error) {
    console.error(`error fetching json from ${url}: ${JSON.stringify(error)}`);
  }
}


function formatLeaderboard(data) {
  var leaders = [];
  for (let key in data.members) {
    const m = data.members[key];
    leaders.push({
      "name": m.name ? m.name : `anon #${m.id}`,
      "stars": m.stars.toString(),
      "score": m.local_score.toString()
    });
  };
  //   sort by score
  leaders.sort((a,b) => parseInt(b.score) - parseInt(a.score));
  //   return first 5
  return leaders.slice(0, 5);
}


async function createWidget() {
  const widget = new ListWidget();
  widget.spacing = 4;
  widget.backgroundColor = DARKBLUE;
  const title = widget.addText(`AoC ${YEAR}`);
  title.font = FONTLARGE;
  title.textColor = DARKGREEN;

  const board = await getLeaderboard();
  const leaders = formatLeaderboard(board);
//   console.log(leaders);
  
  const stack = widget.addStack();
  stack.layoutVertically();
  for (let i=0; i<leaders.length; i++) {
    const text = stack.addText(
      `${i+1}) ${leaders[i].score.padEnd(4, " ")}   ${leaders[i].stars.padStart(2, " ")} ⭐️    ${leaders[i].name}`
    );
    text.font = FONT;
    text.textColor = YELLOW;
    text.shadowColor = DARKYELLOW;
    text.shadowRadius = 1.2;
  }
  return widget;
}


const widget = await createWidget();
// be nice to mr wastl and refresh only once every 2 hours
const refreshAfter = new Date(new Date().getTime() + 2*60*60000);
widget.refreshAfterDate = refreshAfter;
const formatter = new DateFormatter();
formatter.dateFormat = "yyyy-MM-dd HH:mm";
console.log(`refresh after ${formatter.string(refreshAfter)}`);

Script.setWidget(widget);
Script.complete();
