import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { render } from './utils';

import ResourceText from '../src/components/resource/ResourceText';
import HelpTooltip from '../src/components/resource/HelpTooltip';
import AdminMenu from '../src/components/resource/AdminMenu';

describe('ResourceText', () => {
  it('should create a ResourceText Component', () => {
    const resourceText = {};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);
    const rtNode = ReactDOM.findDOMNode(rtInstance);

    expect(TestUtils.isCompositeComponentWithType(rtInstance, ResourceText)).toBe(true);
    expect(rtNode.nodeName).toBe('DIV');
    expect(rtNode.className).toBe('ResourceText');
  });


  it('should create a span.ResourceText-text node if a resourceText.text is given', () => {
    const resourceText = {text: 'Example Text'};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const textInstance = TestUtils.findRenderedDOMComponentWithClass(rtInstance, 'ResourceText-text');
    const textNode = ReactDOM.findDOMNode(textInstance);

    expect(textNode.nodeName).toBe('SPAN');
    expect(textNode.innerHTML).toBe(resourceText.text);
  });

  it('shouldnt create a span.ResourceText-text node if no resourceText.text is given', () => {
    const resourceText = {};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const textInstance = TestUtils.scryRenderedDOMComponentsWithClass(rtInstance, 'ResourceText-text');
    expect(textInstance.length).toBe(0);
  });


  it('should create a HelpTooltip component if a resourceText.description is given', () => {
    const resourceText = {description: 'Example Description'};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const helpTooltipInstance = TestUtils.findRenderedComponentWithType(rtInstance, HelpTooltip);

    expect(helpTooltipInstance.props.className).toBe('ResourceText-helpTooltip');
    /* expect(helpTooltipInstance.props.children).toBe(
      <span dangerouslySetInnerHTML={{__html: resourceText.description}} />
    );*/
  });

  it('shouldnt create a HelpTooltip component if no resourceText.description is given', () => {
    const resourceText = {};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const helpTooltipInstance = TestUtils.scryRenderedComponentsWithType(rtInstance, HelpTooltip);
    expect(helpTooltipInstance.length).toBe(0);
  });


  it('should create a AdminMenu component if a resourceText.editUrl is given', () => {
    const resourceText = {description: 'Example Description', editUrl: 'url'};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const adminMenuInstance = TestUtils.findRenderedComponentWithType(rtInstance, AdminMenu);

    expect(adminMenuInstance.props.className).toBe('ResourceText-adminMenu');
    expect(adminMenuInstance.props.resourceText).toBe(resourceText);
  });

  it('shouldnt create a AdminMenu component if no resourceText.editUrl is given', () => {
    const resourceText = {};
    const rtInstance = render(<ResourceText resourceText={resourceText} />);

    const adminMenuInstance = TestUtils.scryRenderedComponentsWithType(rtInstance, AdminMenu);
    expect(adminMenuInstance.length).toBe(0);
  });
});
