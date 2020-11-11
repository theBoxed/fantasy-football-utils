'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const axios = require('axios');
const { LEAGUE_ID, SWID, ESPN_S2 } = require('../config');
const { default: Axios } = require('axios');
let stor = require('./storage.js');
const updateGoogleSheet = require('../google.js');
// const e = require('express');

axios.defaults.baseURL = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/';

const _buildRoute = ({ base, params }) => `${base}${params}`;

const _buildAxiosConfig = (config) => {
  if (ESPN_S2 && SWID) {
    const headers = { Cookie: `espn_s2=${ESPN_S2}; SWID=${SWID};` };
    return _.merge({}, config, { headers, withCredentials: true });
  }
};

const getBoxScoreForWeek = (seasonId, scoringPeriodId) => {
  const route = _buildRoute({
    base: `${seasonId}/segments/0/leagues/${LEAGUE_ID}`,
    params: `?view=mMatchup&view=mMatchupScore&matchupPeriodId=${scoringPeriodId}`,
  });

  return axios.get(route, _buildAxiosConfig()).then((response) => {
    return _.get(response.data, 'schedule');
  });
};

const getSixthHighestScore = (scores, scoringPeriodId) => {
  let sixthScore = [];
  for (let i = 1; i <= scoringPeriodId; i++) {
    let sortedScores = scores[i].sort((a, b) => b - a);
    sixthScore.push(sortedScores[5]);
  }
  return sixthScore;
};

const updateTop6Stor = (sortedScores, scoringPeriodId) => {
  console.log('sortedScores', sortedScores);

  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= scoringPeriodId; j++) {
      let num = i.toString();
      if (
        stor[i.toString()]['weeks'][j.toString()]['pointsScored'] >=
        sortedScores[j - 1]
      ) {
        stor[i]['weeks'][j]['top6'] = 1;
      } else {
        stor[i]['weeks'][j]['top6'] = 0;
      }
    }
  }
};

const addWeeklyScoreAndWinsToStor = (data, scoringPeriodId) => {
  for (let i = 0; i < data.length; i++) {
    let week = data[i]['matchupPeriodId'];
    let homeTeam = data[i]['home']['teamId'];
    let awayTeam = data[i]['away']['teamId'];
    let homeTeamScore = data[i]['home']['totalPoints'];
    let awayTeamScore = data[i]['away']['totalPoints'];

    // scoresByWeek.week = scoresByWeek.week.push(homeTeamScore, awayTeamScore);
    stor['weeklyScores'][week].push(homeTeamScore);
    stor['weeklyScores'][week].push(awayTeamScore);

    stor[homeTeam]['weeks'][week]['pointsScored'] = homeTeamScore;
    stor[awayTeam]['weeks'][week]['pointsScored'] = awayTeamScore;

    if (homeTeamScore > awayTeamScore) {
      stor[homeTeam]['weeks'][week]['wins'] = 1;
    } else if (homeTeamScore == 0 || awayTeamScore == 0) {
      stor[homeTeam]['weeks'][week]['wins'] = 0;
      stor[awayTeam]['weeks'][week]['wins'] = 0;
    } else if (awayTeamScore > homeTeamScore) {
      stor[awayTeam]['weeks'][week]['wins'] = 1;
    } else if (awayTeamScore == homeTeamScore) {
      stor[homeTeam]['weeks'][week]['wins'] = 0.5;
      stor[awayTeam]['weeks'][week]['wins'] = 0.5;
    }
  }

  return updateTop6Stor(
    getSixthHighestScore(stor['weeklyScores'], scoringPeriodId),
    scoringPeriodId
  );
};

const getTeams = () => {
  const seasonId = 2020;
  const scoringPeriodId = 1;
  const route = _buildRoute({
    base: `${seasonId}/segments/0/leagues/${LEAGUE_ID}`,
    params: `?scoringPeriodId=${scoringPeriodId}&view=mTeam`,
  });

  return axios.get(route, _buildAxiosConfig()).then((response) => {
    return _.get(response.data, 'teams');
  });
};

const addTotalPointsToStor = (data) => {
  for (let i = 0; i < data.length; i++) {
    let teamId = data[i]['id'];
    stor[teamId]['totalPointsFor'] = data[i]['record']['overall']['pointsFor'];
    stor[teamId]['totalPointsAgainst'] =
      data[i]['record']['overall']['pointsAgainst'];
  }
  return;
};

router.get('/', (req, res, next) => {
  let { seasonId, scoringPeriodId } = req.query;

  return getBoxScoreForWeek(seasonId, scoringPeriodId)
    .then((boxScores) => {
      return addWeeklyScoreAndWinsToStor(boxScores, scoringPeriodId);
    })
    .then(() => {
      return getTeams();
    })
    .then((teams) => {
      return addTotalPointsToStor(teams);
    })
    .then(() => {
      return updateGoogleSheet(stor);
    })
    .then(() => {
      res.status(200).json(stor);
    })
    .catch((err) => {
      console.log('Error:', err);
      next(err);
    });
});

module.exports = router;
