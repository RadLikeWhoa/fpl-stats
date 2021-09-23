import React from 'react'
import { useSelector } from 'react-redux'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getPointsLabel, last, sort } from '../../utilities'
import { Player } from '../Player'
import { ChangeBadge } from '../ChangeBadge'
import './ExpectedPointsWidget.scss'

const CURRENT_TITLE = 'Expected Points – This GW'
const NEXT_TITLE = 'Expected Points – Next GW'

const MAX_ITEMS = 15

type Props = {
    gw: 'current' | 'next'
}

const ExpectedPointsWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={props.gw === 'current' ? CURRENT_TITLE : NEXT_TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(el => picks?.includes(el.id)),
        el =>
            Number(
                props.gw === 'next'
                    ? el.ep_next
                    : el.event_points !== null
                    ? el.event_points - Number(el.ep_this)
                    : el.ep_this
            )
    )

    return (
        <BasePlayerWidget
            title={props.gw === 'current' ? CURRENT_TITLE : NEXT_TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <div className="expected-points-widget__data">
                        <b>
                            {getPointsLabel(
                                props.gw === 'current'
                                    ? element.event_points !== null
                                        ? element.event_points
                                        : element.ep_this
                                    : element.ep_next
                            )}
                        </b>
                        {props.gw === 'current' && element.event_points !== null && (
                            <>
                                <ChangeBadge value={element.event_points - Number(element.ep_this)} />
                            </>
                        )}
                    </div>
                </>
            )}
        />
    )
}

export default ExpectedPointsWidget
