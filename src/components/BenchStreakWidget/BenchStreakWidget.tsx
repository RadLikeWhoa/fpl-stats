import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
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

    const streakers = sort(allPlayers, el => el.aggregates.streaks.bench?.length || 0).slice(0, MAX_ITEMS)

    return (
        <Widget title="Highest Bench Appearance Streaks">
            <ul className="widget__list">
                {streakers.map(streaker => {
                    const streak = streaker.aggregates.streaks.bench

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
                                    {getGWCountLabel(streak.length)}
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