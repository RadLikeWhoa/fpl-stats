import React, { useContext } from 'react'
import { useMeanValue } from '../../hooks'
import { StatAggregateStreaks } from '../../types'
import { getAllPlayers, getGWCountLabel, getPointsLabel, round } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'

const MAX_ITEMS = 5

type Props = {
    title: string
    metric: keyof StatAggregateStreaks
    showDetailedStats?: boolean
}

const StreakWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={props.title} />
    }

    const stats = data.stats.data

    const streakers = getAllPlayers(stats)
        .sort((a, b) => {
            const aStreak = a.aggregates.streaks[props.metric]
            const bStreak = b.aggregates.streaks[props.metric]

            const aStreakLength = a.aggregates.streaks[props.metric]?.length || 0
            const bStreakLength = b.aggregates.streaks[props.metric]?.length || 0

            if (bStreakLength - aStreakLength === 0) {
                return (bStreak?.totalPoints || 0) - (aStreak?.totalPoints || 0)
            }

            return bStreakLength - aStreakLength
        })
        .filter(streaker => streaker.aggregates.streaks[props.metric] !== null)

    return (
        <BasePlayerWidget
            title={props.title}
            players={streakers}
            max={MAX_ITEMS}
            renderItem={streaker => {
                const streak = streaker.aggregates.streaks[props.metric]

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
                                {props.showDetailedStats ? (
                                    <>
                                        {getGWCountLabel(streak.length)}, {getPointsLabel(streak.totalPoints || 0)},{' '}
                                        {round(meanValue(streak.points || []))} <Metric metric="ppg" />
                                    </>
                                ) : (
                                    <div className="muted">{getGWCountLabel(streak.length)}</div>
                                )}
                            </div>
                        </div>
                    </>
                )
            }}
        />
    )
}

export default StreakWidget
