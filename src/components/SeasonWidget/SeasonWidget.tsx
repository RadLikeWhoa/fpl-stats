import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { aggregateStats, getAllPlayers, head, thousandsSeparator, sumNumbers, reduce, round, getPointsLabel } from '../../utilities'
import { SiteLink } from '../SiteLink'
import { ElementStats, StatData } from '../../types'

const getAggregateValues = (players: StatData[], key: keyof ElementStats): number[] => aggregateStats(players, key).map(stat => stat.value)

const SeasonWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const chips = useSelector((state: RootState) => state.stats.chips)

    const history = useSelector((state: RootState) => state.history.data)

    const entry = useSelector((state: RootState) => state.entry.data)

    if (!stats || !history || !chips || !entry) {
        return (
            <Widget title="Season" />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const reds = getAggregateValues(allPlayers, 'red_cards')
    const yellows = getAggregateValues(allPlayers, 'yellow_cards')
    const goals = getAggregateValues(allPlayers, 'goals_scored')
    const assists = getAggregateValues(allPlayers, 'assists')
    const cleanSheets = getAggregateValues(allPlayers, 'clean_sheets')
    const goalsConceded = getAggregateValues(allPlayers, 'goals_conceded')
    const ownGoals = getAggregateValues(allPlayers, 'own_goals')
    const saves = getAggregateValues(allPlayers, 'saves')
    const minutes = getAggregateValues(allPlayers, 'minutes')
    const penaltiesMissed = getAggregateValues(allPlayers, 'penalties_missed')
    const penaltiesSaved = getAggregateValues(allPlayers, 'penalties_saved')
    const inDreamteam = getAggregateValues(allPlayers, 'in_dreamteam')
    const bps = getAggregateValues(allPlayers, 'bps')
    const bonus = getAggregateValues(allPlayers, 'bonus')

    const totalTransfers = reduce(history.current, el => el.event_transfers)
    const totalHits = reduce(history.current, el => el.event_transfers_cost / 4)
    const totalBenched = reduce(history.current, el => el.points_on_bench)

    const tc = allPlayers
        .find(player => player.data.findIndex(data => data.multiplier === 3) !== -1)
        ?.data
        .find(data => data.multiplier === 3)

    const bbWeek = head(Object.entries(chips).find(([ gw, chip ]) => chip === 'bboost') || [])

    const bbPoints = bbWeek
        ? sumNumbers(allPlayers
            .filter(player => (player.data[Number(bbWeek) - 1].position || 0) > 11)
            .map(player => player.data[Number(bbWeek) - 1].points || 0))
        : null

    const doubleDigitHauls = reduce(allPlayers.map(player => player.data.filter(data => (data.rawPoints || 0) > 9).length), el => el)
    const totalPlays = reduce(allPlayers.map(player => player.data.filter(data => data.multiplier !== null).length), el => el)

    return (
        <Widget title="Season">
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Total Transfers Made</span>
                    <span>
                        <SiteLink target="transfers" label={`${totalTransfers}`} />
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Total Hits Taken</span>
                    <span>{totalHits} ({getPointsLabel(totalHits * -4)}{entry.summary_overall_points > 0 ? `, ${round(totalHits * 4 / entry.summary_overall_points * 100)}%)` : ')'}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Points on Bench</span>
                    <span>{getPointsLabel(totalBenched)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Double Digit Hauls</span>
                    <span>{doubleDigitHauls} {totalPlays > 0 && `(${round(doubleDigitHauls / totalPlays)}%)`}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Red Cards</span>
                    <span>{sumNumbers(reds)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Yellow Cards</span>
                    <span>{sumNumbers(yellows)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Goals Scored</span>
                    <span>{sumNumbers(goals)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Goals Conceded</span>
                    <span>{sumNumbers(goalsConceded)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Assists</span>
                    <span>{sumNumbers(assists)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Clean Sheets</span>
                    <span>{sumNumbers(cleanSheets)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Own Goals</span>
                    <span>{sumNumbers(ownGoals)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Saves</span>
                    <span>{sumNumbers(saves)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Minutes Played</span>
                    <span>{thousandsSeparator(sumNumbers(minutes))}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Penalties Missed</span>
                    <span>{sumNumbers(penaltiesMissed)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Penalties Saved</span>
                    <span>{sumNumbers(penaltiesSaved)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Times in Dreamteam</span>
                    <span>{sumNumbers(inDreamteam)}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total BPS</span>
                    <span>{thousandsSeparator(sumNumbers(bps))}</span>
                </li>
                <li className="widget__list__item">
                    <span>Total Bonus Points</span>
                    <span>{thousandsSeparator(sumNumbers(bonus))}</span>
                </li>
                {tc !== undefined && (
                    <li className="widget__list__item">
                        <span>Triple Captain Points Gained</span>
                        <span>
                            {getPointsLabel((tc.points || 0) / 3)}
                            {' '}
                            (
                                <SiteLink event={tc.event.id} />
                            )
                        </span>
                    </li>
                )}
                {bbPoints !== null && (
                    <li className="widget__list__item">
                        <span>Bench Boost Points Gained</span>
                        <span>
                            {getPointsLabel(bbPoints)}
                            {' '}
                            (
                                <SiteLink event={Number(bbWeek)} />
                            )
                        </span>
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default SeasonWidget