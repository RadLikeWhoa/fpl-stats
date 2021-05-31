import React from 'react'
import { useSelector } from 'react-redux'
import { useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { getTotalPoints, thousandsSeparator, sumNumbers } from '../../utilities'
import { Widget } from '../Widget'
import { Metric } from '../Metric';

const PositionsWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const isLoadingBootstrap = useSelector((state: RootState) => state.bootstrap.loading)

    const meanValue = useMeanValue()

    if (!stats || !bootstrap) {
        return (
            <Widget
                title="Positions"
                loading={isLoadingStats || isLoadingBootstrap}
                cloaked={!id}
            />
        )
    }

    const positions: Record<string, number> = Object.entries(stats)
        .reduce((acc, [ elementType, elements ]) => ({
            ...acc,
            [elementType]: elements.length,
        }), {})

    return (
        <Widget
            title="Positions"
            loading={isLoadingStats || isLoadingBootstrap}
            cloaked={!id}
        >
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Total</span>
                    <span>{Object.values(positions).reduce((acc, curr) => acc + curr, 0)}</span>
                </li>
                {Object.entries(positions).map(([ elementType, elements ]) => {
                    const totalPoints = stats[Number(elementType)].map(player => getTotalPoints(player))

                    return (
                        <li className="widget__list__item">
                            <span>{bootstrap.element_types.find(el => el.id === Number(elementType))?.plural_name}</span>
                            <span>
                                {elements}
                                {' '}
                                ({thousandsSeparator(sumNumbers(totalPoints))} pts, {meanValue(totalPoints).toFixed(1)} <Metric metric="ppp" />)
                            </span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default PositionsWidget