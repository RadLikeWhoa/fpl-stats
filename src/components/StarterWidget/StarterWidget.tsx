import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getTotalStarts, sort } from '../../utilities'
import { Player } from '../Player'

const MAX_ITEMS = 10

const StarterWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Starters" />
        )
    }

    const elements = sort(getAllPlayers(stats), el => getTotalStarts(el))

    return (
        <Widget title="Top Starters">
            <ul className="widget__list">
                {elements.slice(0, MAX_ITEMS).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        {getTotalStarts(element)}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default StarterWidget