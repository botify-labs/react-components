import React, { addons } from 'react/addons';
const { TestUtils } = addons;
import { render } from './utils';

import ResourceText from '../src/components/resource/ResourceText';
import HelpTooltip from '../src/components/resource/HelpTooltip';
import AdminMenu from '../src/components/resource/AdminMenu';

describe('ResourceText', () => {

  it('should create a ResourceText Component', () => {
    let resourceText = {};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);
    let rtNode = React.findDOMNode(rtInstance);

    expect(TestUtils.isCompositeComponentWithType(rtInstance, ResourceText)).toBe(true);
    expect(rtNode.nodeName).toBe('DIV');
    expect(rtNode.className).toBe('ResourceText');
  });


  it('should create a span.ResourceText-text node if a resourceText.text is given', () => {
    let resourceText = {text: "Example Text"};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);

    let textInstance = TestUtils.findRenderedDOMComponentWithClass(rtInstance, 'ResourceText-text');
    let textNode = React.findDOMNode(textInstance);

    expect(textNode.nodeName).toBe('SPAN');
    expect(textNode.innerHTML).toBe(resourceText.text);
  });

  it('shouldnt create a span.ResourceText-text node if no resourceText.text is given', () => {
    let resourceText = {};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);

    let textInstance = TestUtils.scryRenderedDOMComponentsWithClass(rtInstance, 'ResourceText-text');
    expect(textInstance.length).toBe(0);
  });


  it('should create a HelpTooltip component if a resourceText.description is given', () => {
    let resourceText = {description: "Example Description"};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);

    let helpTooltipInstance = TestUtils.findRenderedComponentWithType(rtInstance, HelpTooltip);

    expect(helpTooltipInstance.props.className).toBe('ResourceText-helpTooltip');
    /*expect(helpTooltipInstance.props.children).toBe(
      <span dangerouslySetInnerHTML={{__html: resourceText.description}} />
    );*/
  });

  it('shouldnt create a HelpTooltip component if no resourceText.description is given', () => {
    let resourceText = {};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);

    let helpTooltipInstance = TestUtils.scryRenderedComponentsWithType(rtInstance, HelpTooltip);
    expect(helpTooltipInstance.length).toBe(0);
  });


  it('should create a AdminMenu component if a resourceText.description is given', () => {
    let resourceText = {description: "Example Description"};
    let rtInstance = render(<ResourceText resourceText={resourceText} isAdmin={true} />);

    let adminMenuInstance = TestUtils.findRenderedComponentWithType(rtInstance, AdminMenu);

    expect(adminMenuInstance.props.className).toBe('ResourceText-adminMenu');
    expect(adminMenuInstance.props.resourceText).toBe(resourceText);
  });

  it('shouldnt create a AdminMenu component if no isAdmin === false', () => {
    let resourceText = {};
    let rtInstance = render(<ResourceText resourceText={resourceText} />);

    let adminMenuInstance = TestUtils.scryRenderedComponentsWithType(rtInstance, AdminMenu);
    expect(adminMenuInstance.length).toBe(0);
  });

});
