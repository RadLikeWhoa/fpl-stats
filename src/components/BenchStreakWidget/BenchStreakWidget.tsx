import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getBenchStreak } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 10

const BenchStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const id = useSelector((state: RootState) => state.settings.id)

    if (!stats) {
        return (
            <Widget
                title="Highest Bench Appearance Streaks"
                loading={isLoadingStats}
                cloaked={!id}
            />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const streakers = allPlayers.sort((a, b) => (getBenchStreak(b)?.length || 0) - (getBenchStreak(a)?.length || 0)).slice(0, MAX_ITEMS)

    return (
        <Widget
            title="Highest Bench Appearance Streaks"
            loading={isLoadingStats}
            cloaked={!id}
        >
            <ul className="widget__list">
                {streakers.map(streaker => {
                    const streak = getBenchStreak(streaker)

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
                                    ({streak.length} GWs)
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default BenchStreakWidget