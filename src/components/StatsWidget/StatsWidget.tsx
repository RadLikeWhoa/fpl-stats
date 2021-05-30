import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { ElementStats } from '../../types'
import { getAllPlayers, thousandsSeparator } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'

const StatsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const id = useSelector((state: RootState) => state.settings.id)

    const history = useSelector((state: RootState) => state.history.data)
    const isLoadingHistory = useSelector((state: RootState) => state.history.loading)

    if (!history || !stats) {
        return (
            <Widget
                title="Stats"
                loading={isLoadingHistory || isLoadingStats}
                cloaked={!id}
            />
        )
    }

    const gws = [ ...history.current ].sort((a, b) => b.points - a.points)

    const bestGW = gws[0]
    const worstGW = gws[gws.length - 1]

    const allPlayers = getAllPlayers(stats)

    const aggregateStats = (key: keyof ElementStats) => allPlayers.map(player => ({
        player,
        [key]: player.data.reduce((acc, data) => {
            if (typeof data.stats?.[key] === 'number') {
                return ((data.stats?.[key] as number) || 0) + acc
            }

            if (typeof data.stats?.[key] === 'boolean') {
                return (+(data.stats?.[key] as boolean) || 0) + acc
            }

            return acc
        }, 0)
    })).sort((a, b) => (b[key] as number) - (a[key] as number))[0]

    const reds = aggregateStats('red_cards')
    const yellows = aggregateStats('yellow_cards')
    const goals = aggregateStats('goals_scored')
    const assists = aggregateStats('assists')
    const cleanSheets = aggregateStats('clean_sheets')
    const goalsConceded = aggregateStats('goals_conceded')
    const ownGoals = aggregateStats('own_goals')
    const saves = aggregateStats('saves')
    const minutes = aggregateStats('minutes')
    const penaltiesMissed = aggregateStats('penalties_missed')
    const penaltiesSaved = aggregateStats('penalties_saved')
    const inDreamteam = aggregateStats('in_dreamteam')
    const bps = aggregateStats('bps')
    const bonus = aggregateStats('bonus')

    const totalTransfers = history.current.reduce((acc,event) => acc + event.event_transfers, 0)
    const totalHits = history.current.reduce((acc,event) => acc + event.event_transfers_cost / 4, 0)
    const totalBenched = history.current.reduce((acc,event) => acc + event.points_on_bench, 0)

    const mostCaptaincies = allPlayers.map(player => ({
        player,
        captaincies: player.data.filter(data => data.multiplier && data.multiplier > 1).length,
    })).sort((a, b) => b.captaincies - a.captaincies)[0]

    const topReturner = allPlayers.map(player => ({
        ...player,
        data: [ ...player.data ].sort((a, b) => (b.points || 0) - (a.points || 0)),
    }))
    .sort((a, b) => (b.data[0].points || 0) - (a.data[0].points || 0))[0]

    return (
        <Widget
            title="Stats"
            loading={isLoadingHistory || isLoadingStats}
            cloaked={!id}
        >
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Total Transfers Made</span>
                    <span>
                        <a href={`https://fantasy.premierleague.com/entry/${id}/transfers`} target="_blank" rel="noopener noreferrer">
                            {totalTransfers}
                        </a>
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Total Hits Taken</span>
                    <span>{totalHits} ({totalHits * -4} pts)</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Points on Bench</span>
                    <span>{totalBenched} pts</span>
                </li>
                <li className="widget__list__item">
                    <span>Best Gameweek</span>
                    <span>
                        <a href={`https://fantasy.premierleague.com/entry/${id}/event/${bestGW.event}/`} target="_blank" rel="noopener noreferrer">
                            GW {bestGW.event}
                        </a>
                        {' '}
                        ({bestGW.points} pts)
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Worst Gameweek</span>
                    <span>
                        <a href={`https://fantasy.premierleague.com/entry/${id}/event/${worstGW.event}/`} target="_blank" rel="noopener noreferrer">
                            GW {worstGW.event}
                        </a>
                        {' '}
                        ({worstGW.points} pts)
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Top Returner</span>
                    <span>
                        <Player
                            id={topReturner.element.id}
                            suffix={() => (
                                <>
                                    {' '}
                                    (
                                        {topReturner.data[0].points} pts,
                                        {' '}
                                        <a href={`https://fantasy.premierleague.com/entry/${id}/event/${topReturner.data[0].event.id}/`} target="_blank" rel="noopener noreferrer">
                                            GW {topReturner.data[0].event.id}
                                        </a>
                                    )
                                </>
                            )}
                            condensed
                        />
                    </span>
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

export default StatsWidget