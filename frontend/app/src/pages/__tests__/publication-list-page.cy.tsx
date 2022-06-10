import {App} from '@app/app'
import {mountProviders} from '@app/test/utils'

describe('PublicationList', () => {
  it('Should show an empty list', () => {
    const {render} = mountProviders({
      initialRoute: '/publications',
    })

    render(<App />)
  })
})
