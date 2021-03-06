/* global describe beforeEach it */

import { expect } from 'chai'
import React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import LoginComplete from './LoginComplete'

const adapter = new Adapter()
enzyme.configure({ adapter })

describe('LoginComplete', () => {
  let loginComplete

  beforeEach(() => {
    const userName = 'ryanmac21'
    loginComplete = shallow(<LoginComplete userName={userName} />)
  })

  xit('renders the email in an h3', () => {
    expect(loginComplete.find('h3').text()).to.be.equal('ryanmac21')
  })
})
