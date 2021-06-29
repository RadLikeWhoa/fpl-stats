import React, { useContext } from 'react'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { TotsPlayer } from '../TotsPlayer'
import { Widget } from '../Widget'
import './TotsWidget.scss'

const TITLE = 'Team of the Season'

const TotsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data || !data.stats.tots.xi.length) {
        return <Widget title={TITLE} />
    }

    return (
        <Widget title={TITLE} cssClasses="tots-widget">
            <div className="tots">
                {Array(4).map((el, index) => (
                    <>
                        {data && (
                            <div className="tots__row">
                                {data.stats.tots.xi
                                    .filter(el => el.element.element_type === index + 1)
                                    .map(player => (
                                        <TotsPlayer
                                            key={player.element.id}
                                            id={player.element.id}
                                            points={player.aggregates.totals.points}
                                        />
                                    ))}
                            </div>
                        )}
                    </>
                ))}
                <div className="tots__row tots__row--bench">
                    {data.stats.tots.bench.map(player => (
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
