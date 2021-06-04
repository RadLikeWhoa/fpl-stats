import React from 'react'
import { getAllPlayers, getPointsLabel, sort, thousandsSeparator } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredData } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 15
const TITLE = 'Other Players'

type Props = {
    data: FilteredData | undefined
}

const NearMissesWidget: React.FC<Props> = (props: Props) => {
    if (!props.data) {
        return <Widget title={TITLE} />
    }

    const totsIds = props.data.stats.tots.xi.concat(props.data.stats.tots.bench).map(player => player.element.id)
    const players = sort(
        getAllPlayers(props.data.stats.data).filter(player => !totsIds.includes(player.element.id)),
        el => el.aggregates.totals.points
    )

    return (
        <BasePlayerWidget
            title={TITLE}
            players={players}
            max={MAX_ITEMS}
            renderItem={player => (
                <>
                    <Player id={player.element.id} />
                    <b>{getPointsLabel(thousandsSeparator(player.aggregates.totals.points))}</b>
                </>
            )}
        />
    )
}

export default NearMissesWidget
