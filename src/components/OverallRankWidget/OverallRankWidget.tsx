import React from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getShortName, thousandsSeparator, thousandsShorthand } from '../../utilities'

const OverallRankWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const history = useSelector((state: RootState) => state.history.data)
    const isLoadingHistory = useSelector((state: RootState) => state.history.loading)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const isLoadingBootstrap = useSelector((state: RootState) => state.bootstrap.loading)

    if (!history || !bootstrap) {
        return (
            <Widget
                title="Overall Rank Evolution"
                loading={isLoadingHistory || isLoadingBootstrap}
                cloaked={!id}
            />
        )
    }

    let data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.overall_rank,
        }
    })

    const max = [ ...data ].sort((a, b) => b.value - a.value)[0].value * 1.05

    data = [ ...data ].map(element => ({
        ...element,
        max,
    }))

    return (
        <Widget
            title="Overall Rank Evolution"
            loading={isLoadingHistory || isLoadingBootstrap}
            cloaked={!id}
        >
            <div className="chart chart--reversed">
                <ResponsiveContainer height={300} width="100%">
                    <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                        <Area type="monotone" dataKey="max" fill="#177B47" fillOpacity="1" />
                        <Area type="monotone" dataKey="value" stroke="#177B47" fill="#ffffff" fillOpacity="1" />
                        <YAxis reversed={true} tickFormatter={value => thousandsShorthand(value)} domain={[1, max]} interval="preserveStartEnd" tickCount={10} />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                        <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                        <Tooltip isAnimationActive={false} formatter={(value, name) => name === 'max' ? [undefined, undefined] : [ thousandsSeparator(Number(value)), 'Rank' ]} separator=": " />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Widget>
    )
}

export default OverallRankWidget