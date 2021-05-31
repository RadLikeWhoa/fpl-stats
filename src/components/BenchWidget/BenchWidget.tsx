import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getTotalBenched } from '../../utilities'
import { Player } from '../Player'

const BenchWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Top Bench Players" />
        )
    }

    const elements = getAllPlayers(stats)
        .sort((a, b) => getTotalBenched(b) - getTotalBenched(a))

    return (
        <Widget title="Top Bench Players">
            <ul className="widget__list">
                {elements.slice(0, 5).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        {getTotalBenched(element)}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default BenchWidget