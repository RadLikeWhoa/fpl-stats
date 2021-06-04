import React from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, round, sort } from '../../utilities'
import { Player } from '../Player'
import { getGWCountLabel } from '../../utilities/strings'
import { StatData } from '../../types'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredData } from '../Dashboard/Dashboard'

type Props = {
    title: string
    data: FilteredData | undefined
    top?: boolean
}

const MAX_ITEMS = 10

const getPointsShare = (player: StatData): number =>
    100 - (player.aggregates.totals.rawPoints / player.element.total_points) * 100

const MissedPointsShareWidget: React.FC<Props> = (props: Props) => {
    if (!props.data) {
        return <Widget title={props.title} />
    }

    const stats = props.data.stats.data
    const history = props.data.history

    const elements = sort(
        getAllPlayers(stats).filter(player => player.aggregates.totals.points > 0),
        el => getPointsShare(el),
        props.top ? 'desc' : 'asc'
    )

    return (
        <BasePlayerWidget
            title={props.title}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <div>
                        <div>
                            <b>{element.element.total_points > 0 && `${round(getPointsShare(element))}%`}</b>
                        </div>
                        <div className="muted">
                            {getPointsLabel(element.element.total_points - element.aggregates.totals.rawPoints)} in{' '}
                            {getGWCountLabel(history.current.length - element.aggregates.totals.selections)}
                        </div>
                    </div>
                </>
            )}
        />
    )
}

export default MissedPointsShareWidget
