import React from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredData } from '../Dashboard/Dashboard'

const MAX_ITEMS = 10

type Props = {
    title: string
    metric: 'selections' | 'starts' | 'benched'
    data: FilteredData | undefined
}

const SelectionWidget: React.FC<Props> = (props: Props) => {
    if (!props.data) {
        return <Widget title={props.title} />
    }

    const stats = props.data.stats.data

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals[props.metric])

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
