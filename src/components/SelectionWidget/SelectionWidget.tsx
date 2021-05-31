import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getTotalSelections } from '../../utilities'
import { Player } from '../Player'

const TeamsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Selections" />
        )
    }

    const elements = getAllPlayers(stats)
        .sort((a, b) => getTotalSelections(b) - getTotalSelections(a))

    return (
        <Widget title="Top Selections">
            <ul className="widget__list">
                {elements.slice(0, 5).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        {getTotalSelections(element)}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default TeamsWidget