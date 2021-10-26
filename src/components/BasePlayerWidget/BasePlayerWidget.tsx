import React from 'react'
import { Element, StatData } from '../../types'
import { normaliseDiacritics } from '../../utilities'
import { WidgetWithModal } from '../WidgetWithModal'

type PlayerLike = StatData | Element

type Props<T extends PlayerLike> = {
    title: string
    max: number
    players: T[]
    renderItem: (player: T) => JSX.Element | null
    cssClasses?: string
}

const isStatData = (element: PlayerLike): element is StatData => (element as StatData).element !== undefined

const isElement = (element: PlayerLike): element is Element => (element as Element).id !== undefined

const getItemKey = <T extends PlayerLike>(player: T): string | undefined => {
    if (isStatData(player)) {
        if (player.data.length > 1) {
            return `${player.element.id}`
        } else {
            return `${player.element.id}-${player.data[0].event.id}`
        }
    } else if (isElement(player)) {
        return `${player.id}`
    }

    return undefined
}

const matchesFilter = <T extends PlayerLike>(item: T, query: string): boolean => {
    return normaliseDiacritics(isStatData(item) ? item.element.web_name : isElement(item) ? item.web_name : '')
        .toLowerCase()
        .includes(normaliseDiacritics(query).toLowerCase())
}

const BasePlayerWidget = <T extends PlayerLike>(props: Props<T>): React.ReactElement<Props<T>> | null => {
    return (
        <WidgetWithModal
            title={props.title}
            max={props.max}
            data={props.players}
            renderItem={props.renderItem}
            getItemKey={getItemKey}
            matchesFilter={matchesFilter}
        />
    )
}

export default BasePlayerWidget
