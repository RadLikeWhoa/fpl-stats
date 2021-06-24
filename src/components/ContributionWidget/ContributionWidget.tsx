import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, head, last, round, sort } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredData } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 10
const TITLE = 'Total Points Contribution'

type Props = {
    data: FilteredData | undefined
}

const ContributionWidget: React.FC<Props> = (props: Props) => {
    const entry = useSelector((state: RootState) => state.entry.data)
    const rawHistory = useSelector((state: RootState) => state.history.data)

    if (!entry || !props.data || !rawHistory) {
        return <Widget title={TITLE} />
    }

    const history = props.data.history
    const stats = props.data.stats.data

    const totalPoints =
        (last(history.current)?.total_points || 0) -
        (rawHistory?.current?.find(event => event.event === (head(history.current)?.event || 1))?.total_points || 0)

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
