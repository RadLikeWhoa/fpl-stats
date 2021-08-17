import React from 'react'
import { useSelector } from 'react-redux'
import { BaseLiveWidget } from '../BaseLiveWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { last, sort } from '../../utilities'
import { Player } from '../Player'
import { thousandsSeparator } from '../../utilities/numbers'

const IN_TITLE = 'Transfers IN'
const OUT_TITLE = 'Transfers OUT'

const MAX_ITEMS = 5

type Props = {
    type: 'in' | 'out'
}

const TransfersWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={props.type === 'in' ? IN_TITLE : OUT_TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(el => picks?.includes(el.id)),
        el => Number(props.type === 'in' ? el.transfers_in_event : el.transfers_out)
    )

    return (
        <BaseLiveWidget
            title={props.type === 'in' ? IN_TITLE : OUT_TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <b>
                        {thousandsSeparator(props.type === 'in' ? element.transfers_in_event : element.transfers_out)}
                    </b>
                </>
            )}
        />
    )
}

export default TransfersWidget
