import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getSelectionStreak } from '../../utilities'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 10

const SelectionStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const id = useSelector((state: RootState) => state.settings.id)

    if (!stats) {
        return (
            <Widget
                title="Highest Selection Streaks"
                loading={isLoadingStats}
                cloaked={!id}
            />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const streakers = allPlayers.sort((a, b) => {
        const aStreak = getSelectionStreak(a)
        const bStreak = getSelectionStreak(b)

        const aStreakLength = getSelectionStreak(a)?.length || 0
        const bStreakLength = getSelectionStreak(b)?.length || 0

        if (bStreakLength - aStreakLength === 0) {
            return (bStreak?.points || 0) - (aStreak?.points || 0)
        }

        return bStreakLength - aStreakLength
    }).slice(0, MAX_ITEMS)

    return (
        <Widget
            title="Highest Selection Streaks"
            loading={isLoadingStats}
            cloaked={!id}
        >
            <ul className="widget__list">
                {streakers.map(streaker => {
                    const streak = getSelectionStreak(streaker)

                    if (!streak) {
                        return null
                    }

                    return (
                        <li className="widget__list__item">
                            <Player id={streaker.element.id} />
                            <div>
                                <div>
                                    <a href={`https://fantasy.premierleague.com/entry/${id}/event/${streak.start.id}/`} target="_blank" rel="noopener noreferrer">
                                        GW {streak.start.id}
                                    </a>
                                    {' – '}
                                    <a href={`https://fantasy.premierleague.com/entry/${id}/event/${streak.end.id}/`} target="_blank" rel="noopener noreferrer">
                                        GW {streak.end.id}
                                    </a>
                                </div>
                                <div>
                                    (
                                        {streak.length} GWs, {streak.points} pts, {((streak.points || 0) / streak.length).toFixed(1)} <Metric metric="ppg" />
                                    )
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default SelectionStreakWidget