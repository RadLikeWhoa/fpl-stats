import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'

const MAX_ITEMS = 10

type Props = {
    title: string
    metric: 'selections' | 'starts' | 'benched'
}

const SelectionWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return <Widget title={props.title} />
    }

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
