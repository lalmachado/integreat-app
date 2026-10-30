import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { TOUR_POPOVER_ELEMENT_ID } from '../../constants/tour'
import { renderWithRouterAndTheme } from '../../testing/render'
import HeaderMenu from '../HeaderMenu'
import MenuItem from '../MenuItem'

describe('HeaderMenu', () => {
  const renderHeaderMenu = ({ tourOpen }: { tourOpen: boolean }) =>
    renderWithRouterAndTheme(
      <>
        {tourOpen && <div id={TOUR_POPOVER_ELEMENT_ID} data-testid='tour-popover' tabIndex={-1} />}
        <HeaderMenu pageTitle='Test Page'>
          <MenuItem text='Item' onClick={jest.fn()} />
        </HeaderMenu>
      </>,
      { pathname: '/augsburg/de' },
    )

  it('should focus the menu and hide the rest of the page from screen readers', async () => {
    const { getByLabelText, getByRole, container } = renderHeaderMenu({ tourOpen: false })

    fireEvent.click(getByLabelText('common:labels.menu'))

    await waitFor(() => expect(getByRole('menu')).toContainElement(document.activeElement as HTMLElement))
    expect(container).toHaveAttribute('aria-hidden', 'true')
  })

  it('should keep the tour popover focused and accessible if the tour opens the menu', async () => {
    const { getByLabelText, getByRole, getByTestId, container } = renderHeaderMenu({ tourOpen: true })
    const tourPopover = getByTestId('tour-popover')
    tourPopover.focus()

    fireEvent.click(getByLabelText('common:labels.menu'))

    await waitFor(() => expect(getByRole('menu')).toBeTruthy())
    expect(tourPopover).toHaveFocus()
    expect(container).not.toHaveAttribute('aria-hidden')
  })
})
