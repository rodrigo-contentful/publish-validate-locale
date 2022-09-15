import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

const Dialog = () => {
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // console.log(sdk.parameters.invocation);
  const param = sdk.parameters.invocation;

  return (
    <>
    <Paragraph>Hello Dialog Component (AppId: {sdk.ids.app})</Paragraph>
    <Paragraph>Message: {param.message}</Paragraph>
    <Paragraph>{param.errMsg}</Paragraph>
    
    </>
  );
};

export default Dialog;
