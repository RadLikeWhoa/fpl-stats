import React from 'react'
import './Metric.scss'

const explanations = {
    ppg: 'Points per Game',
    ppp: 'Points per Player',
    ppw: 'Points per Week',
}

type Props = {
    metric: 'ppg' | 'ppp' | 'ppw'
}

const Metric: React.FC<Props> = (props: Props) => {
    return (
        <abbr className="metric" title={explanations[props.metric]}>
            {props.metric}
        </abbr>
    )
}

export default Metric
