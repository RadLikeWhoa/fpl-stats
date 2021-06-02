import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, sort, thousandsSeparator } from '../../utilities'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { Player } from '../Player'
import { Widget } from '../Widget'

const MAX_ITEMS = 15
const TITLE = 'Other Players'

const NearMissesWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const tots = useSelector((state: RootState) => state.stats.tots)

    if (!stats || !tots) {
        return <Widget title={TITLE} />
    }

    const totsIds = tots.xi.concat(tots.bench).map(player => player.element.id)
    const players = sort(
        getAllPlayers(stats).filter(player => !totsIds.includes(player.element.id)),
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
