import React from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getShortName, initialCaps } from '../../utilities'
import { FilteredData } from '../Dashboard/Dashboard'

const TITLE = 'Team Value Evolution'

type Props = {
    data: FilteredData | undefined
}

const ValueWidget: React.FC<Props> = (props: Props) => {
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!props.data || !bootstrap || !props.data.history.current.length) {
        return <Widget title={TITLE} />
    }

    const history = props.data.history

    const data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.value + entry.bank,
        }
    })

    return (
        <Widget title={TITLE}>
            <div className="chart">
                <ResponsiveContainer height={300} width="100%">
                    <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                        <Area type="monotone" dataKey="value" stroke="#177B47" fill="#177B47" fillOpacity="1" />
                        <YAxis
                            tickFormatter={value => `£${value / 10}`}
                            domain={['auto', 'auto']}
                            interval="preserveStartEnd"
                        />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                        <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                        <Tooltip
                            isAnimationActive={false}
                            formatter={(value, name) => [`£${Number(value) / 10}`, initialCaps(name)]}
                            separator=": "
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Widget>
    )
}

export default ValueWidget
