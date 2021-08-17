import React from 'react'
import { useSelector } from 'react-redux'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getPointsLabel, last, sort } from '../../utilities'
import { Player } from '../Player'

const TITLE = 'Form Breakdown'
const MAX_ITEMS = 15

const FormWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(el => picks?.includes(el.id)),
        el => Number(el.form)
    )

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <div>
                        <b>{getPointsLabel(element.form)}</b>
                    </div>
                </>
            )}
        />
    )
}

export default FormWidget
