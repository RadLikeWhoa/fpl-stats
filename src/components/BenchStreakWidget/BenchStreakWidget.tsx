import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const MAX_ITEMS = 10
const TITLE = 'Highest Bench Appearance Streaks'

const BenchStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return <Widget title={TITLE} />
    }

    const streakers = sort(getAllPlayers(stats), el => el.aggregates.streaks.bench?.length || 0)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={streakers}
            max={MAX_ITEMS}
            renderItem={streaker => {
                const streak = streaker.aggregates.streaks.bench

                if (!streak) {
                    return null
                }

                return (
                    <>
                        <Player id={streaker.element.id} />
                        <div>
                            <div className="duration">
                                <SiteLink event={streak.start.id} /> – <SiteLink event={streak.end.id} />
                            </div>
                            <div className="muted">{getGWCountLabel(streak.length)}</div>
                        </div>
                    </>
                )
            }}
        />
    )
}

export default BenchStreakWidget
