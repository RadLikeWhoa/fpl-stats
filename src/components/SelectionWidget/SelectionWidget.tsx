import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, sort } from '../../utilities'
import { Player } from '../Player'

const MAX_ITEMS = 10

const TeamsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Selections" />
        )
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.selections)

    return (
        <Widget title="Top Selections">
            <ul className="widget__list">
                {elements.slice(0, MAX_ITEMS).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        {element.aggregates.totals.selections}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default TeamsWidget