import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel } from '../../services/models';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import { Tab, TabList, TabPanel, Tabs, H5 } from '../../common-elements';

export interface RequestSamplesProps {
  operation: OperationModel;
}

const RequestHeader = H5.extend`
  color: #fff;
  padding: 10px 0;
`;

@observer
export class RequestSamples extends React.Component<RequestSamplesProps> {
  operation: OperationModel;

  visited = new Set();

  render() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content;
    const hasBodySample = requestBodyContent && requestBodyContent.hasSample;
    const samples = operation.codeSamples;

    const hasSamples = hasBodySample || samples.length > 0;
    return (
      (hasSamples && (
        <div>
          <RequestHeader> Request samples </RequestHeader>

          <Tabs defaultIndex={0}>
            <TabList>
              {hasBodySample && <Tab key="payload"> Payload </Tab>}
              {samples.map(sample => <Tab key={sample.lang}>{sample.lang}</Tab>)}
            </TabList>
            {hasBodySample && (
              <TabPanel key="payload">
                <PayloadSamples content={requestBodyContent!} />
              </TabPanel>
            )}
            {samples.map(sample => (
              <TabPanel key={sample.lang}>
                <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
