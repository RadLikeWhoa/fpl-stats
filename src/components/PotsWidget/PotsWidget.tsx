import React, { useContext } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getPointsLabel, head, sort, getAllPlayers, initialCaps, getShortName } from '../../utilities'
import { Widget } from '../Widget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { TotsPlayer } from '../TotsPlayer'
import './PotsWidget.scss'

const TITLE = 'Player of the Season'

const PotsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const allPlayers = getAllPlayers(data.stats.data)

    const topReturner = head(sort(allPlayers, el => el.aggregates.totals.points))

    if (!topReturner) {
        return <Widget title={TITLE} />
    }

    const pointsData = topReturner.data.map(gw => {
        return {
            name: `GW ${getShortName(gw.event)}`,
            value: gw.points,
        }
    })

    return (
        <Widget title={TITLE} cssClasses="pots-widget">
            <TotsPlayer id={topReturner.element.id} points={topReturner.aggregates.totals.points} />
            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={pointsData} margin={{ bottom: 45, left: 15, right: 15 }}>
                    <Area type="monotone" dataKey="value" stroke="#177B47" fill="#177B47" fillOpacity="1" />
                    <YAxis
                        tickFormatter={value => getPointsLabel(value)}
                        domain={['auto', 'auto']}
                        interval="preserveStartEnd"
                    />
                    <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                    <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                    <Tooltip
                        isAnimationActive={false}
                        formatter={(value, name) => [getPointsLabel(Number(value)), initialCaps(name)]}
                        separator=": "
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Widget>
    )
}

export default PotsWidget
