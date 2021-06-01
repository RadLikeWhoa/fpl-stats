import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getBenchStreak, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const MAX_ITEMS = 10

const BenchStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Highest Bench Appearance Streaks" />
        )
    }

    const allPlayers = getAllPlayers(stats)

    const streakers = sort(allPlayers, el => getBenchStreak(el)?.length || 0).slice(0, MAX_ITEMS)

    return (
        <Widget title="Highest Bench Appearance Streaks">
            <ul className="widget__list">
                {streakers.map(streaker => {
                    const streak = getBenchStreak(streaker)

                    if (!streak) {
                        return null
                    }

                    return (
                        <li className="widget__list__item" key={streaker.element.id}>
                            <Player id={streaker.element.id} />
                            <div>
                                <div>
                                    <SiteLink event={streak.start.id} />
                                    {' – '}
                                    <SiteLink event={streak.end.id} />
                                </div>
                                <div>
                                    ({getGWCountLabel(streak.length)})
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