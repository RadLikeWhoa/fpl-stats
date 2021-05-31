import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { thousandsSeparator, sumNumbers } from '../../utilities'
import { Metric } from '../Metric'

type FormationInformation = {
    count: number
    points: number
}

const formatFormation = (formation: string) => sumNumbers(formation.split('-').map(position => Number(position))) > 10 ? 'Bench Boost' : formation

const FormationWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const history = useSelector((state: RootState) => state.history.data)
    const isLoadingHistory = useSelector((state: RootState) => state.history.loading)

    if (!stats || !history) {
        return (
            <Widget
                title="Formations"
                loading={isLoadingStats || isLoadingHistory}
                cloaked={!id}
            />
        )
    }

    const weeks = history.current.length

    const formations = Object
        .values(stats)
        .map(position => {
            const selections = position.map(player => player.data.map(data => data.multiplier))

            return Array.from(Array(weeks).keys()).map((el, index) => selections
                .map(player => (player[index] || 0) > 0)
                .filter(val => !!val)
                .length
            )
        })
        .slice(1)

    const data = Array
        .from(Array(weeks).keys())
        .map((el, index) => formations
            .map(entries => entries[index])
            .join('-')
        )
        .reduce((acc, formation, index) => {
            if (acc[formation]) {
                return {
                    ...acc,
                    [formation]: {
                        count: acc[formation].count + 1,
                        points: acc[formation].points + history.current[index].points,
                    }
                }
            }

            return {
                ...acc,
                [formation]: {
                    count: 1,
                    points: history.current[index].points,
                }
            }
        }, {} as Record<string, FormationInformation>)

    return (
        <Widget
            title="Formations"
            loading={isLoadingStats || isLoadingHistory}
            cloaked={!id}
        >
            <ul className="widget__list">
                {Object.entries(data).sort((a, b) => b[1].count - a[1].count).map(([ formation, information ]) => {
                    return (
                        <li className="widget__list__item" key={formation}>
                            <span>{formatFormation(formation)}</span>
                            <span>{information.count} ({thousandsSeparator(information.points)} pts, {(information.points / information.count).toFixed(1)} <Metric metric="ppg" />)</span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default FormationWidget