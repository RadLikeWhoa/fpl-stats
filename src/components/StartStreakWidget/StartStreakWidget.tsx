import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getGWCountLabel, getPointsLabel, round } from '../../utilities'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const MAX_ITEMS = 10

const StartStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Highest Start Streaks" />
        )
    }

    const streakers = getAllPlayers(stats)
        .sort((a, b) => {
            const aStreak = a.aggregates.streaks.start
            const bStreak = b.aggregates.streaks.start

            const aStreakLength = a.aggregates.streaks.start?.length || 0
            const bStreakLength = b.aggregates.streaks.start?.length || 0

            if (bStreakLength - aStreakLength === 0) {
                return (bStreak?.points || 0) - (aStreak?.points || 0)
            }

            return bStreakLength - aStreakLength
        })
        .filter(streaker => streaker.aggregates.streaks.start !== null)
        .slice(0, MAX_ITEMS)

    return (
        <Widget title="Highest Start Streaks">
            {streakers.length > 0 && (
                <ul className="widget__list">
                    {streakers.map(streaker => {
                        const streak = streaker.aggregates.streaks.start

                        if (!streak) {
                            return null
                        }

                        return (
                            <li className="widget__list__item" key={streaker.element.id}>
                                <Player id={streaker.element.id} />
                                <div>
                                    <div className="duration">
                                        <SiteLink event={streak.start.id} /> – <SiteLink event={streak.end.id} />
                                    </div>
                                    <div className="muted">
                                        {getGWCountLabel(streak.length)}, {getPointsLabel(streak.points || 0)}, {round((streak.points || 0) / streak.length)} <Metric metric="ppg" />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Widget>
    )
}

export default StartStreakWidget