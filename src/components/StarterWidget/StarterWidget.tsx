import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'

const MAX_ITEMS = 10
const TITLE = 'Top Starters'

const StarterWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return <Widget title={TITLE} />
    }

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.starts)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <b>{getGWCountLabel(element.aggregates.totals.starts)}</b>
                </>
            )}
        />
    )
}

export default StarterWidget
