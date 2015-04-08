
import React from 'react';

import 'font-awesome/css/font-awesome.css';
import ResourceText from '../src/components/resource/ResourceText';

React.render(
	<div>
		<ResourceText
			resourceText={{
				text: "Example Text",
				description: "Example description",
				editUrl: "http://google.com"
			}}
			isAdmin
		/>
    <ResourceText
      resourceText={{
        text: "Example Text",
        description: "Example description",
        editUrl: "http://google.com"
      }}
    />
	</div>
, document.getElementById('container'));
