import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getShortName, initialCaps } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Team Value Evolution'

const ValueWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!data || !bootstrap || !data.history.current.length) {
        return <Widget title={TITLE} />
    }

    const history = data.history

    const valueData = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.value + entry.bank,
        }
    })

    return (
        <Widget title={TITLE}>
            <div className="chart">
                <ResponsiveContainer height={200} width="100%">
                    <AreaChart data={valueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Area type="monotone" dataKey="value" stroke="#177B47" fill="#177B47" fillOpacity="0.75" />
                        <YAxis
                            tickFormatter={value => `£${value / 10}`}
                            domain={['auto', 'auto']}
                            interval="preserveStartEnd"
                            hide={true}
                        />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" hide={true} />
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
