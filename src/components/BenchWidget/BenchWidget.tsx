import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, sort } from '../../utilities'
import { Player } from '../Player'

const MAX_ITEMS = 10

const BenchWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Bench Players" />
        )
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.benched)

    return (
        <Widget title="Top Bench Players">
            <ul className="widget__list">
                {elements.slice(0, MAX_ITEMS).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        <div className="muted">
                            <b>{element.aggregates.totals.benched}</b>
                        </div>
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default BenchWidget