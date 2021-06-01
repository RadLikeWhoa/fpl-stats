import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, sort, thousandsSeparator } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 13

const NearMissesWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const tots = useSelector((state: RootState) => state.stats.tots)

    if (!stats || !tots) {
        return (
            <Widget title="Near Misses" />
        )
    }

    const totsIds = tots.xi.concat(tots.bench).map(player => player.element.id)
    const players = sort(getAllPlayers(stats).filter(player => !totsIds.includes(player.element.id)), el => el.aggregates.totals.points).slice(0, MAX_ITEMS)

    return (
        <Widget title="Near Misses">
            <ul className="widget__list">
                {players.map(player => (
                    <li className="widget__list__item">
                        <Player id={player.element.id} />
                        <b>{getPointsLabel(thousandsSeparator(player.aggregates.totals.points))}</b>
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default NearMissesWidget