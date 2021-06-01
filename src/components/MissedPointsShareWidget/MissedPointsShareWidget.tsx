import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, getTotalRawPoints, getTotalSelections, round, sort } from '../../utilities'
import { Player } from '../Player'
import { getGWCountLabel } from '../../utilities/strings';
import { StatData } from '../../types'

type Props = {
    title: string
    top?: boolean
}

const MAX_ITEMS = 10

const getPointsShare = (player: StatData): number => player.element.total_points > 0 ? 100 - getTotalRawPoints(player) / player.element.total_points * 100 : 0

const MissedPointsShareWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const history = useSelector((state: RootState) => state.history.data)

    if (!stats || !history) {
        return (
            <Widget title={props.title} />
        )
    }

    const elements = sort(
        getAllPlayers(stats),
        el => getPointsShare(el),
        props.top ? 'desc': 'asc'
    ).slice(0, MAX_ITEMS)

    return (
        <Widget title={props.title}>
            <ul className="widget__list">
                {elements.map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        <div>
                            <div>
                                {element.element.total_points > 0 && `${round(getPointsShare(element))}%`}
                            </div>
                            <div>
                                ({getPointsLabel(element.element.total_points - getTotalRawPoints(element))} in {getGWCountLabel(history.current.length - getTotalSelections(element))})
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default MissedPointsShareWidget