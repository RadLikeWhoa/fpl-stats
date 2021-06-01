import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { StatData } from '../../types'
import { getAllPlayers, getTopStatAggregate, getTotalBenchPoints, getTotalPoints, getTotalStarts, thousandsSeparator, round, sort, head, getPointsLabel } from '../../utilities'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const renderTopBenchGWReturner = (returner: StatData): JSX.Element | null => {
    const week = head(returner.data)

    if (!week || week.multiplier !== 0) {
        return null
    }

    return (
        <li className="widget__list__item">
            <span>Top GW Bench Returner</span>
            <span>
                <Player
                    id={returner.element.id}
                    suffix={() => (
                        <>
                            {' '}
                            (
                                {getPointsLabel(week.rawPoints || 0)},
                                {' '}
                                <SiteLink event={week.event.id} />
                            )
                        </>
                    )}
                    condensed
                />
            </span>
        </li>
    )
}

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

    const mostCaptaincies = head(sort(
        allPlayers.map(player => ({
            player,
            value: player.data.filter(data => data.multiplier && data.multiplier > 1).length,
        })),
        el => el.value
    ))

    const topReturner = head(sort(
        allPlayers
            .map(player => ({
                ...player,
                data: sort([ ...player.data ], el => el.points || 0),
            })),
        el => head(el.data)?.points || 0
    ))

    const topBenchGWReturner = head(sort(
        allPlayers
            .map(player => ({
                ...player,
                data: sort(player.data.filter(data => data.multiplier === 0), el => el.rawPoints || 0),
            }))
            .filter(player => player.data.length),
        el => head(el.data)?.rawPoints || 0
    ))

    const topSeasonReturner = head(sort(allPlayers, el => getTotalPoints(el)))
    const topBenchReturner = head(sort(allPlayers, el => getTotalBenchPoints(el)))

    const weeks = history.current.length

    const idealCaptain = head(sort(
        Object.entries(Array.from(Array(weeks).keys())
            .map((el, index) => head(sort(allPlayers, el => el.data[index].rawPoints || 0)))
            .reduce((acc, curr) => curr ? ({
                ...acc,
                [curr.element.id]: (acc[curr.element.id] ? acc[curr.element.id] : 0) + 1,
            }) : acc, {} as Record<number, number>)),
        el => el[1]
    ))

    return (
        <Widget title="Player Stats">
            <ul className="widget__list">
                {topReturner && (
                    <li className="widget__list__item">
                        <span>Top GW Returner</span>
                        <span>
                            <Player
                                id={topReturner.element.id}
                                suffix={() => {
                                    const week = head(topReturner.data)

                                    if (!week) {
                                        return null
                                    }

                                    return (
                                        <>
                                            {' '}
                                            (
                                                {getPointsLabel(week.points || 0)},
                                                {' '}
                                                <SiteLink event={week.event.id} />
                                            )
                                        </>
                                    )
                                }}
                                condensed
                            />
                        </span>
                    </li>
                )}
                {topSeasonReturner && (
                    <li className="widget__list__item">
                        <span>Top Season Returner</span>
                        {getTotalStarts(topSeasonReturner) > 0 && (
                            <Player
                                id={topSeasonReturner.element.id}
                                suffix={() => (
                                    <>
                                        {' '}
                                        (
                                            {getPointsLabel(getTotalPoints(topSeasonReturner))},
                                            {' '}
                                            {round(getTotalPoints(topSeasonReturner) / getTotalStarts(topSeasonReturner))}
                                            {' '}
                                            <Metric metric="ppg" />
                                        )
                                    </>
                                )}
                                condensed
                            />
                        )}
                    </li>
                )}
                {topBenchGWReturner && renderTopBenchGWReturner(topBenchGWReturner)}
                {topBenchReturner && (
                    <li className="widget__list__item">
                        <span>Most Points While Benched</span>
                        {topBenchReturner.data.filter(data => data.multiplier === 0).length > 0 && (
                            <Player
                                id={topBenchReturner.element.id}
                                suffix={() => (
                                    <>
                                        {' '}
                                        (
                                            {getPointsLabel(getTotalBenchPoints(topBenchReturner))},
                                            {' '}
                                            {round(getTotalBenchPoints(topBenchReturner) / topBenchReturner.data.filter(data => data.multiplier === 0).length)}
                                            {' '}
                                            <Metric metric="ppg" />
                                        )
                                    </>
                                )}
                                condensed
                            />
                        )}
                    </li>
                )}
                {reds && reds.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Red Cards</span>
                        <Player id={reds.player.element.id} suffix={`${reds.value}`} condensed />
                    </li>
                )}
                {yellows && yellows.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Yellow Cards</span>
                        <Player id={yellows.player.element.id} suffix={`${yellows.value}`} condensed />
                    </li>
                )}
                {goals && goals.value > 0 && (
                    <li className="widget__list__item">
                        <span>Top Scorer</span>
                        <Player id={goals.player.element.id} suffix={`${goals.value}`} condensed />
                    </li>
                )}
                {assists && assists.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Assists</span>
                        <Player id={assists.player.element.id} suffix={`${assists.value}`} condensed />
                    </li>
                )}
                {bonus && bonus.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Bonus Points</span>
                        <Player id={bonus.player.element.id} suffix={`${bonus.value}`} condensed />
                    </li>
                )}
                {bps && bps.value > 0 && (
                    <li className="widget__list__item">
                        <span>Highest Total BPS</span>
                        <Player id={bps.player.element.id} suffix={`${bps.value}`} condensed />
                    </li>
                )}
                {cleanSheets && cleanSheets.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Clean Sheets</span>
                        <Player id={cleanSheets.player.element.id} suffix={`${cleanSheets.value}`} condensed />
                    </li>
                )}
                {goalsConceded && goalsConceded.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Goals Conceded</span>
                        <Player id={goalsConceded.player.element.id} suffix={`${goalsConceded.value}`} condensed />
                    </li>
                )}
                {saves && saves.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Saves</span>
                        <Player id={saves.player.element.id} suffix={`${saves.value}`} condensed />
                    </li>
                )}
                {ownGoals && ownGoals.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Own Goals</span>
                        <Player id={ownGoals.player.element.id} suffix={`${ownGoals.value}`} condensed />
                    </li>
                )}
                {penaltiesMissed && penaltiesMissed.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Missed</span>
                        <Player id={penaltiesMissed.player.element.id} suffix={`${penaltiesMissed.value}`} condensed />
                    </li>
                )}
                {penaltiesSaved && penaltiesSaved.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Saved</span>
                        <Player id={penaltiesSaved.player.element.id} suffix={`${penaltiesSaved.value}`} condensed />
                    </li>
                )}
                {minutes && minutes.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Minutes</span>
                        <Player id={minutes.player.element.id} suffix={`${thousandsSeparator(minutes.value as number)}`} condensed />
                    </li>
                )}
                {inDreamteam && inDreamteam.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Times in Dreamteam</span>
                        <Player id={inDreamteam.player.element.id} suffix={`${inDreamteam.value}`} condensed />
                    </li>
                )}
                {mostCaptaincies && mostCaptaincies.value > 0 && (
                    <li className="widget__list__item">
                        <span>Most Captaincies</span>
                        <Player id={mostCaptaincies.player.element.id} suffix={`${mostCaptaincies.value}`} condensed />
                    </li>
                )}
                {idealCaptain && (
                    <li className="widget__list__item">
                        <span>Ideal Captain</span>
                        <Player id={Number(idealCaptain[0])} suffix={`${idealCaptain[1]}`} condensed />
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default PlayerStatsWidget