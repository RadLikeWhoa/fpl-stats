import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Double Digit Hauls'
const MAX_ITEMS = 15

const DoubleDigitHaulsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data

    const elements = sort(
        getAllPlayers(stats).filter(el => el.aggregates.totals.doubleDigitHauls > 0),
        el => el.aggregates.totals.doubleDigitHauls
    )

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <b>{getGWCountLabel(element.aggregates.totals.doubleDigitHauls)}</b>
                </>
            )}
        />
    )
}

export default DoubleDigitHaulsWidget
