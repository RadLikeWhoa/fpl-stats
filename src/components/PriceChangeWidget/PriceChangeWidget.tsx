import React from 'react'
import { useSelector } from 'react-redux'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { last, sort } from '../../utilities'
import { Player } from '../Player'
import { ChangeBadge } from '../ChangeBadge'

const GAINS_TITLE = 'Price Gains'
const DROPS_TITLE = 'Price Drops'

const MAX_ITEMS = 5

type Props = {
    type: 'gains' | 'drops'
}

const PriceChangeWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={props.type === 'gains' ? GAINS_TITLE : DROPS_TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(
            el =>
                picks?.includes(el.id) &&
                ((props.type === 'gains' && el.cost_change_event > 0) ||
                    (props.type === 'drops' && el.cost_change_event_fall > 0))
        ),
        el => Number(props.type === 'gains' ? el.cost_change_event : el.cost_change_event_fall)
    )

    return (
        <BasePlayerWidget
            title={props.type === 'gains' ? GAINS_TITLE : DROPS_TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <div>
                        <ChangeBadge
                            value={
                                props.type === 'gains' ? element.cost_change_event : element.cost_change_event_fall * -1
                            }
                            renderer={input => `£ ${Math.abs(input) / 10}`}
                        />
                    </div>
                </>
            )}
        />
    )
}

export default PriceChangeWidget
