const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');
const doc = new GoogleSpreadsheet('1VcTA1paspqCAswKzS3uUStiEOxMOsLIrBub4WZ6FinI');


const sheetIds = {
    'top6': 1137021927,
    'wins': 632582135,
    'pointsForAgainst': 182418815,
    'pointsScored':276903505
};

function getWeeklyScores(owner) {
    console.log(owner)
    let weeklyScores = [];
    for(let i = 1; i < 13; i++) {
        let num = i.toString();
       weeklyScores.push(owner[num]["weeks"][num]["pointsScored"]);
    }
    return weeklyScores;
}

const updateGoogleSheet = async (stor) => {
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo(); 

const top6Sheet = doc.sheetsById[sheetIds['top6']];
const winSheet = doc.sheetsById[sheetIds['wins']];
const pointsScored = doc.sheetsById[sheetIds['pointsScored']];
const top6SheetRows = await top6Sheet.getRows();
const winSheetRows = await winSheet.getRows();
const pointsScoredRows = await pointsScored.getRows();

//loop through owners
for(let i = 1; i<13; i++){
    let winRow = winSheetRows[i-1];
    let top6Row = top6SheetRows[i-1];
    let pointScoredRow = pointsScoredRows[i-1];
    let team = stor[i.toString()]['weeks'];

    for(let j=1; j<=13; j++) {
        let rowHeader = ('Week' + ' ' + j);
        winRow[rowHeader] = team[j.toString()]['wins']
        top6Row[rowHeader] = team[j.toString()]['top6']
        pointScoredRow[rowHeader] = team[j.toString()]['pointsScored']
    }
    await winRow.save();
        await pointScoredRow.save();
            await top6Row.save();

}
}

module.exports = updateGoogleSheet;








