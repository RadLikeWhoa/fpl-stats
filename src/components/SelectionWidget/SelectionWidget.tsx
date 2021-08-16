import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const MAX_ITEMS = 15

type Props = {
    title: string
    metric: 'selections' | 'starts' | 'benched'
}

const SelectionWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={props.title} />
    }

    const stats = data.stats.data

    const elements = sort(
        getAllPlayers(stats).filter(el => el.aggregates.totals[props.metric] > 0),
        el => el.aggregates.totals[props.metric]
    )

    return (
        <BasePlayerWidget
            title={props.title}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <b>{getGWCountLabel(element.aggregates.totals[props.metric])}</b>
                </>
            )}
        />
    )
}

export default SelectionWidget
