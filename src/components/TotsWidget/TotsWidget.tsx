import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { TotsPlayer } from '../TotsPlayer'
import { Widget } from '../Widget'
import './TotsWidget.scss'

const TotsWidget: React.FC = () => {
    const tots = useSelector((state: RootState) => state.stats.tots)

    if (!tots) {
        return (
            <Widget title="Team of the Season">
                <div className="widget__empty">No data available.</div>
            </Widget>
        )
    }

    return (
        <Widget title="Team of the Season" cssClasses="tots-widget">
            <div className="tots">
                <div className="tots__row">
                    {tots.xi.filter(el => el.element.element_type === 1).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {tots.xi.filter(el => el.element.element_type === 2).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {tots.xi.filter(el => el.element.element_type === 3).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {tots.xi.filter(el => el.element.element_type === 4).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row tots__row--bench">
                    {tots.bench.map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
            </div>
        </Widget>
    )
}

export default TotsWidget