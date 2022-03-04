import React, { useContext } from 'react'
import { useMeanValue } from '../../hooks'
import { StatAggregateStreaks, Streak, Element } from '../../types'
import { getAllPlayers, getGWCountLabel, getPointsLabel, normaliseDiacritics, round } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Metric } from '../Metric'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'
import { Widget } from '../Widget'
import { WidgetWithModal } from '../WidgetWithModal'

const MAX_ITEMS = 5

type Props = {
    title: string
    metric: keyof StatAggregateStreaks
    showDetailedStats?: boolean
}

type PlayerStreak = Streak & {
    player: Element
}

const getItemKey = (streak: PlayerStreak) => `${streak.player.id}-${streak.start.id}`

const matchesFilter = (streak: PlayerStreak, query: string) =>
    streak.player.web_name.toLowerCase().includes(normaliseDiacritics(query).toLowerCase())

const StreakWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={props.title} />
    }

    const stats = data.stats.data

    const streaks = getAllPlayers(stats)
        .reduce(
            (acc, player) => [
                ...acc,
                ...(player.aggregates.streaks[props.metric] || [])?.map(streak => ({
                    ...streak,
                    player: player.element,
                })),
            ],
            [] as PlayerStreak[]
        )
        .sort((a, b) => {
            if (a.length !== b.length) {
                return b.length - a.length
            }

            if (props.showDetailedStats && a.totalPoints !== b.totalPoints) {
                return b.totalPoints - a.totalPoints
            }

            return a.player.web_name.localeCompare(b.player.web_name)
        })

    return (
        <WidgetWithModal
            title={props.title}
            max={MAX_ITEMS}
            data={streaks}
            renderItem={streak => {
                return (
                    <>
                        <Player id={streak.player.id} />
                        <div>
                            <div className="duration">
                                <SiteLink event={streak.start.id} />
                                {streak.start.id !== streak.end.id && (
                                    <>
                                        {' '}
                                        - <SiteLink event={streak.end.id} />
                                    </>
                                )}
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
            getItemKey={getItemKey}
            matchesFilter={matchesFilter}
        />
    )
}

export default StreakWidget
