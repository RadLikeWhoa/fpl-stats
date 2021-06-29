import React, { useContext } from 'react'
import { StatData } from '../../types'
import {
    getAllPlayers,
    getTopStatAggregate,
    thousandsSeparator,
    round,
    sort,
    head,
    getPointsLabel,
} from '../../utilities'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'
import { useMeanValue } from '../../hooks'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Player Stats'

const renderTopBenchGWReturner = (returner: StatData): JSX.Element | null => {
    const week = head(returner.data)

    if (!week) {
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
                            ({getPointsLabel(week.rawPoints || 0)}, <SiteLink event={week.event.id} />)
                        </>
                    )}
                    reversed
                />
            </span>
        </li>
    )
}

const PlayerStatsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)
    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={TITLE} />
    }

    const allPlayers = getAllPlayers(data.stats.data)

    if (!allPlayers.length) {
        return <Widget title={TITLE} />
    }

    const reds = getTopStatAggregate(allPlayers, 'redCards')
    const yellows = getTopStatAggregate(allPlayers, 'yellowCards')
    const goals = getTopStatAggregate(allPlayers, 'goals')
    const assists = getTopStatAggregate(allPlayers, 'assists')
    const cleanSheets = getTopStatAggregate(allPlayers, 'cleanSheets')
    const goalsConceded = getTopStatAggregate(allPlayers, 'goalsConceded')
    const ownGoals = getTopStatAggregate(allPlayers, 'ownGoals')
    const saves = getTopStatAggregate(allPlayers, 'saves')
    const minutes = getTopStatAggregate(allPlayers, 'minutes')
    const penaltiesMissed = getTopStatAggregate(allPlayers, 'penaltiesMissed')
    const penaltiesSaved = getTopStatAggregate(allPlayers, 'penaltiesSaved')
    const inDreamteam = getTopStatAggregate(allPlayers, 'timesInDreamteam')
    const bps = getTopStatAggregate(allPlayers, 'bps')
    const bonus = getTopStatAggregate(allPlayers, 'bonus')

    const mostCaptaincies = head(sort(allPlayers, el => el.aggregates.totals.captaincies))

    const topReturner = head(
        sort(
            allPlayers.map(player => ({
                ...player,
                data: sort([...player.data], el => el.points || 0),
            })),
            el => head(el.data)?.points || 0
        )
    )

    const topBenchGWReturner = head(
        sort(
            allPlayers
                .map(player => ({
                    ...player,
                    data: sort(
                        player.data.filter(data => data.multiplier === 0),
                        el => el.rawPoints || 0
                    ),
                }))
                .filter(player => player.data.length),
            el => head(el.data)?.rawPoints || 0
        )
    )

    const topSeasonReturner = head(sort(allPlayers, el => el.aggregates.totals.points))
    const topBenchReturner = head(sort(allPlayers, el => el.aggregates.totals.benchPoints))

    const weeks = data.history.current.length

    const idealCaptain = head(
        sort(
            Object.entries(
                Array.from(Array(weeks).keys())
                    .map((el, index) => head(sort(allPlayers, el => el.data[index].rawPoints || 0)))
                    .reduce(
                        (acc, curr) =>
                            curr
                                ? {
                                      ...acc,
                                      [curr.element.id]: (acc[curr.element.id] ? acc[curr.element.id] : 0) + 1,
                                  }
                                : acc,
                        {} as Record<number, number>
                    )
            ),
            el => el[1]
        )
    )

    return (
        <Widget title={TITLE}>
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
                                            ({getPointsLabel(week.points || 0)}, <SiteLink event={week.event.id} />)
                                        </>
                                    )
                                }}
                                reversed
                            />
                        </span>
                    </li>
                )}
                {topSeasonReturner && (
                    <li className="widget__list__item">
                        <span>Top Season Returner</span>
                        {topSeasonReturner.aggregates.totals.starts > 0 && (
                            <Player
                                id={topSeasonReturner.element.id}
                                suffix={() => (
                                    <>
                                        {' '}
                                        ({getPointsLabel(topSeasonReturner.aggregates.totals.points)},{' '}
                                        {round(
                                            meanValue(
                                                topSeasonReturner.data
                                                    .filter(data => (data.multiplier || 0) > 0)
                                                    .map(data => data.points)
                                            )
                                        )}{' '}
                                        <Metric metric="ppg" />)
                                    </>
                                )}
                                reversed
                            />
                        )}
                    </li>
                )}
                {topBenchGWReturner && renderTopBenchGWReturner(topBenchGWReturner)}
                {topBenchReturner && (
                    <li className="widget__list__item">
                        <span>Most Points While Benched</span>
                        {topBenchReturner.aggregates.totals.benched > 0 && (
                            <Player
                                id={topBenchReturner.element.id}
                                suffix={() => (
                                    <>
                                        {' '}
                                        ({getPointsLabel(topBenchReturner.aggregates.totals.benchPoints)},{' '}
                                        {round(
                                            meanValue(
                                                topBenchReturner.data
                                                    .filter(data => data.multiplier === 0)
                                                    .map(data => data.rawPoints)
                                            )
                                        )}{' '}
                                        <Metric metric="ppg" />)
                                    </>
                                )}
                                reversed
                            />
                        )}
                    </li>
                )}
                {goals && goals.aggregates.totals.goals > 0 && (
                    <li className="widget__list__item">
                        <span>Top Scorer</span>
                        <Player id={goals.element.id} suffix={`${goals.aggregates.totals.goals}`} reversed />
                    </li>
                )}
                {assists && assists.aggregates.totals.assists > 0 && (
                    <li className="widget__list__item">
                        <span>Most Assists</span>
                        <Player id={assists.element.id} suffix={`${assists.aggregates.totals.assists}`} reversed />
                    </li>
                )}
                {ownGoals && ownGoals.aggregates.totals.ownGoals > 0 && (
                    <li className="widget__list__item">
                        <span>Most Own Goals</span>
                        <Player id={ownGoals.element.id} suffix={`${ownGoals.aggregates.totals.ownGoals}`} reversed />
                    </li>
                )}
                {goalsConceded && goalsConceded.aggregates.totals.goalsConceded > 0 && (
                    <li className="widget__list__item">
                        <span>Most Goals Conceded</span>
                        <Player
                            id={goalsConceded.element.id}
                            suffix={`${goalsConceded.aggregates.totals.goalsConceded}`}
                            reversed
                        />
                    </li>
                )}
                {cleanSheets && cleanSheets.aggregates.totals.cleanSheets > 0 && (
                    <li className="widget__list__item">
                        <span>Most Clean Sheets</span>
                        <Player
                            id={cleanSheets.element.id}
                            suffix={`${cleanSheets.aggregates.totals.cleanSheets}`}
                            reversed
                        />
                    </li>
                )}
                {saves && saves.aggregates.totals.saves > 0 && (
                    <li className="widget__list__item">
                        <span>Most Saves</span>
                        <Player id={saves.element.id} suffix={`${saves.aggregates.totals.saves}`} reversed />
                    </li>
                )}
                {penaltiesMissed && penaltiesMissed.aggregates.totals.penaltiesMissed > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Missed</span>
                        <Player
                            id={penaltiesMissed.element.id}
                            suffix={`${penaltiesMissed.aggregates.totals.penaltiesMissed}`}
                            reversed
                        />
                    </li>
                )}
                {penaltiesSaved && penaltiesSaved.aggregates.totals.penaltiesSaved > 0 && (
                    <li className="widget__list__item">
                        <span>Most Penalties Saved</span>
                        <Player
                            id={penaltiesSaved.element.id}
                            suffix={`${penaltiesSaved.aggregates.totals.penaltiesSaved}`}
                            reversed
                        />
                    </li>
                )}
                {minutes && minutes.aggregates.totals.minutes > 0 && (
                    <li className="widget__list__item">
                        <span>Most Minutes</span>
                        <Player
                            id={minutes.element.id}
                            suffix={`${thousandsSeparator(minutes.aggregates.totals.minutes as number)}`}
                            reversed
                        />
                    </li>
                )}
                {reds && reds.aggregates.totals.redCards > 0 && (
                    <li className="widget__list__item">
                        <span>Most Red Cards</span>
                        <Player id={reds.element.id} suffix={`${reds.aggregates.totals.redCards}`} reversed />
                    </li>
                )}
                {yellows && yellows.aggregates.totals.yellowCards > 0 && (
                    <li className="widget__list__item">
                        <span>Most Yellow Cards</span>
                        <Player id={yellows.element.id} suffix={`${yellows.aggregates.totals.yellowCards}`} reversed />
                    </li>
                )}
                {bonus && bonus.aggregates.totals.bonus > 0 && (
                    <li className="widget__list__item">
                        <span>Most Bonus Points</span>
                        <Player id={bonus.element.id} suffix={`${bonus.aggregates.totals.bonus}`} reversed />
                    </li>
                )}
                {bps && bps.aggregates.totals.bps > 0 && (
                    <li className="widget__list__item">
                        <span>Highest Total BPS</span>
                        <Player
                            id={bps.element.id}
                            suffix={`${thousandsSeparator(bps.aggregates.totals.bps)}`}
                            reversed
                        />
                    </li>
                )}
                {inDreamteam && inDreamteam.aggregates.totals.timesInDreamteam > 0 && (
                    <li className="widget__list__item">
                        <span>Most Times in Dreamteam</span>
                        <Player
                            id={inDreamteam.element.id}
                            suffix={`${inDreamteam.aggregates.totals.timesInDreamteam}`}
                            reversed
                        />
                    </li>
                )}
                {mostCaptaincies && mostCaptaincies.aggregates.totals.captaincies > 0 && (
                    <li className="widget__list__item">
                        <span>Most Captaincies</span>
                        <Player
                            id={mostCaptaincies.element.id}
                            suffix={`${mostCaptaincies.aggregates.totals.captaincies}`}
                            reversed
                        />
                    </li>
                )}
                {idealCaptain && (
                    <li className="widget__list__item">
                        <span>Ideal Captain</span>
                        <Player id={Number(idealCaptain[0])} suffix={`${idealCaptain[1]}`} reversed />
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default PlayerStatsWidget
