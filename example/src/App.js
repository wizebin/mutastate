import React from 'react';
import LeftComponent from './components/LeftComponent';
import MiddleComponent from './components/MiddleComponent';
import RightComponent from './components/RightComponent';
import BasicCard from './components/BasicCard';

export default function App() {
  return (
    <div style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <BasicCard>
        <LeftComponent />
        <MiddleComponent />
        <RightComponent />
      </BasicCard>
      <BasicCard>
        <LeftComponent />
        <MiddleComponent />
        <RightComponent />
      </BasicCard>
    </div>
  );
}
