import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'

type Props = {
    label?: string
    event?: number
    target?: 'transfers'
}

const SiteLink: React.FC<Props> = (props: Props) => {
    const id = useSelector((state: RootState) => state.settings.id)

    const baseUrl = `https://fantasy.premierleague.com/entry/${id}/`
    let url = baseUrl

    if (props.event) {
        url = `${url}event/${props.event}/`
    } else if (props.target) {
        url = `${url}${props.target}/`
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {props.event ? `GW ${props.event}` : props.label ? props.label : url}
        </a>
    )
}

export default SiteLink
