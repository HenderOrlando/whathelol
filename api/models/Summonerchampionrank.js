/**
 * Summonerchampionrank.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      summoner: {
          model: 'summoner'
      },
      champion: {
          model: 'champion'
      },
      season: {
          type: 'string',
          enum: ['SEASON2016', 'SEASON2015', 'SEASON2014', 'SEASON3']
      },
      modifyDate: {
          type: 'datetime'
      },
      averageAssists: {
          type: 'integer'
      },
      averageChampionsKilled: {
          type: 'integer'
      },
      averageCombatPlayerScore: {
          type: 'integer'
      },
      averageNodeCapture: {
          type: 'integer'
      },
      averageNodeCaptureAssist: {
          type: 'integer'
      },
      averageNodeNeutralize: {
          type: 'integer'
      },
      averageNodeNeutralizeAssist: {
          type: 'integer'
      },
      averageNumDeaths: {
          type: 'integer'
      },
      averageObjectivePlayerScore: {
          type: 'integer'
      },
      averageTeamObjective: {
          type: 'integer'
      },
      averageTotalPlayerScore: {
          type: 'integer'
      },
      botGamesPlayed: {
          type: 'integer'
      },
      killingSpree: {
          type: 'integer'
      },
      maxAssists: {
          type: 'integer'
      },
      maxChampionsKilled: {
          type: 'integer'
      },
      maxCombatPlayerScore: {
          type: 'integer'
      },
      maxLargestCriticalStrike: {
          type: 'integer'
      },
      maxLargestKillingSpree: {
          type: 'integer'
      },
      maxNodeCapture: {
          type: 'integer'
      },
      maxNodeCaptureAssist: {
          type: 'integer'
      },
      maxNodeNeutralize: {
          type: 'integer'
      },
      maxNodeNeutralizeAssist: {
          type: 'integer'
      },
      maxNumDeaths: {
          type: 'integer'
      },
      maxObjectivePlayerScore: {
          type: 'integer'
      },
      maxTeamObjective: {
          type: 'integer'
      },
      maxTimePlayed: {
          type: 'integer'
      },
      maxTimeSpentLiving: {
          type: 'integer'
      },
      maxTotalPlayerScore: {
          type: 'integer'
      },
      mostChampionKillsPerSession: {
          type: 'integer'
      },
      mostSpellsCast: {
          type: 'integer'
      },
      normalGamesPlayed: {
          type: 'integer'
      },
      rankedPremadeGamesPlayed: {
          type: 'integer'
      },
      rankedSoloGamesPlayed: {
          type: 'integer'
      },
      totalAssists: {
          type: 'integer'
      },
      totalChampionKills: {
          type: 'integer'
      },
      totalDamageDealt: {
          type: 'integer'
      },
      totalDamageTaken: {
          type: 'integer'
      },
      totalDeathsPerSession: {
          type: 'integer'
      },
      totalDoubleKills: {
          type: 'integer'
      },
      totalFirstBlood: {
          type: 'integer'
      },
      totalGoldEarned: {
          type: 'integer'
      },
      totalHeal: {
          type: 'integer'
      },
      totalMagicDamageDealt: {
          type: 'integer'
      },
      totalMinionKills: {
          type: 'integer'
      },
      totalNeutralMinionsKilled: {
          type: 'integer'
      },
      totalNodeCapture: {
          type: 'integer'
      },
      totalNodeNeutralize: {
          type: 'integer'
      },
      totalPentaKills: {
          type: 'integer'
      },
      totalPhysicalDamageDealt: {
          type: 'integer'
      },
      totalQuadraKills: {
          type: 'integer'
      },
      totalSessionsLost: {
          type: 'integer'
      },
      totalSessionsPlayed: {
          type: 'integer'
      },
      totalSessionsWon: {
          type: 'integer'
      },
      totalTripleKills: {
          type: 'integer'
      },
      totalTurretsKilled: {
          type: 'integer'
      },
      totalUnrealKills: {
          type: 'integer'
      }
  }
};

