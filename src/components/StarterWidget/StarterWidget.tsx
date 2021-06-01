import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'

const MAX_ITEMS = 10

const StarterWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Starters">
                <div className="widget__empty">No data available.</div>
            </Widget>
        )
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.starts).slice(0, MAX_ITEMS)

    return (
        <Widget title="Top Starters">
            {elements.length ? (
                <ul className="widget__list">
                    {elements.map(element => (
                        <li className="widget__list__item" key={element.element.id}>
                            <Player id={element.element.id} />
                            <b>{getGWCountLabel(element.aggregates.totals.starts)}</b>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="widget__empty">No data available.</div>
            )}
        </Widget>
    )
}

export default StarterWidget