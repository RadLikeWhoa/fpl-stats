import { useSelector } from 'react-redux'
import { RootState } from '../reducers'

const useMeanLabel: () => (suffix: string) => string = () => {
    const strategy = useSelector((state: RootState) => state.settings.meanStrategy)

    return (suffix: string) => `${strategy === 'average' ? 'Average' : 'Median'} ${suffix}`
}

export default useMeanLabel