import React from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getShortName, head, sort, thousandsSeparator, thousandsShorthand } from '../../utilities'
import { FilteredData } from '../Dashboard/Dashboard'

const TITLE = 'Overall Rank Evolution'

type Props = {
    data: FilteredData | undefined
}

const OverallRankWidget: React.FC<Props> = (props: Props) => {
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const theme = useSelector((state: RootState) => state.settings.theme)

    if (!props.data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const history = props.data.history

    let data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.overall_rank,
        }
    })

    const max = (head(sort([...data], el => el.value))?.value || 0) * 1.05

    data = [...data].map(element => ({
        ...element,
        max,
    }))

    return (
        <Widget title={TITLE}>
            <div className="chart chart--reversed">
                <ResponsiveContainer height={300} width="100%">
                    <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                        <Area type="monotone" dataKey="max" fill="#177B47" fillOpacity="1" />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#177B47"
                            fill={theme === 'dark' ? '#3a4556' : '#fff'}
                            fillOpacity="1"
                        />
                        <YAxis
                            reversed={true}
                            tickFormatter={value => thousandsShorthand(value)}
                            domain={[1, max]}
                            interval="preserveStartEnd"
                            tickCount={10}
                        />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                        <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                        <Tooltip
                            isAnimationActive={false}
                            formatter={(value, name) =>
                                name === 'max' ? [undefined, undefined] : [thousandsSeparator(Number(value)), 'Rank']
                            }
                            separator=": "
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Widget>
    )
}

export default OverallRankWidget
