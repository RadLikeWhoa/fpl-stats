import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import {
    getAllPlayers,
    head,
    thousandsSeparator,
    sumNumbers,
    reduce,
    round,
    getPointsLabel,
    last,
} from '../../utilities'
import { SiteLink } from '../SiteLink'
import { StatData } from '../../types'
import { StatAggregateTotals } from '../../types'
import { FilteredData } from '../Dashboard/Dashboard'

const TITLE = 'Season'

const getAggregateValues = (players: StatData[], key: keyof StatAggregateTotals): number =>
    sumNumbers(players.map(player => player.aggregates.totals[key]))

type Props = {
    data: FilteredData | undefined
}

const SeasonWidget: React.FC<Props> = (props: Props) => {
    const rawHistory = useSelector((state: RootState) => state.history.data)
    const entry = useSelector((state: RootState) => state.entry.data)

    if (!props.data || !entry) {
        return <Widget title={TITLE} />
    }

    const history = props.data.history

    const allPlayers = getAllPlayers(props.data.stats.data)

    const reds = getAggregateValues(allPlayers, 'redCards')
    const yellows = getAggregateValues(allPlayers, 'yellowCards')
    const goals = getAggregateValues(allPlayers, 'goals')
    const assists = getAggregateValues(allPlayers, 'assists')
    const cleanSheets = getAggregateValues(allPlayers, 'cleanSheets')
    const goalsConceded = getAggregateValues(allPlayers, 'goalsConceded')
    const ownGoals = getAggregateValues(allPlayers, 'ownGoals')
    const saves = getAggregateValues(allPlayers, 'saves')
    const minutes = getAggregateValues(allPlayers, 'minutes')
    const penaltiesMissed = getAggregateValues(allPlayers, 'penaltiesMissed')
    const penaltiesSaved = getAggregateValues(allPlayers, 'penaltiesSaved')
    const inDreamteam = getAggregateValues(allPlayers, 'timesInDreamteam')
    const bps = getAggregateValues(allPlayers, 'bps')
    const bonus = getAggregateValues(allPlayers, 'bonus')

    const totalTransfers = reduce(history.current, el => el.event_transfers)
    const totalHits = reduce(history.current, el => el.event_transfers_cost / 4)
    const totalBenched = reduce(history.current, el => el.points_on_bench)

    const tc = allPlayers
        .find(player => [...player.data].findIndex(data => data.multiplier === 3) !== -1)
        ?.data.find(data => data.multiplier === 3)

    const bbWeek = head(Object.entries(props.data.stats.chips).find(([gw, chip]) => chip === 'bboost') || [])

    const bbPoints = bbWeek
        ? sumNumbers(
              allPlayers
                  .filter(player => ([...player.data][Number(bbWeek) - 1]?.position || 0) > 11)
                  .map(player => [...player.data][Number(bbWeek) - 1]?.points || 0)
          )
        : null

    const doubleDigitHauls = reduce(
        allPlayers.map(player => [...player.data].filter(data => (data.rawPoints || 0) > 9).length),
        el => el
    )

    const totalPlays = reduce(
        allPlayers.map(player => player.data.filter(data => data.multiplier !== null).length),
        el => el
    )

    const totalPoints =
        (last(history.current)?.total_points || 0) -
        (rawHistory?.current?.find(event => event.event === (head(history.current)?.event || 1) - 1)?.total_points || 0)

    return (
        <Widget title={TITLE}>
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Total Transfers Made</span>
                    <span>
                        <SiteLink target="transfers" label={`${totalTransfers}`} />
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Total Hits Taken</span>
                    <span>
                        <b>{totalHits}</b> ({getPointsLabel(totalHits * -4)},{' '}
                        {entry.summary_overall_points > 0 ? round(((totalHits * 4) / totalPoints) * 100) : 0}
                        %)
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Total Points</span>
                    <b>{getPointsLabel(thousandsSeparator(totalPoints))}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Points on Bench</span>
                    <b>{getPointsLabel(thousandsSeparator(totalBenched))}</b>
                </li>
                <li className="widget__list__item">
                    <span>Double Digit Hauls</span>
                    <span>
                        <b>{doubleDigitHauls}</b>
                        {totalPlays > 0 && ` (${round(doubleDigitHauls / totalPlays)}%)`}
                    </span>
                </li>
                {tc !== undefined && (
                    <li className="widget__list__item">
                        <span>Triple Captain Points Gained</span>
                        <span>
                            <b>{getPointsLabel((tc.points || 0) / 3)}</b> (
                            <SiteLink event={tc.event.id} />)
                        </span>
                    </li>
                )}
                {bbPoints !== null && (
                    <li className="widget__list__item">
                        <span>Bench Boost Points Gained</span>
                        <span>
                            <b>{getPointsLabel(bbPoints)}</b> (
                            <SiteLink event={Number(bbWeek)} />)
                        </span>
                    </li>
                )}
                <li className="widget__list__item">
                    <span>Total Goals Scored</span>
                    <b>{goals}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Assists</span>
                    <b>{assists}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Own Goals</span>
                    <b>{ownGoals}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Goals Conceded</span>
                    <b>{goalsConceded}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Clean Sheets</span>
                    <b>{cleanSheets}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Saves</span>
                    <b>{saves}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Penalties Missed</span>
                    <b>{penaltiesMissed}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Penalties Saved</span>
                    <b>{penaltiesSaved}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Minutes Played</span>
                    <b>{thousandsSeparator(minutes)}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Red Cards</span>
                    <b>{reds}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Yellow Cards</span>
                    <b>{yellows}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Bonus Points</span>
                    <b>{thousandsSeparator(bonus)}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total BPS</span>
                    <b>{thousandsSeparator(bps)}</b>
                </li>
                <li className="widget__list__item">
                    <span>Total Times in Dreamteam</span>
                    <b>{inDreamteam}</b>
                </li>
            </ul>
        </Widget>
    )
}

export default SeasonWidget
