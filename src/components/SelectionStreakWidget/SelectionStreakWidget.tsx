import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getGWCountLabel, getPointsLabel, round } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const MAX_ITEMS = 10
const TITLE = 'Highest Selection Streaks'

const SelectionStreakWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return <Widget title={TITLE} />
    }

    const streakers = getAllPlayers(stats)
        .sort((a, b) => {
            const aStreak = a.aggregates.streaks.selection
            const bStreak = b.aggregates.streaks.selection

            const aStreakLength = a.aggregates.streaks.selection?.length || 0
            const bStreakLength = b.aggregates.streaks.selection?.length || 0

            if (bStreakLength - aStreakLength === 0) {
                return (bStreak?.points || 0) - (aStreak?.points || 0)
            }

            return bStreakLength - aStreakLength
        })
        .filter(streaker => streaker.aggregates.streaks.selection !== null)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={streakers}
            max={MAX_ITEMS}
            renderItem={streaker => {
                const streak = streaker.aggregates.streaks.selection

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
                            <div className="muted">
                                {getGWCountLabel(streak.length)}, {getPointsLabel(streak.points || 0)},{' '}
                                {round((streak.points || 0) / streak.length)} <Metric metric="ppg" />
                            </div>
                        </div>
                    </>
                )
            }}
        />
    )
}

export default SelectionStreakWidget
