import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getTopStatAggregate, getTotalBenchPoints, getTotalPoints, getTotalStarts, thousandsSeparator, round } from '../../utilities'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const PlayerStatsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const history = useSelector((state: RootState) => state.history.data)

    if (!history || !stats) {
        return (
            <Widget title="Player Stats" />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const reds = getTopStatAggregate(allPlayers, 'red_cards')
    const yellows = getTopStatAggregate(allPlayers, 'yellow_cards')
    const goals = getTopStatAggregate(allPlayers, 'goals_scored')
    const assists = getTopStatAggregate(allPlayers, 'assists')
    const cleanSheets = getTopStatAggregate(allPlayers, 'clean_sheets')
    const goalsConceded = getTopStatAggregate(allPlayers, 'goals_conceded')
    const ownGoals = getTopStatAggregate(allPlayers, 'own_goals')
    const saves = getTopStatAggregate(allPlayers, 'saves')
    const minutes = getTopStatAggregate(allPlayers, 'minutes')
    const penaltiesMissed = getTopStatAggregate(allPlayers, 'penalties_missed')
    const penaltiesSaved = getTopStatAggregate(allPlayers, 'penalties_saved')
    const inDreamteam = getTopStatAggregate(allPlayers, 'in_dreamteam')
    const bps = getTopStatAggregate(allPlayers, 'bps')
    const bonus = getTopStatAggregate(allPlayers, 'bonus')

    const mostCaptaincies = allPlayers.map(player => ({
        player,
        captaincies: player.data.filter(data => data.multiplier && data.multiplier > 1).length,
    })).sort((a, b) => b.captaincies - a.captaincies)[0]

    const topReturner = allPlayers
        .map(player => ({
            ...player,
            data: [ ...player.data ].sort((a, b) => (b.points || 0) - (a.points || 0)),
        }))
        .sort((a, b) => (b.data[0].points || 0) - (a.data[0].points || 0))[0]

    const topBenchGWReturner = allPlayers
        .map(player => ({
            ...player,
            data: [ ...player.data ].filter(data => data.multiplier === 0).sort((a, b) => (b.rawPoints || 0) - (a.rawPoints || 0)),
        }))
        .filter(player => player.data.length)
        .sort((a, b) => (b.data[0].rawPoints || 0) - (a.data[0].rawPoints || 0))[0]

    const topSeasonReturner = allPlayers.sort((a, b) => getTotalPoints(b) - getTotalPoints(a))[0]
    const topBenchReturner = allPlayers.sort((a, b) => getTotalBenchPoints(b) - getTotalBenchPoints(a))[0]

    return (
        <Widget title="Player Stats">
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Top GW Returner</span>
                    <span>
                        <Player
                            id={topReturner.element.id}
                            suffix={() => (
                                <>
                                    {' '}
                                    (
                                        {topReturner.data[0].points} pts,
                                        {' '}
                                        <SiteLink event={topReturner.data[0].event.id} />
                                    )
                                </>
                            )}
                            condensed
                        />
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Top Season Returner</span>
                    <span>
                        <Player
                            id={topSeasonReturner.element.id}
                            suffix={() => (
                                <>
                                    {' '}
                                    (
                                        {getTotalPoints(topSeasonReturner)} pts,
                                        {' '}
                                        {round(getTotalPoints(topSeasonReturner) / getTotalStarts(topSeasonReturner))}
                                        {' '}
                                        <Metric metric="ppg" />
                                    )
                                </>
                            )}
                            condensed
                        />
                    </span>
                </li>
                {topBenchGWReturner.data[0].multiplier === 0 && (
                    <li className="widget__list__item">
                        <span>Top GW Bench Returner</span>
                        <span>
                            <Player
                                id={topBenchGWReturner.element.id}
                                suffix={() => (
                                    <>
                                        {' '}
                                        (
                                            {topBenchGWReturner.data[0].rawPoints} pts,
                                            {' '}
                                            <SiteLink event={topBenchGWReturner.data[0].event.id} />
                                        )
                                    </>
                                )}
                                condensed
                            />
                        </span>
                    </li>
                )}
                <li className="widget__list__item">
                    <span>Most Points While Benched</span>
                    <Player
                        id={topBenchReturner.element.id}
                        suffix={() => (
                            <>
                                {' '}
                                (
                                    {getTotalBenchPoints(topBenchReturner)} pts,
                                    {' '}
                                    {round(getTotalBenchPoints(topBenchReturner) / topBenchReturner.data.filter(data => data.multiplier === 0).length)}
                                    {' '}
                                    <Metric metric="ppg" />
                                )
                            </>
                        )}
                        condensed
                    />
                </li>
                {reds.red_cards > 0 && (
                    <li className="widget__list__item">
                        <span>Most Red Cards</span>
                        <Player id={reds.player.element.id} suffix={`${reds.red_cards}`} condensed />
                    </li>
                )}
                {yellows.yellow_cards > 0 && (
                    <li className="widget__list__item">
                        <span>Most Yellow Cards</span>
                        <Player id={yellows.player.element.id} suffix={`${yellows.yellow_cards}`} condensed />
                    </li>
                )}
                {goals.goals_scored > 0 && (
                    <li className="widget__list__item">
                        <span>Top Scorer</span>
                        <Player id={goals.player.element.id} suffix={`${goals.goals_scored}`} condensed />
                    </li>
                )}
                {assists.assists > 0 && (
                    <li className="widget__list__item">
                        <span>Most Assists</span>
                        <Player id={assists.player.element.id} suffix={`${assists.assists}`} condensed />
                    </li>
                )}
                {bonus.bonus > 0 && (
                    <li className="widget__list__item">
                        <span>Most Bonus Points</span>
                        <Player id={bonus.player.element.id} suffix={`${bonus.bonus}`} condensed />
                    </li>
                )}
                {bps.bps > 0 && (
                    <li className="widget__list__item">
                        <span>Highest Total BPS</span>
                        <Player id={bps.player.element.id} suffix={`${bps.bps}`} condensed />
                    </li>
                )}
                {cleanSheets.clean_sheets > 0 && (
                    <li className="widget__list__item">
                        <span>Most Clean Sheets</span>
                        <Player id={cleanSheets.player.element.id} suffix={`${cleanSheets.clean_sheets}`} condensed />
                    </li>
                )}
                {goalsConceded.goals_conceded > 0 && (
                    <li className="widget__list__item">
                        <span>Most Goals Conceded</span>
                        <Player id={goalsConceded.player.element.id} suffix={`${goalsConceded.goals_conceded}`} condensed />
                    </li>
                )}
                {saves.saves > 0 && (
                    <li className="widget__list__item">
                        <span>Most Saves</span>
                        <Player id={saves.player.element.id} suffix={`${saves.saves}`} condensed />
                    </li>
                )}
                {ownGoals.own_goals > 0 && (
                    <li className="widget__list__item">
                        <span>Most Own Goals</span>
                        <Player id={ownGoals.player.element.id} suffix={`${ownGoals.own_goals}`} condensed />
                    </li>
                )}
                {penaltiesMissed.penalties_missed > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Missed</span>
                        <Player id={penaltiesMissed.player.element.id} suffix={`${penaltiesMissed.penalties_missed}`} condensed />
                    </li>
                )}
                {penaltiesSaved.penalties_saved > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Saved</span>
                        <Player id={penaltiesSaved.player.element.id} suffix={`${penaltiesSaved.penalties_saved}`} condensed />
                    </li>
                )}
                {minutes.minutes > 0 && (
                    <li className="widget__list__item">
                        <span>Most Minutes</span>
                        <Player id={minutes.player.element.id} suffix={`${thousandsSeparator(minutes.minutes as number)}`} condensed />
                    </li>
                )}
                {inDreamteam.in_dreamteam > 0 && (
                    <li className="widget__list__item">
                        <span>Most Times in Dreamteam</span>
                        <Player id={inDreamteam.player.element.id} suffix={`${inDreamteam.in_dreamteam}`} condensed />
                    </li>
                )}
                {mostCaptaincies.captaincies > 0 && (
                    <li className="widget__list__item">
                        <span>Most Captaincies</span>
                        <Player id={mostCaptaincies.player.element.id} suffix={`${mostCaptaincies.captaincies}`} condensed />
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default PlayerStatsWidget