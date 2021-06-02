import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'

const MAX_ITEMS = 10
const TITLE = 'Top Bench Players'

const BenchWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return <Widget title={TITLE} />
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.benched)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <b>{getGWCountLabel(element.aggregates.totals.benched)}</b>
                </>
            )}
        />
    )
}

export default BenchWidget
