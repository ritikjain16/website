import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import NavItem from './NavItem'
import Item from './NavItem.style'
import colors from '../../../../constants/colors'

const defaultProps = {
  iconType: 'dashboard',
  title: 'randomTitle',
  isActive: false,
  route: '/'
}

let component
describe('NavItem', () => {
  afterEach(() => {
    component.unmount()
  })

  it('renders an item', () => {
    component = mount(
      <MemoryRouter>
        <NavItem {...defaultProps} />
      </MemoryRouter>
    )
    expect(component.length).toEqual(1)
  })
  it('shows ant icon', () => {
    component = mount(
      <MemoryRouter>
        <NavItem {...defaultProps} />
      </MemoryRouter>
    )
    expect(component.find('i.anticon').length).toEqual(1)
  })
  it('changes style on isActive', () => {
    component = mount(
      <MemoryRouter>
        <NavItem {...defaultProps} isActive />
      </MemoryRouter>
    )
    const ItemTree = renderer.create(
      <MemoryRouter>
        {component.find(Item).get(0)}
      </MemoryRouter>
    ).toJSON()
    const ItemIconTree = renderer.create(
      <MemoryRouter>
        {component.find(Item.Icon).get(0)}
      </MemoryRouter>
    ).toJSON()
    expect(ItemTree).toHaveStyleRule('background', colors.sideNavItemActiveBG)
    expect(ItemIconTree).toHaveStyleRule('color', 'white')
  })
})
