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
    const user = {
      displayName: "Ryan McNierney"
    }
    loginComplete = shallow(<LoginComplete user={user} />)
  })

  it('renders the name in an h3', () => {
    expect(loginComplete.find('h3').text()).to.be.equal('Welcome, Ryan McNierney')
  })
})
