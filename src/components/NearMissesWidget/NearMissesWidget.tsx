import React, { useContext } from 'react'
import { getAllPlayers, getPointsLabel, sort, thousandsSeparator } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 15
const TITLE = 'Other Players'

const NearMissesWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const totsIds = data.stats.tots.xi.concat(data.stats.tots.bench).map(player => player.element.id)
    const players = sort(
        getAllPlayers(data.stats.data).filter(player => !totsIds.includes(player.element.id)),
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
