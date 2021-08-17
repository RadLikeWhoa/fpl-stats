import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, head, last, round, sort } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 5
const TITLE = 'Total Points Contribution'

const ContributionWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const entry = useSelector((state: RootState) => state.entry.data)
    const rawHistory = useSelector((state: RootState) => state.history.data)

    if (!entry || !data || !rawHistory) {
        return <Widget title={TITLE} />
    }

    const history = data.history
    const stats = data.stats.data

    const latestPoints = last(history.current)?.total_points || 0
    const totalPoints =
        history.current.length > 1
            ? latestPoints -
              (rawHistory?.current?.find(event => event.event === (head(history.current)?.event || 1))?.total_points ||
                  0)
            : latestPoints

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
                            <b>{round((player.aggregates.totals.points / totalPoints) * 100)}%</b>
                        </div>
                        <div className="muted">{getPointsLabel(player.aggregates.totals.points)}</div>
                    </div>
                </>
            )}
        />
    )
}

export default ContributionWidget
