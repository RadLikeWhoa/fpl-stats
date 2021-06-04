import React from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getShortName, initialCaps } from '../../utilities'
import { FilteredData } from '../Dashboard/Dashboard'

const TITLE = 'Gameweek Points'

type Props = {
    data: FilteredData | undefined
}

const OverallRankWidget: React.FC<Props> = (props: Props) => {
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!props.data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const history = props.data.history

    const data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            points: entry.points,
            bench: entry.points_on_bench,
        }
    })

    return (
        <Widget title={TITLE}>
            <div className="chart">
                <ResponsiveContainer height={300} width="100%">
                    <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                        <Area type="monotone" dataKey="points" stroke="#177B47" fill="#177B47" fillOpacity="1" />
                        <Area type="monotone" dataKey="bench" stroke="#00FF87" fill="#00FF87" fillOpacity="1" />
                        <YAxis interval="preserveStartEnd" />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                        <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                        <Tooltip
                            isAnimationActive={false}
                            formatter={(value, name) => [value, initialCaps(name)]}
                            separator=": "
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Widget>
    )
}

export default OverallRankWidget
