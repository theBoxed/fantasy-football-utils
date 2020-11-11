// 'use strict';
// const express = require('express');
// const router = express.Router();
// const _ = require('lodash');
// const axios = require('axios');
// const { LEAGUE_ID, SWID, ESPN_S2 } = require('../config');
// const { default: Axios } = require('axios');
// let stor = require('./storage.js');
// const e = require('express');

// axios.defaults.baseURL = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/';

// // Each week there are a series of matchups, we want to submit an array of matchups and determine, who won and who is top 6
// // function determinePoints(matchups) {

// // }

// const _buildRoute = ({ base, params }) => `${base}${params}`;

// const _buildAxiosConfig = (config) => {
//   console.log(ESPN_S2, SWID);
//   if (ESPN_S2 && SWID) {
//     const headers = { Cookie: `espn_s2=${ESPN_S2}; SWID=${SWID};` };
//     console.log(headers);
//     return _.merge({}, config, { headers, withCredentials: true });
//   }
// };

// //CREATE A WAY to PASS Season ID, MatchupID, ScoringID

// const getBoxScoreForWeek = () => {
//   const seasonId = 2020;
//   const scoringPeriodId = 8;
//   const route = _buildRoute({
//     base: `${seasonId}/segments/0/leagues/${LEAGUE_ID}`,
//     params: `?view=mMatchup&view=mMatchupScore&matchupPeriodId=${scoringPeriodId}`,
//   });

//   return axios.get(route, _buildAxiosConfig()).then((response) => {
//     return _.get(response.data, 'schedule');
//   });
// };

// const teamReference = {
//   1: 'Brady Fox',
//   2: 'David Wren',
//   3: 'Peter Geissinger',
//   4: 'Nathan Hart',
//   5: 'Michael Bernardino',
//   6: 'Jordan Sacks',
//   7: 'Jake Pearce',
//   8: 'Brad Phillips',
//   9: 'Kyle Dudzinski',
//   10: 'Jonathan Buerger',
//   11: 'Freddy Crawford',
//   12: 'Luke Papendick',
// };


// const top6 = () => {

// }

// let scoresByWeek = {
//     1: [],
//     2: [],
//     3: [],
//     4: [],
//     5: [],
//     6: [],
//     7: [],
//     8: [],
//     9: [],
//     10: [],
//     11: [],
//     12: [],
//     13: []
// }

// kicker score:
//     74: 4 //50+
//     77: 3 //40-49
//     80: 3 // < 30
//     85: missed field goal
//     86: 1 //made PAT
//     88: -3 //missed PAT
//                         madeFieldGoalsFrom50Plus: '74',
//     madeFieldGoalsFrom40To49: '77',
//     madeFieldGoalsFromUnder40: '80',
//     missedFieldGoals: '85',
//     madeExtraPoints: '86',
//     missedExtraPoints: '88',

// const organizeData = (data) => {
// for (let i = 0; i < data.length; i++) {
//     let week = data[i]["matchupPeriodId"];
//     let homeTeam = data[i]["home"]["teamId"];
//     let awayTeam = data[i]["away"]["teamId"];
//     let homeTeamScore = data[i]["home"]["totalPoints"]
//     let awayTeamScore = data[i]['away']['totalPoints'];
//     console.log(scoresByWeek.week);
//     // scoresByWeek.week = scoresByWeek.week.push(homeTeamScore, awayTeamScore);
//     console.log(scoresByWeek);

//     stor[homeTeam]['weeks'][week]['pointsScored'] = homeTeamScore;
//     stor[awayTeam]['weeks'][week]['pointsScored'] = awayTeamScore;
    
//     if(homeTeamScore > awayTeamScore) {
//         stor[homeTeam]['weeks'][week]["wins"] = 1 
//     } else if (awayTeamScore > homeTeamScore) {
//         stor[awayTeam]['weeks'][week]['wins'] = 1; 
//     } else if (awayTeamScore == homeTeamScore) {
//         stor[homeTeam]['weeks'][week]['wins'] = .5; 
//         stor[awayTeam]['weeks'][week]['wins'] = .5; 
//     }

// }    


// return data;


// };

// router.get('/2', (req, res, next) => {
//   const seasonId = 2020;
//   return getBoxScoreForWeek()
//     .then((teams) => {
//       res.status(200).json(teams);
//     })
//     .catch((err) => {
//       console.log('Error in League Info', err);
//       next(err);
//     });
// });

// router.get('/', (req, res, next) => {
//   const seasonId = 2020;
//   return getBoxScoreForWeek()
//     .then((data) => {
//       return organizeData(data);
//     })
//     .then((teams) => {
//       res.status(200).json(stor);
//     })
//     .catch((err) => {
//       console.log('Error in League Info', err);
//       next(err);
//     });
// });

// const getLeagueInfo = () => {
//   console.log(LEAGUE_ID);
//   const seasonId = 2020;
//   const route = _buildRoute({
//     base: `${seasonId}/segments/0/leagues/${LEAGUE_ID}`,
//     params: '?view=mSettings',
//   });

//   return axios.get(route, _buildAxiosConfig()).then((response) => {
//     return _.get(response.data, 'settings');
//   });
// };

// const getTeams = () => {
//   const seasonId = 2020;
//   const scoringPeriodId = 1;
//   const route = _buildRoute({
//     base: `${seasonId}/segments/0/leagues/${LEAGUE_ID}`,
//     params: `?scoringPeriodId=${scoringPeriodId}&view=mTeam`,
//   });

//   return axios.get(route, _buildAxiosConfig()).then((response) => {
//     return _.get(response.data, 'teams');
//   });
// };


// function organizeTeam(data, seasonId) {
//   return data.map((team) => {
//     let keepers = team['draftStrategy'];
//     let record = team['record']['overall'];
//     let aq = team['transactionCounter'];
//     const teamData = {
//       about: {
//         abbrev: team['abbrev'],
//         teamId: team['id'],
//         teamName: team['location'] + team['nickname'],
//         teamLogo: team['logo'],
//         teamOwner: team['owners'],
//         isActive: 'TRUE',
//         firstYear: 'TBD',
//         currentKeepers: keepers['keeperPlayerIds'],
//         futureKeepers: keepers['futureKeeperPlayerIds'],
//       },
//       performance: {
//         divisionId: team['divisionId'],
//         seasonId: seasonId,
//         valuesByState: team['valuesByStat'],
//         currentSeed: team['playoffSeed'],
//         totalPointsScored: record['pointsFor'],
//         totalPointsAgainst: record['pointsAgainst'],
//         record: {
//           wins: record['wins'],
//           losses: record['losses'],
//           ties: record['ties'],
//           streakLength: record['streakLength'],
//           steakType: record['streakType'],
//         },
//       },
//       activity: {
//         aquisitionBudgetSpent: aq['acquisitionBudgetSpent'],
//         remainingAcquisitionBudget: 'TBD',
//         acquisitions: aq['acquisitions'],
//         trades: aq['trades'],
//       },
//     };
//     return teamData;
//   });
// }

// const addTotalPointsToStor = (data) => {

//     for(let i = 0; i < data.length; i++){
//         let teamId = data[i]["id"];
//         stor[teamId]['totalPointsFor'] = data[i]["record"]["overall"]["pointsFor"];
//         stor[teamId]['totalPointsAgainst'] = data[i]["record"]["overall"]["pointsAgainst"];
//     }
//     return;
// }



// router.get('/update', (req, res, next) => {
//     return getTeams().then(data => {
//         return addTotalPointsToStor(data)
//     }).then(() => {
//         return getBoxScoreForWeek()
//     }).then(data2 => {
//         return organizeData(data2)
//     }).then(() => {
//         res.status(200).json(stor)
//     })
// })

// router.get('/teams', (req, res, next) => {
//   const seasonId = 2020;
//   return getTeams().then((data) => {
//     return addTotalPointsToStor()



//   })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       console.log('Error in League Info', err);
//       next(err);
//     });
// });

// router.get('/teams/2', (req, res, next) => {
//   const seasonId = 2020;
//   return getTeams()
//     .then((data) => {
//       return organizeTeam(data, seasonId);
//     })
//     .then((teams) => {
//       res.status(200).json(teams);
//     })
//     .catch((err) => {
//       console.log('Error in League Info', err);
//       next(err);
//     });
// });

// //Get League Info
// // ToDo: ScoringSettings
// //ToDo: Revist Matchup Length
// router.get('/settings', (req, res, next) => {
//   // const seasonId = req
//   return getLeagueInfo()
//     .then((data) => {
//       const draft = data['draftSettings'];
//       const acquisition = data['acquisitionSettings'];
//       const finance = data['financeSettings'];
//       const roster = data['rosterSettings'];
//       const schedule = data['scheduleSettings'];
//       const scoring = data['scoringSettings'];
//       const trades = data['tradeSettings'];

//       const leagueInfo = {
//         draftSettings: {
//           date: draft['date'],
//           pickOrder: draft['pickOrder'],
//           keeperCount: draft['keeperCountFuture'],
//         },
//         acquistionSettings: {
//           acquisitionBudget: acquisition['acquisitionBudget'],
//         },
//         financeSettings: {
//           entryFee: finance['entryFee'],
//         },
//         leagueName: data['name'],
//         rosterSettings: {
//           lineupCounts: roster['lineupSlotCounts'],
//           rosterCounts: roster['positionLimites'],
//         },
//         scheduleSettings: {
//           divisions: schedule['divisions'],
//           regularSeason: {
//             seasonLength: schedule['matchupPeriodCount'],
//             matchupLength: schedule['matchupPeriods'],
//           },
//           playoffs: {
//             playoffLength: 17 - schedule['matchupPeriodCount'],
//             playoffTeams: schedule['playoffTeamCount'],
//           },
//         },
//         tradeSettings: {
//           tradeDeadline: trades['deadlineDate'],
//         },
//       };

//       return leagueInfo;
//     })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       console.log('Error in League Info', err);
//       next(err);
//     });
// });

// module.exports = router;
