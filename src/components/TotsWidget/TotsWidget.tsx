import React from 'react'
import { FilteredData } from '../Dashboard/Dashboard'
import { TotsPlayer } from '../TotsPlayer'
import { Widget } from '../Widget'
import './TotsWidget.scss'

const TITLE = 'Team of the Season'

type Props = {
    data: FilteredData | undefined
}

const TotsWidget: React.FC<Props> = (props: Props) => {
    if (!props.data || !props.data.stats.tots.xi.length) {
        return <Widget title={TITLE} />
    }

    return (
        <Widget title={TITLE} cssClasses="tots-widget">
            <div className="tots">
                {Array(4).map((el, index) => (
                    <>
                        {props.data && (
                            <div className="tots__row">
                                {props.data.stats.tots.xi
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
                    {props.data.stats.tots.bench.map(player => (
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
