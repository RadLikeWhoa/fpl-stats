import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, round, sort } from '../../utilities'
import { Player } from '../Player'
import { getGWCountLabel } from '../../utilities/strings'
import { StatData } from '../../types'
import { BasePlayerWidget } from '../BasePlayerWidget'

type Props = {
    title: string
    top?: boolean
}

const MAX_ITEMS = 10

const getPointsShare = (player: StatData): number =>
    100 - (player.aggregates.totals.rawPoints / player.element.total_points) * 100

const MissedPointsShareWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const history = useSelector((state: RootState) => state.history.data)

    if (!stats || !history) {
        return <Widget title={props.title} />
    }

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
