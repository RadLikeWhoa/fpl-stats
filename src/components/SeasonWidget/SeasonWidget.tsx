import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { aggregateStats, getAllPlayers, thousandsSeparator } from '../../utilities'
import { sumNumbers } from '../../utilities/numbers';

const SeasonWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const chips = useSelector((state: RootState) => state.stats.chips)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const history = useSelector((state: RootState) => state.history.data)
    const isLoadingHistory = useSelector((state: RootState) => state.history.loading)

    if (!stats || !history || !chips) {
        return (
            <Widget
                title="Season"
                loading={isLoadingStats || isLoadingHistory}
                cloaked={!id}
            />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const reds = aggregateStats(allPlayers, 'red_cards').map(stat => stat['red_cards'] as number)
    const yellows = aggregateStats(allPlayers, 'yellow_cards').map(stat => stat['yellow_cards'] as number)
    const goals = aggregateStats(allPlayers, 'goals_scored').map(stat => stat['goals_scored'] as number)
    const assists = aggregateStats(allPlayers, 'assists').map(stat => stat['assists'] as number)
    const cleanSheets = aggregateStats(allPlayers, 'clean_sheets').map(stat => stat['clean_sheets'] as number)
    const goalsConceded = aggregateStats(allPlayers, 'goals_conceded').map(stat => stat['goals_conceded'] as number)
    const ownGoals = aggregateStats(allPlayers, 'own_goals').map(stat => stat['own_goals'] as number)
    const saves = aggregateStats(allPlayers, 'saves').map(stat => stat['saves'] as number)
    const minutes = aggregateStats(allPlayers, 'minutes').map(stat => stat['minutes'] as number)
    const penaltiesMissed = aggregateStats(allPlayers, 'penalties_missed').map(stat => stat['penalties_missed'] as number)
    const penaltiesSaved = aggregateStats(allPlayers, 'penalties_saved').map(stat => stat['penalties_saved'] as number)
    const inDreamteam = aggregateStats(allPlayers, 'in_dreamteam').map(stat => stat['in_dreamteam'] as number)
    const bps = aggregateStats(allPlayers, 'bps').map(stat => stat['bps'] as number)
    const bonus = aggregateStats(allPlayers, 'bonus').map(stat => stat['bonus'] as number)

    const totalTransfers = history.current.reduce((acc,event) => acc + event.event_transfers, 0)
    const totalHits = history.current.reduce((acc,event) => acc + event.event_transfers_cost / 4, 0)
    const totalBenched = history.current.reduce((acc,event) => acc + event.points_on_bench, 0)

    const tc = allPlayers
        .find(player => player.data.findIndex(data => data.multiplier === 3) !== -1)
        ?.data
        .find(data => data.multiplier === 3)

    const bbWeek = Object.entries(chips).find(([ gw, chip ]) => chip === 'bboost')?.[0]

    const bbPoints = bbWeek
        ? sumNumbers(allPlayers
            .filter(player => (player.data[Number(bbWeek) - 1].position || 0) > 11)
            .map(player => player.data[Number(bbWeek) - 1].points || 0))
        : null

    return (
        <Widget
            title="Season"
            loading={isLoadingStats || isLoadingHistory}
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
                            {(tc.points || 0) / 3} pts
                            (
                                <a href={`https://fantasy.premierleague.com/entry/${id}/event/${tc.event.id}/`} target="_blank" rel="noopener noreferrer">
                                    GW {tc.event.id}
                                </a>
                            )
                        </span>
                    </li>
                )}
                {bbPoints !== null && (
                    <li className="widget__list__item">
                        <span>Bench Boost Points Gained</span>
                        <span>
                            {bbPoints} pts
                            (
                                <a href={`https://fantasy.premierleague.com/entry/${id}/event/${bbWeek}/`} target="_blank" rel="noopener noreferrer">
                                    GW {bbWeek}
                                </a>
                            )
                        </span>
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default SeasonWidget