import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'

const MAX_ITEMS = 10

const TeamsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Selections">
                <div className="widget__empty">No data available.</div>
            </Widget>
        )
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.selections).slice(0, MAX_ITEMS)

    return (
        <Widget title="Top Selections">
            {elements.length > 0 ? (
                <ul className="widget__list">
                    {elements.map(element => (
                        <li className="widget__list__item" key={element.element.id}>
                            <Player id={element.element.id} />
                            <b>{getGWCountLabel(element.aggregates.totals.selections)}</b>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="widget__empty">No data available.</div>
            )}
        </Widget>
    )
}

export default TeamsWidget