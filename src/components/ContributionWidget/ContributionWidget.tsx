import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, getTotalPoints, round, sort } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 10

const ContributionWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const entry = useSelector((state: RootState) => state.entry.data)

    if (!stats || !entry) {
        return (
            <Widget title="Total Points Contribution" />
        )
    }

    const contributions = sort(getAllPlayers(stats), getTotalPoints).slice(0, MAX_ITEMS)

    return (
        <Widget title="Total Points Contribution">
            <ul className="widget__list">
                {contributions.map(player => (
                    <li className="widget__list__item" key={player.element.id}>
                        <Player id={player.element.id} />
                        {entry.summary_overall_points > 0 && (
                            <span>{round(getTotalPoints(player) / entry.summary_overall_points * 100)}% ({getPointsLabel(getTotalPoints(player))})</span>
                        )}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default ContributionWidget