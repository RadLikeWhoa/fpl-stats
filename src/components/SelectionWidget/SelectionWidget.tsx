import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getTotalSelections } from '../../utilities'
import { Player } from '../Player'

const TeamsWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    if (!stats) {
        return (
            <Widget
                title="Top Selections"
                loading={isLoadingStats}
                cloaked={!id}
            />
        )
    }

    const elements = getAllPlayers(stats)
        .sort((a, b) => getTotalSelections(b) - getTotalSelections(a))

    return (
        <Widget
            title="Top Selections"
            loading={isLoadingStats}
            cloaked={!id}
        >
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