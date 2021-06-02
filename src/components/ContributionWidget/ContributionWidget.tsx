import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, round, sort } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 10
const TITLE = 'Total Points Contribution'

const ContributionWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const entry = useSelector((state: RootState) => state.entry.data)

    if (!stats || !entry || entry.summary_overall_points === 0) {
        return <Widget title={TITLE} />
    }

    const contributions = sort(getAllPlayers(stats), el => el.aggregates.totals.points)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={contributions}
            max={MAX_ITEMS}
            renderItem={player => (
                <>
                    <Player id={player.element.id} />
                    <div>
                        <div>
                            <b>{round((player.aggregates.totals.points / entry.summary_overall_points) * 100)}%</b>
                        </div>
                        <div className="muted">{getPointsLabel(player.aggregates.totals.points)}</div>
                    </div>
                </>
            )}
        />
    )
}

export default ContributionWidget
